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
import CandidateRoleList from "./pages/candidateRole/CandidateRoleList";
import CandidatePage from "./pages/candidates/CandidatePage";
import CandidateRolePage from "./pages/candidateRole/CandidateRolePage";
import CandidateRoleExternal from "./pages/candidateRole/CandidateRoleExternal";
import CompanyList from "./pages/companies/CompanyList";
import SubmissionSuccess from "./pages/candidateRole/SubmissionSuccess"
import LoginPage from "./pages/login/LoginPage";
import { Loader } from "./components/ui/loader";
import RoleList from "./pages/roles/RoleList";
import UserMenu from "./components/UserMenu";
import Sidebar from "./components/Sidebar";
import { Link } from "react-router-dom";
import "./styles/global.css";
import { client } from "./client/services.gen";
import { appCheck } from "./firebase/firebase";
import { getToken } from "firebase/app-check";
import { AuthProvider } from "./contexts/authContext";
import UnauthorizedPage from "./pages/login/UnauthorizedLogin";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

client.setConfig({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
});

client.interceptors.request.use(async (request) => {
  const token = await getToken(appCheck, /* forceRefresh */ false);
  request.headers.set("X-Firebase-AppCheck", token.token);
  return request;
});

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {user && <Sidebar />}
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
              <Link to="/">
                <h1 className="text-3xl font-bold text-primary">UniLink</h1>
              </Link>
              {user && <UserMenu user={user} />}
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/submission-success" element={<SubmissionSuccess />} />
                <Route
                  path="/companies/:companyId/roles/:roleId/external"
                  element={<CandidateRoleExternal />}
                />
                {user ? (
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Routes>
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
                            path="/companies/:companyId/roles/:roleId/candidates"
                            element={<CandidateRoleList />}
                          />
                          <Route
                            path="/companies/:companyId/roles/:roleId/candidates/:candidateId"
                            element={<CandidateRolePage />}
                          />
                          <Route
                            path="/candidates"
                            element={<CandidateList />}
                          />
                          <Route
                            path="/candidates/:candidateId"
                            element={<CandidatePage />}
                          />
                          <Route path="/roles" element={<RoleList />} />
                        </Routes>
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  <Route path="*" element={<Navigate replace to="/login" />} />
                )}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
