import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import Loader from "../../components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import BreadCrumbs from "../../components/breadcrumbs";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/companies/${companyId}/roles/${roleId}/candidates`
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
        `${process.env.REACT_APP_API_BASE}/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`
      );
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
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
          <div className="flex items-center space-x-2">
            <h2>Candidates</h2>
            <Link to={`/companies/${companyId}/roles`}>
              <Button>Back to Roles</Button>
            </Link>
            <Link to={`/companies/${companyId}/roles/${roleId}/add-candidate`}>
              <Button>Add Candidate</Button>
            </Link>
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
                {candidates.map((candidate: any) => (
                  <TableRow key={candidate.candidate_id}>
                    <TableCell>{`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}</TableCell>
                    <TableCell>
                      <a href={candidate.linkedin}>{candidate.linkedin}</a>
                    </TableCell>
                    <TableCell>{candidate.score}</TableCell>
                    <TableCell>{candidate.review}</TableCell>
                    <TableCell>
                      <Link
                        to={`/companies/${companyId}/roles/${roleId}/candidates/${candidate.candidate_id}/edit`}
                      >
                        <Button>Edit</Button>
                      </Link>
                      <Button
                        onClick={() => deleteCandidate(candidate.candidate_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateList;
