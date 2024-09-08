import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import api from "../../api/axiosConfig";
import { Candidate } from "../../lib/types";
import { CandidateForm } from "./CandidateForm";

const fields = [
  { id: "candidate_first_name", label: "First Name", type: "input" as const },
  { id: "candidate_last_name", label: "Last Name", type: "input" as const },
  { id: "candidate_desc", label: "Description", type: "textarea" as const },
  { id: "linkedin", label: "LinkedIn", type: "url" as const },
  { id: "github", label: "Github", type: "url" as const },
  { id: "resume", label: "Resume", type: "textarea" as const },
  { id: "email", label: "Email", type: "email" as const },
  { id: "phone_number", label: "Phone Number", type: "tel" as const },
];

function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    candidate: Partial<Candidate>;
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

  const openEditForm = (candidate: Candidate) => {
    setFormData({ candidate, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ candidate: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedCandidate: Partial<Candidate>) => {
    if (formData.isEditing) {
      await updateCandidate(submittedCandidate as Candidate);
    } else {
      await addCandidate(submittedCandidate);
    }
    closeForm();
  };

  const addCandidate = async (candidate: Partial<Candidate>) => {
    try {
      const completeCandidate = fields.reduce((acc, field) => {
        acc[field.id as keyof Candidate] =
          candidate[field.id as keyof Candidate] ?? "";
        return acc;
      }, {} as Partial<Record<keyof Candidate, string | number>>);

      await api.post(`/candidates`, completeCandidate);
      fetchCandidates();
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/candidates`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (candidate: Candidate) => {
    try {
      await api.put(`/candidates/${candidate.candidate_id}`, candidate);
      setCandidates(
        candidates.map((c) =>
          c.candidate_id === candidate.candidate_id ? candidate : c
        )
      );
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  const deleteCandidate = async (id: string) => {
    try {
      await api.delete(`/candidates/${id}`);
      setCandidates(
        candidates.filter((candidate) => candidate.candidate_id !== id)
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
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
            { key: "candidate_desc", label: "Description" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "github", label: "Github" },
            { key: "resume", label: "Resume" },
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
