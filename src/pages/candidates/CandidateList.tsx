import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import { CandidateForm } from "./CandidateForm";
import {
  CandidateWithId,
  CandidateCreate,
  CandidateUpdate,
} from "../../client/types.gen";
import {
  listCandidatesEndpointCandidatesGet,
  createCandidateEndpointCandidatesPost,
  updateCandidateEndpointCandidatesCandidateIdPut,
  deleteCandidateEndpointCandidatesCandidateIdDelete,
} from "../../client/services.gen";
import {
  CandidateCreateSchema,
  CandidateUpdateSchema,
} from "../../client/schemas.gen";
function CandidateList() {
  const [candidates, setCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    candidate: Partial<CandidateWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    candidate: {},
    isOpen: false,
    isEditing: false,
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const openAddForm = () => {
    setFormData({ candidate: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (candidate: CandidateWithId) => {
    setFormData({ candidate, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ candidate: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedCandidate: Partial<CandidateWithId>) => {
    if (formData.isEditing) {
      await updateCandidate(submittedCandidate as CandidateWithId);
    } else {
      await addCandidate(submittedCandidate);
    }
    closeForm();
  };

  const addCandidate = async (candidate: Partial<CandidateWithId>) => {
    const completeCandidate = Object.keys(
      CandidateCreateSchema.properties
    ).reduce((acc, key) => {
      if (
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "github_rating"
      ) {
        acc[key as keyof CandidateCreate] =
          (candidate[key as keyof CandidateCreate] as any) ?? "";
      }
      return acc;
    }, {} as Partial<CandidateCreate>);

    const { error } = await createCandidateEndpointCandidatesPost({
      body: completeCandidate as CandidateCreate,
    });
    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    const { data, error } = await listCandidatesEndpointCandidatesGet();
    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      setCandidates(data!);
    }
    setLoading(false);
  };

  const updateCandidate = async (candidate: CandidateWithId) => {
    const completeCandidate = Object.keys(
      CandidateUpdateSchema.properties
    ).reduce((acc, key) => {
      if (
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "github_rating"
      ) {
        acc[key as keyof CandidateUpdate] =
          (candidate[key as keyof CandidateUpdate] as any) ?? "";
      }
      return acc;
    }, {} as Partial<CandidateUpdate>);
    const { error } = await updateCandidateEndpointCandidatesCandidateIdPut({
      body: completeCandidate as CandidateUpdate,
      path: { candidate_id: candidate.candidate_id },
    });
    if (error) {
      console.error("Error updating candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const deleteCandidate = async (id: string) => {
    const { error } = await deleteCandidateEndpointCandidatesCandidateIdDelete({
      path: { candidate_id: id },
    });
    if (error) {
      console.error("Error deleting candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidates
          </h2>
          <div className="flex space-x-2">
            <Button onClick={openAddForm}>
              <Plus className="mr-2 h-4 w-4" /> Add New Candidate
            </Button>
          </div>
        </div>
        <DataTable
          columns={[
            { key: "candidate_first_name", label: "First Name" },
            { key: "candidate_last_name", label: "Last Name" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "github", label: "Github" },
            {
              key: "resume",
              label: "Resume",
              render: (value) =>
                value ? (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  ""
                ),
            },
            { key: "email", label: "Email" },
            { key: "phone_number", label: "Phone Number" },
          ]}
          data={candidates}
          onEdit={openEditForm}
          onDelete={deleteCandidate}
          detailsPath={(candidate) => `/candidates/${candidate.candidate_id}`}
          idField="candidate_id"
          isLoading={loading}
        />
      </div>

      <CandidateForm
        candidate={formData.candidate}
        onSubmit={handleSubmit}
        open={formData.isOpen}
        onOpenChange={closeForm}
        title={formData.isEditing ? "Edit Candidate" : "Add Candidate"}
        description={
          formData.isEditing
            ? "Make changes to the candidate here."
            : "Enter the details for the new candidate here."
        }
      />
    </div>
  );
}

export default CandidateList;
