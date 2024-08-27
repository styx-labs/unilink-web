import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates`
      );
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`
      );
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <div>
      <h2>Candidates</h2>
      <Link to={`/companies/${companyId}/roles`}>
        <button>Back to Roles</button>
      </Link>
      <Link to={`/companies/${companyId}/roles/${roleId}/add-candidate`}>
        <button>Add Candidate</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.candidate_id}>
              <td>{`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone_number}</td>
              <td>
                <Link
                  to={`/companies/${companyId}/roles/${roleId}/candidates/${candidate.candidate_id}/edit`}
                >
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteCandidate(candidate.candidate_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidateList;
