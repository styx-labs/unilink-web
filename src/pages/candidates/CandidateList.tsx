import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";
import api from "../../api/axiosConfig";
import { InputField, TextareaField } from "../../components/GenericInputFields";
import { Candidate } from "../../lib/types";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({});
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );

  useEffect(() => {
    fetchCandidates();
  }, []);

  const addCandidate = async () => {
    try {
      const completeCandidate = fields.reduce((acc, field) => {
        acc[field.id as keyof Candidate] =
          newCandidate[field.id as keyof Candidate] ?? "";
        return acc;
      }, {} as Partial<Record<keyof Candidate, string | number>>);

      await api.post(`/candidates`, completeCandidate);
      fetchCandidates();
      setIsAddModalOpen(false);
      setNewCandidate({});
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

  const updateCandidate = async () => {
    if (!editingCandidate) return;
    try {
      await api.put(
        `/candidates/${editingCandidate.candidate_id}`,
        editingCandidate
      );
      setCandidates(
        candidates.map((candidate) =>
          candidate.candidate_id === editingCandidate.candidate_id
            ? editingCandidate
            : candidate
        )
      );
      setEditingCandidate(null);
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
            <Button onClick={() => setIsAddModalOpen(true)}>
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
          onEdit={setEditingCandidate}
          onDelete={deleteCandidate}
          detailsPath={(candidate) => `/candidates/${candidate.candidate_id}`}
          idField="candidate_id"
          isLoading={loading}
        />
      </div>

      <DialogForm
        title="Add New Candidate"
        description="Enter the details for the new candidate here."
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={addCandidate}
      >
        {fields.map((field) => {
          switch (field.type) {
            case "input":
            case "url":
            case "email":
            case "tel":
              return (
                <InputField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={
                    (newCandidate[field.id as keyof Candidate] as string) || ""
                  }
                  onChange={(id, value) =>
                    setNewCandidate({ ...newCandidate, [id]: value })
                  }
                />
              );
            case "textarea":
              return (
                <TextareaField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={
                    (newCandidate[field.id as keyof Candidate] as string) || ""
                  }
                  onChange={(id, value) =>
                    setNewCandidate({ ...newCandidate, [id]: value })
                  }
                />
              );
            default:
              return null;
          }
        })}
      </DialogForm>

      <DialogForm
        title="Edit Candidate"
        description="Make changes to the candidate here."
        open={!!editingCandidate}
        onOpenChange={() => setEditingCandidate(null)}
        onSubmit={updateCandidate}
      >
        {fields.map((field) => {
          switch (field.type) {
            case "input":
            case "url":
            case "email":
            case "tel":
              return (
                <InputField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={
                    (editingCandidate?.[
                      field.id as keyof Candidate
                    ] as string) || ""
                  }
                  onChange={(id, value) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      [id]: value,
                    } as Candidate)
                  }
                />
              );
            case "textarea":
              return (
                <TextareaField
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  value={
                    (editingCandidate?.[
                      field.id as keyof Candidate
                    ] as string) || ""
                  }
                  onChange={(id, value) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      [id]: value,
                    } as Candidate)
                  }
                />
              );
            default:
              return null;
          }
        })}
      </DialogForm>
    </div>
  );
}

export default CandidateList;
