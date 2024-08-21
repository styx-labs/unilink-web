import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyList from "./pages/CompanyList";
import AddCompany from "./pages/AddCompany";
import RoleList from "./pages/RoleList";
import AddRole from "./pages/AddRole";
import EditCompany from "./pages/EditCompany";
import EditRole from "./pages/EditRole";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>UniLink</h1>
        <Routes>
          <Route path="/" element={<CompanyList />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/companies/:companyId/roles" element={<RoleList />} />
          <Route path="/companies/:companyId/add-role" element={<AddRole />} />
          <Route path="/companies/:companyId/edit" element={<EditCompany />} />
          <Route
            path="/companies/:companyId/roles/:roleId/edit"
            element={<EditRole />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
