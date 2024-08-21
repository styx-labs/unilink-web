import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company_name: "",
    company_desc: "",
    founders: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/companies");
      setCompanies(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/companies", formData);
      fetchCompanies();
      setFormData({ company_name: "", company_desc: "", founders: "" });
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const updateCompany = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/companies/${id}`, formData);
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company:", error);
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
    <div className="App">
      <h1>Company CRUD App</h1>
      <form onSubmit={createCompany}>
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="company_desc"
          value={formData.company_desc}
          onChange={handleInputChange}
          placeholder="Company Description"
          required
        />
        <input
          type="text"
          name="founders"
          value={formData.founders}
          onChange={handleInputChange}
          placeholder="Founders"
          required
        />
        <button type="submit">Create Company</button>
      </form>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.company_name} - {company.company_desc} - {company.founders}
            <button onClick={() => updateCompany(company.id)}>Update</button>
            <button onClick={() => deleteCompany(company.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
