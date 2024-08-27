import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import { getToken } from "firebase/app-check";
// import { appCheck } from "../../firebase/firebase";

function AddCompany() {
  const [formData, setFormData] = useState({
    company_name: "",
    company_desc: "",
    founders: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createCompany = async (e) => {
    e.preventDefault();
    try {
      // const appCheckTokenResponse = await getToken(appCheck, false);

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/companies`,
        formData
        // {
        //   headers: {
        //     "X-Firebase-AppCheck": appCheckTokenResponse.token,
        //   },
        // }
      );
      navigate("/");
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  return (
    <div>
      <h2>Add New Company</h2>
      <Link to="/">
        <button className="back-btn">Back to List</button>
      </Link>
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
    </div>
  );
}

export default AddCompany;
