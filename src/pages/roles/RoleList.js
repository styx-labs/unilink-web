import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function RoleList() {
  const [roles, setRoles] = useState([]);
  const { companyId } = useParams();

  useEffect(() => {
    fetchRoles();
  }, [companyId]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles`
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}`
      );
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div>
      <h2>Roles</h2>
      <Link to="/">
        <button>Back to Companies</button>
      </Link>
      <Link to={`/companies/${companyId}/add-role`}>
        <button>Add Role</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.role_id}>
              <td>{role.role_name}</td>
              <td>{role.role_desc}</td>
              <td>
                <Link to={`/companies/${companyId}/roles/${role.role_id}/edit`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteRole(role.role_id)}>Delete</button>
                <Link
                  to={`/companies/${companyId}/roles/${role.role_id}/candidates`}
                >
                  <button>View Candidates</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoleList;
