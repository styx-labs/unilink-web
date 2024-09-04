import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CandidateList from "./pages/candidates/CandidateList";
import CandidateRoleList from "./pages/candidates/CandidateRoleList";
import CandidatePage from "./pages/candidates/CandidatePage";
import CompanyList from "./pages/companies/CompanyList";
import LoginPage from "./pages/login/LoginPage";
import { LoadingSpinner } from "./components/ui/loader";
import RoleList from "./pages/roles/RoleList";
import UserMenu from "./components/UserMenu";
import Sidebar from "./components/Sidebar";
import "./styles/global.css";

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">UniLink</h1>
            {user && <UserMenu user={user} />}
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {user ? (
                <>
                  <Route
                    path="/"
                    element={<Navigate replace to="/companies" />}
                  />
                  <Route path="/companies" element={<CompanyList />} />
                  <Route
                    path="/companies/:companyId/roles"
                    element={<RoleList />}
                  />
                  <Route
                    path="/companies/:companyId/roles/:roleId/candidates/:candidateId"
                    element={<CandidatePage nested={true} />}
                  />
                  <Route
                    path="/companies/:companyId/roles/:roleId/candidates"
                    element={<CandidateRoleList />}
                  />
                  <Route path="/candidates" element={<CandidateList />} />
                  <Route
                    path="/candidates/:candidateId"
                    element={<CandidatePage nested={false} />}
                  />
                  <Route path="/roles" element={<RoleList />} />
                </>
              ) : (
                <Route path="*" element={<Navigate replace to="/login" />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
