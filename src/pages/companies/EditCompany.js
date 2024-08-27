import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditCompany() {
  const [formData, setFormData] = useState({
    company_name: "",
    company_desc: "",
    founders: "",
  });
  const navigate = useNavigate();
  const { companyId } = useParams();

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(
        `https://unilink-app-zzkox64kyq-uc.a.run.app/companies/${companyId}`
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://unilink-app-zzkox64kyq-uc.a.run.app/companies/${companyId}`, formData);
      navigate("/");
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  return (
    <div>
      <h2>Edit Company</h2>
      <Link to="/">
        <button className="back-btn">Back to List</button>
      </Link>
      <form onSubmit={updateCompany}>
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
        <button type="submit">Update Company</button>
      </form>
    </div>
  );
}

export default EditCompany;
