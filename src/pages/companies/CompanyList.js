import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/companies`
      );
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/companies/${id}`
      );
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mt-8">
      <Link to="/add-company" className="mb-4 inline-block">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Company
        </button>
      </Link>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Founders</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {companies.map((company) => (
            <tr key={company.company_id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{company.company_name}</td>
              <td className="py-3 px-6 text-left">{company.company_desc}</td>
              <td className="py-3 px-6 text-left">{company.founders}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <Link to={`/companies/${company.company_id}/roles`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">View Roles</button>
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                    onClick={() => deleteCompany(company.company_id)}
                  >
                    Delete
                  </button>
                  <Link to={`/companies/${company.company_id}/edit`}>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Edit</button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyList;
