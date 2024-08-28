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
import GoogleSignIn from "./components/GoogleSignIn";

import "./styles/global.css";
import { Link } from "react-router-dom";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="container mx-auto p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            <Link to="/">UniLink</Link>
          </h1>
        </header>
        <div className="flex flex-col gap-4">
          <GoogleSignIn />
          {user ? (
            <Routes>
              <Route path="/" element={<CompanyList />} />
              <Route path="/add-company" element={<AddCompany />} />
              <Route
                path="/companies/:companyId/"
                element={
                  <Routes>
                    <Route index element={<RoleList />} />
                    <Route path="add-role" element={<AddRole />} />
                    <Route path="edit" element={<EditCompany />} />
                    <Route path="roles/:roleId" element={<EditRole />} />
                    <Route
                      path="roles/:roleId/candidates"
                      element={<CandidateList />}
                    />
                    <Route
                      path="roles/:roleId/add-candidate"
                      element={<AddCandidate />}
                    />
                    <Route
                      path="roles/:roleId/candidates/:candidateId/edit"
                      element={<EditCandidate />}
                    />
                  </Routes>
                }
              />
            </Routes>
          ) : null}
        </div>
      </div>
    </Router>
  );
}

export default App;
