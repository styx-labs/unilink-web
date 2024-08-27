import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditCandidate() {
  const [formData, setFormData] = useState({
    candidate_first_name: "",
    candidate_last_name: "",
    candidate_desc: "",
    linkedin: "",
    github: "",
    resume: "",
    email: "",
    phone_number: "",
  });
  const navigate = useNavigate();
  const { companyId, roleId, candidateId } = useParams();

  useEffect(() => {
    fetchCandidate();
  }, [companyId, roleId, candidateId]);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching candidate:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateCandidate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`,
        formData
      );
      navigate(`/companies/${companyId}/roles/${roleId}/candidates`);
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  };

  return (
    <div>
      <h2>Edit Candidate</h2>
      <Link to={`/companies/${companyId}/roles/${roleId}/candidates`}>
        <button>Back to Candidates</button>
      </Link>
      <form onSubmit={updateCandidate}>
        <input
          type="text"
          name="candidate_first_name"
          value={formData.candidate_first_name}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="candidate_last_name"
          value={formData.candidate_last_name}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          name="candidate_desc"
          value={formData.candidate_desc}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleInputChange}
          placeholder="LinkedIn"
        />
        <input
          type="text"
          name="github"
          value={formData.github}
          onChange={handleInputChange}
          placeholder="GitHub"
        />
        <input
          type="text"
          name="resume"
          value={formData.resume}
          onChange={handleInputChange}
          placeholder="Resume Link"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          placeholder="Phone Number"
        />
        <button type="submit">Update Candidate</button>
      </form>
    </div>
  );
}

export default EditCandidate;
