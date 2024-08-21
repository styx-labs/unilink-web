import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditRole() {
  const [formData, setFormData] = useState({
    role_name: "",
    role_desc: "",
  });
  const navigate = useNavigate();
  const { companyId, roleId } = useParams();

  useEffect(() => {
    fetchRole();
  }, [companyId, roleId]);

  const fetchRole = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/companies/${companyId}/roles/${roleId}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateRole = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/companies/${companyId}/roles/${roleId}`,
        formData
      );
      navigate(`/companies/${companyId}/roles`);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div>
      <h2>Edit Role</h2>
      <Link to={`/companies/${companyId}/roles`}>
        <button>Back to Roles</button>
      </Link>
      <form onSubmit={updateRole}>
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
        <button type="submit">Update Role</button>
      </form>
    </div>
  );
}

export default EditRole;
