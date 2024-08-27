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
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies`
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${id}`
      );
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
            <tr key={company.company_id}>
              <td>{company.company_name}</td>
              <td>{company.company_desc}</td>
              <td>{company.founders}</td>
              <td>
                <Link to={`/companies/${company.company_id}/roles`}>
                  <button className="view-btn">View Roles</button>
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => deleteCompany(company.company_id)}
                >
                  Delete
                </button>
                <Link to={`/companies/${company.company_id}/edit`}>
                  <button className="update-btn">Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyList;
