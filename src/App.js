import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import CompanyList from "./pages/companies/CompanyList";
import AddCompany from "./pages/companies/AddCompany";
import RoleList from "./pages/roles/RoleList";
import AddRole from "./pages/roles/AddRole";
import EditCompany from "./pages/companies/EditCompany";
import EditRole from "./pages/roles/EditRole";
import CandidateList from "./pages/candidates/CandidateList";
import AddCandidate from "./pages/candidates/AddCandidate";
import EditCandidate from "./pages/candidates/EditCandidate";
import "./App.css";
import GoogleSignIn from "./components/GoogleSignIn";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center py-6 bg-blue-600 text-white">UniLink</h1>
        <div className="container mx-auto px-4">
          <GoogleSignIn />
          {user ? (
            <Routes>
              <Route path="/" element={<CompanyList />} />
              <Route path="/add-company" element={<AddCompany />} />
              <Route path="/companies/:companyId/roles" element={<RoleList />} />
              <Route
                path="/companies/:companyId/add-role"
                element={<AddRole />}
              />
              <Route
                path="/companies/:companyId/edit"
                element={<EditCompany />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/edit"
                element={<EditRole />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/candidates"
                element={<CandidateList />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/add-candidate"
                element={<AddCandidate />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/candidates/:candidateId/edit"
                element={<EditCandidate />}
              />
            </Routes>
          ) : null}
        </div>
      </div>
    </Router>
  );
}

export default App;
