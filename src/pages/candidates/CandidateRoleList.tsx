import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import AddExistingCandidatesDialog from "./AddExistingCandidatesDialog";
import {
  CandidateRole,
  Candidate,
  CandidateRoleStatus,
  CandidateRoleNoteType,
  CandidateRoleNote,
} from "../../lib/types";
import DialogForm from "../../components/DialogForm";

const fields = [
  {
    id: "candidate_role_status",
    label: "Status",
    type: "select" as const,
    options: Object.values(CandidateRoleStatus),
  },
  {
    id: "candidate_role_notes",
    label: "Notes",
    type: "notes" as const,
    options: Object.values(CandidateRoleNoteType),
  },
];

function CandidateRoleList() {
  const [candidates, setCandidates] = useState<CandidateRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddExistingModalOpen, setIsAddExistingModalOpen] =
    useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateNotes, setCandidateNotes] = useState<CandidateRoleNote[]>([]);
  const [editingCandidateRole, setEditingCandidateRole] =
    useState<CandidateRole | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  useEffect(() => {
    fetchAllCandidates();
  }, [candidates]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/companies/${companyId}/roles/${roleId}/candidates`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const response = await api.get("/candidates");
      const existingCandidateIds = new Set(
        candidates.map((c) => c.candidate_id)
      );
      const filteredCandidates = response.data.filter(
        (candidate: Candidate) =>
          !existingCandidateIds.has(candidate.candidate_id)
      );
      setAllCandidates(filteredCandidates);
    } catch (error) {
      console.error("Error fetching all candidates:", error);
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      await api.delete(
        `/companies/${companyId}/roles/${roleId}/candidates/${id}`
      );
      setCandidates(
        candidates.filter((candidate) => candidate.candidate_id !== id)
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const addExistingCandidates = async () => {
    if (selectedCandidates.length === 0) return;
    try {
      await Promise.all(
        selectedCandidates.map((candidateId) =>
          api.post(`/companies/${companyId}/roles/${roleId}/candidates`, {
            candidate_id: candidateId,
            candidate_role_notes: candidateNotes,
          })
        )
      );
      fetchCandidates();
      setIsAddExistingModalOpen(false);
      setSelectedCandidates([]);
      setCandidateNotes([]);
    } catch (error) {
      console.error("Error adding existing candidates:", error);
    }
  };

  const updateCandidateRole = async () => {
    if (!editingCandidateRole) return;
    try {
      await api.put(
        `/companies/${companyId}/roles/${roleId}/candidates/${editingCandidateRole.candidate_id}`,
        editingCandidateRole
      );
      fetchCandidates();
      setEditingCandidateRole(null);
    } catch (error) {
      console.error("Error updating candidate role:", error);
    }
  };

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs
        items={[
          { label: "Companies", path: "/" },
          { label: "Roles", path: `/companies/${companyId}/roles` },
          {
            label: "Candidates",
            path: `/companies/${companyId}/roles/${roleId}/candidates`,
          },
        ]}
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidates
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddExistingModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Existing Candidate
            </Button>
          </div>
        </div>
        {candidates.length === 0 && !loading ? (
          <p>No candidates found.</p>
        ) : (
          <DataTable
            columns={[
              { key: "candidate_role_status", label: "Status" },
              {
                key: "candidate_first_name",
                label: "First Name",
              },
              {
                key: "candidate_last_name",
                label: "Last Name",
              },
              { key: "linkedin", label: "LinkedIn" },
              { key: "candidate_role_notes", label: "Notes" },
            ]}
            data={candidates.map((candidate) => ({
              ...candidate,
              candidate_first_name: candidate.candidate.candidate_first_name,
              candidate_last_name: candidate.candidate.candidate_last_name,
              linkedin: candidate.candidate.linkedin,
              candidate_role_notes: candidate.candidate_role_notes,
              candidate_role_status: candidate.candidate_role_status,
            }))}
            onDelete={deleteCandidate}
            onEdit={(candidate) => {
              setEditingCandidateRole(candidate);
              setIsEditModalOpen(true);
            }}
            detailsPath={(candidate) => `/candidates/${candidate.candidate_id}`}
            idField="candidate_id"
            isLoading={loading}
          />
        )}
      </div>

      <AddExistingCandidatesDialog
        open={isAddExistingModalOpen}
        onOpenChange={setIsAddExistingModalOpen}
        allCandidates={allCandidates}
        selectedCandidates={selectedCandidates}
        toggleCandidateSelection={toggleCandidateSelection}
        candidateNotes={candidateNotes}
        setCandidateNotes={setCandidateNotes}
        addExistingCandidates={addExistingCandidates}
      />

      <DialogForm
        title="Edit Candidate Role"
        description="Edit the candidate role here."
        fields={fields}
        open={!!editingCandidateRole}
        onOpenChange={() => setEditingCandidateRole(null)}
        onSubmit={updateCandidateRole}
        values={editingCandidateRole || {}}
        setValues={(newValues) =>
          setEditingCandidateRole(newValues as CandidateRole)
        }
      />
    </div>
  );
}

export default CandidateRoleList;
