import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Candidate } from "./CandidateList";
import AddExistingCandidatesDialog from "./AddExistingCandidatesDialog";
import DialogForm from "../../components/DialogForm";

interface CandidateRole {
  candidate_id: string;
  candidate: Candidate;
  notes: string;
  created_at: string;
  updated_at: string;
}

const fields = [
  { id: "candidate_first_name", label: "First Name", type: "input" as const },
  { id: "candidate_last_name", label: "Last Name", type: "input" as const },
  { id: "candidate_desc", label: "Description", type: "textarea" as const },
  { id: "linkedin", label: "LinkedIn", type: "input" as const },
  { id: "github", label: "Github", type: "input" as const },
  { id: "resume", label: "Resume", type: "textarea" as const },
  { id: "email", label: "Email", type: "input" as const },
  { id: "phone_number", label: "Phone Number", type: "input" as const },
];

function CandidateRoleList() {
  const [candidates, setCandidates] = useState<CandidateRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddExistingModalOpen, setIsAddExistingModalOpen] =
    useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateNotes, setCandidateNotes] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({});

  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
    fetchAllCandidates();
  }, [companyId, roleId]);

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
        (candidate: CandidateRole) =>
          !existingCandidateIds.has(candidate.candidate_id)
      );
      setAllCandidates(filteredCandidates);
    } catch (error) {
      console.error("Error fetching all candidates:", error);
    }
  };

  const deleteCandidateRole = async (id: string) => {
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
            notes: candidateNotes,
          })
        )
      );
      fetchCandidates();
      setIsAddExistingModalOpen(false);
      setSelectedCandidates([]);
      setCandidateNotes("");
    } catch (error) {
      console.error("Error adding existing candidates:", error);
    }
  };

  const addCandidate = async () => {
    try {
      const completeCandidate = fields.reduce((acc, field) => {
        acc[field.id as keyof Candidate] =
          newCandidate[field.id as keyof Candidate] ?? "";
        return acc;
      }, {} as Partial<Record<keyof Candidate, string | number>>);

      await api.post(`/companies/${companyId}/roles/${roleId}/candidates/create`, completeCandidate);
      fetchCandidates();
      setIsAddModalOpen(false);
      setNewCandidate({});
    } catch (error) {
      console.error("Error adding candidate:", error);
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
            <div className="flex space-x-2">
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Candidate
            </Button>
          </div>
          </div>
        </div>
        {candidates.length === 0 ? (
          <p>No candidates found.</p>
        ) : (
          <DataTable
            columns={[
              {
                key: "candidate_first_name",
                label: "First Name",
              },
              {
                key: "candidate_last_name",
                label: "Last Name",
              },
              { key: "linkedin", label: "LinkedIn" },
              { key: "notes", label: "Notes" },
            ]}
            data={candidates.map((candidate) => ({
              ...candidate,
              candidate_first_name: candidate.candidate.candidate_first_name,
              candidate_last_name: candidate.candidate.candidate_last_name,
              linkedin: candidate.candidate.linkedin,
              notes: candidate.notes,
            }))}
            onDelete={deleteCandidateRole}
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
        title="Add New Candidate"
        description="Enter the details for the new candidate here."
        fields={fields}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={addCandidate}
        values={newCandidate}
        setValues={setNewCandidate}
      />
    </div>
  );
}

export default CandidateRoleList;
