import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function AddRole() {
  const [formData, setFormData] = useState({
    role_name: "",
    role_desc: "",
  });
  const navigate = useNavigate();
  const { companyId } = useParams();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRole = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE}/companies/${companyId}/roles`,
        formData
      );
      navigate(`/companies/${companyId}/roles`);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  return (
    <div>
      <h2>Add New Role</h2>
      <Link to={`/companies/${companyId}/roles`}>
        <button>Back to Roles</button>
      </Link>
      <form onSubmit={createRole}>
        <input
          type="text"
          name="role_name"
          value={formData.role_name}
          onChange={handleInputChange}
          placeholder="Role Name"
          required
        />
        <input
          type="text"
          name="role_desc"
          value={formData.role_desc}
          onChange={handleInputChange}
          placeholder="Role Description"
          required
        />
        <button type="submit">Create Role</button>
      </form>
    </div>
  );
}

export default AddRole;
