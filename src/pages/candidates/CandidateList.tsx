import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import Loader from "../../components/Loader";

import { useParams, Link } from "react-router-dom";
import { ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface Candidate {
  candidate_id: string | undefined;
  candidate_first_name: string | undefined;
  candidate_last_name: string | undefined;
  candidate_desc: string | null;
  linkedin: string | undefined;
  github: string | undefined;
  resume: string | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  generated_desc: string | undefined;
  generated_score: number | 0;
  created_at: string | undefined;
  updated_at: string | undefined;
}

const fields = {
  candidates: [
    { id: "candidate_first_name", label: "First Name", type: "input" },
    { id: "candidate_last_name", label: "Last Name", type: "input" },
    { id: "candidate_desc", label: "Description", type: "textarea" },
    { id: "linkedin", label: "LinkedIn", type: "input" },
    { id: "github", label: "Github", type: "input" },
    { id: "resume", label: "Resume", type: "textarea" },
    { id: "email", label: "Email", type: "input" },
    { id: "phone_number", label: "Phone Number", type: "input" },
    { id: "generated_desc", label: "Generated Description", type: "textarea" },
    { id: "generated_score", label: "Generated Score", type: "input" },
  ],
};

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

  const deleteCandidate = async (candidateId: any) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`
      );
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
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
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${editingCandidate?.candidate_id}`,
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
    return <Loader />;
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
        {candidates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.candidate_id}>
                  <TableCell>{`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}</TableCell>
                  <TableCell>
                    <a
                      href={candidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {candidate.linkedin}
                    </a>
                  </TableCell>
                  <TableCell>{candidate.generated_score}</TableCell>
                  <TableCell>{candidate.generated_desc}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCandidate(candidate)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCandidate(candidate.candidate_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No candidates found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Get started by adding a new candidate.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Candidate
            </Button>
            <Button onClick={findLinkedInCandidates}>
              <Plus className="mr-2 h-4 w-4" /> Find LinkedIn Candidates
            </Button>
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Enter the details for the new candidate here.
            </DialogDescription>
          </DialogHeader>
          {fields.candidates.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              {field.type === "input" ? (
                <Input
                  id={field.id}
                  type="text"
                  value={newCandidate?.[field.id as keyof Candidate] || ""}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      [field.id]: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              ) : (
                <Textarea
                  id={field.id}
                  value={newCandidate?.[field.id as keyof Candidate] || ""}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      [field.id]: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" onClick={addCandidate}>
              Save Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Modal */}
      <Dialog
        open={!!editingCandidate}
        onOpenChange={() => setEditingCandidate(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>
              Make changes to the candidate here.
            </DialogDescription>
          </DialogHeader>
          {/* Form fields similar to CompanyList */}
          <DialogFooter>
            <Button type="submit" onClick={updateCandidate}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CandidateList;
