import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import CompanyList from "./pages/companies/CompanyList";
import RoleList from "./pages/roles/RoleList";
import CandidateList from "./pages/candidates/CandidateList";
import GoogleSignIn from "./components/GoogleSignIn";
import { Navigate } from "react-router-dom";
import "./styles/global.css";
import { Link } from "react-router-dom";
import CandidatePage from "./pages/candidates/CandidatePage";

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
              <Route path="/" element={<Navigate replace to="/companies" />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route
                path="/companies/:companyId/roles"
                element={<RoleList />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/candidates"
                element={<CandidateList />}
              />
              <Route
                path="/companies/:companyId/roles/:roleId/candidates/:candidateId"
                element={<CandidatePage />}
              />
            </Routes>
          ) : null}
        </div>
      </div>
    </Router>
  );
}

export default App;
