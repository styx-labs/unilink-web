import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../../components/ui/loader";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DialogForm from "../../components/DialogForm";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";

interface Candidate {
  candidate_id: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string | null;
  linkedin: string;
  github: string;
  resume: string;
  email: string;
  phone_number: string;
  generated_desc: string;
  generated_score: number;
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

function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({});
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );
  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${id}`
      );
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates`,
        newCandidate
      );
      fetchCandidates();
      setIsAddModalOpen(false);
      setNewCandidate({});
    } catch (error) {
      console.error("Error adding candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async () => {
    if (!editingCandidate) return;
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${editingCandidate.candidate_id}`,
        editingCandidate
      );
      fetchCandidates();
      setEditingCandidate(null);
    } catch (error) {
      console.error("Error updating candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const findLinkedInCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/linkedin`,
        {
          company_id: companyId,
          role_id: roleId,
        }
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error finding LinkedIn candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

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
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Candidate
            </Button>
            <Button onClick={findLinkedInCandidates}>
              <Plus className="mr-2 h-4 w-4" /> Find LinkedIn Candidates
            </Button>
          </div>
        </div>
        <DataTable
          columns={[
            { key: "candidate_first_name", label: "First Name" },
            { key: "candidate_last_name", label: "Last Name" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "generated_score", label: "Score" },
            { key: "generated_desc", label: "Review" },
          ]}
          data={candidates}
          onEdit={setEditingCandidate}
          onDelete={deleteCandidate}
          detailsPath={(candidate) =>
            `/companies/${companyId}/roles/${roleId}/candidates/${candidate.candidate_id}`
          }
          idField="candidate_id"
        />
      </div>

      <DialogForm
        title="Add Candidate"
        description="Enter the details for the new candidate here."
        fields={fields}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={addCandidate}
        values={newCandidate}
        setValues={setNewCandidate}
      />

      <DialogForm
        title="Edit Candidate"
        description="Make changes to the candidate here."
        fields={fields}
        open={!!editingCandidate}
        onOpenChange={() => setEditingCandidate(null)}
        onSubmit={updateCandidate}
        values={editingCandidate || {}}
        setValues={setEditingCandidate}
      />
    </div>
  );
}

export default CandidateList;
