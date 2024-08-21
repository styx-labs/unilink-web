import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyList from "./pages/CompanyList";
import AddCompany from "./pages/AddCompany";
import RoleList from "./pages/RoleList";
import AddRole from "./pages/AddRole";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
