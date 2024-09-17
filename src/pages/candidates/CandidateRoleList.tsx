import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { CandidateRoleForm } from "./CandidateRoleForm";
import { CandidateForm } from "./CandidateForm";
import { useParams } from "react-router-dom";
import { Markdown } from "../../components/Markdown";
import AddExistingCandidatesDialog from "./AddExistingCandidatesDialog";
import {
  CandidateRole,
  CandidateWithId,
  CandidateRoleNote,
  CriteriaScoringItem,
  CandidateRoleUpdate,
  CandidateCreate,
} from "../../client/types.gen";
import {
  listCandidatesCompaniesCompanyIdRolesRoleIdCandidatesGet,
  updateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut,
  deleteCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete,
  createCandidateCompaniesCompanyIdRolesRoleIdCandidatesCreatePost,
  listCandidatesCandidatesGet,
  addCandidateCompaniesCompanyIdRolesRoleIdCandidatesPost,
} from "../../client/services.gen";

function CandidateRoleList() {
  const [candidates, setCandidates] = useState<CandidateRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddExistingModalOpen, setIsAddExistingModalOpen] =
    useState<boolean>(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateNotes, setCandidateNotes] = useState<CandidateRoleNote[]>([]);
  const [formData, setFormData] = useState<{
    candidateRole: Partial<CandidateRole>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    candidateRole: {},
    isOpen: false,
    isEditing: false,
  });

  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  useEffect(() => {
    fetchAllCandidates();
  }, [candidates]);

  const fetchCandidates = async () => {
    setLoading(true);
    const { data, error } =
      await listCandidatesCompaniesCompanyIdRolesRoleIdCandidatesGet({
        path: { company_id: companyId || "", role_id: roleId || "" },
      });
    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  };

  const fetchAllCandidates = async () => {
    const { data, error } = await listCandidatesCandidatesGet();
    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      const existingCandidateIds = candidates.map(
        (candidate) => candidate.candidate_id
      );
      setAllCandidates(
        data?.filter(
          (candidate) => !existingCandidateIds.includes(candidate.candidate_id)
        ) || []
      );
    }
  };

  const deleteCandidate = async (id: string) => {
    const { error } =
      await deleteCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: id,
          },
        }
      );
    if (error) {
      console.error("Error deleting candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const addExistingCandidates = async () => {
    selectedCandidates.map(async (candidateId) => {
      const { error } =
        await addCandidateCompaniesCompanyIdRolesRoleIdCandidatesPost({
          path: { company_id: companyId || "", role_id: roleId || "" },
          body: {
            candidate_id: candidateId,
            candidate_role_notes: candidateNotes,
          },
        });
      if (error) {
        console.error("Error adding existing candidates:", error);
      } else {
        fetchCandidates();
        setIsAddExistingModalOpen(false);
        setSelectedCandidates([]);
        setCandidateNotes([]);
      }
    });
  };

  const updateCandidateRole = async (
    updatedCandidateRole: Partial<CandidateRole>
  ) => {
    const { error } =
      await updateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: updatedCandidateRole.candidate_id || "",
          },
          body: updatedCandidateRole as CandidateRoleUpdate,
        }
      );
    if (error) {
      console.error("Error updating candidate role:", error);
    } else {
      setFormData({ ...formData, isOpen: false, isEditing: false });
      fetchCandidates();
    }
  };

  const openEditForm = (candidateRole: CandidateRole) => {
    setFormData({ candidateRole, isOpen: true, isEditing: true });
  };

  const addCandidate = async (newCandidate: Partial<CandidateWithId>) => {
    const completeCandidate: CandidateCreate = {
      candidate_first_name: newCandidate.candidate_first_name ?? "",
      candidate_last_name: newCandidate.candidate_last_name ?? "",
      linkedin: newCandidate.linkedin ?? "",
      email: newCandidate.email ?? "",
      phone_number: newCandidate.phone_number ?? "",
      github: newCandidate.github ?? "",
      candidate_desc: newCandidate.candidate_desc ?? "",
      resume: newCandidate.resume ?? "",
    };
    const { error } =
      await createCandidateCompaniesCompanyIdRolesRoleIdCandidatesCreatePost({
        path: { company_id: companyId || "", role_id: roleId || "" },
        body: completeCandidate as CandidateCreate,
      });
    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      setIsAddNewModalOpen(false);
      fetchCandidates();
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
            <Button onClick={() => setIsAddNewModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Candidate
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
              {
                key: "candidate_role_generated_description",
                label: "Generated Description",
                render: (value: string | null) =>
                  value ? (
                    <Markdown content={value} />
                  ) : (
                    "No description generated"
                  ),
              },
              {
                key: "criteria_scores",
                label: "Criteria Scores",
                render: (scores: CriteriaScoringItem[]) =>
                  scores
                    ? scores
                        .map((s) => `${s.criteria_name}: ${s.score}`)
                        .join(", ")
                    : "",
              },
            ]}
            data={candidates.map((candidate) => ({
              ...candidate,
              candidate_first_name: candidate.candidate?.candidate_first_name,
              candidate_last_name: candidate.candidate?.candidate_last_name,
              linkedin: candidate.candidate?.linkedin,
              candidate_role_notes: candidate.candidate_role_notes,
              candidate_role_status: candidate.candidate_role_status,
              criteria_scores: candidate.criteria_scores,
              candidate_role_generated_description:
                candidate.candidate_role_generated_description,
            }))}
            onDelete={deleteCandidate}
            onEdit={(candidate) => openEditForm(candidate)}
            detailsPath={(candidate) =>
              `/companies/${companyId}/roles/${roleId}/candidates/${candidate.candidate_id}`
            }
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
        addExistingCandidates={addExistingCandidates}
      />

      <CandidateForm
        candidate={{}}
        onSubmit={addCandidate}
        open={isAddNewModalOpen}
        onOpenChange={setIsAddNewModalOpen}
        title="Add New CandidateWithId
    "
        description="Enter the details for the new candidate here."
      />

      <CandidateRoleForm
        candidateRole={formData.candidateRole}
        onSubmit={updateCandidateRole}
        open={formData.isOpen}
        onOpenChange={(open) => setFormData({ ...formData, isOpen: open })}
        isEditing={formData.isEditing}
        companyId={companyId || ""}
        roleId={roleId || ""}
      />
    </div>
  );
}

export default CandidateRoleList;
