import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CompanyList() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/companies/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div>
      <Link to="/add-company">
        <button>Add Company</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Description</th>
            <th>Founders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.company_name}</td>
              <td>{company.company_desc}</td>
              <td>{company.founders}</td>
              <td>
                <Link to={`/companies/${company.id}/roles`}>
                  <button>View Roles</button>
                </Link>
                <button onClick={() => deleteCompany(company.id)}>
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

export default CompanyList;