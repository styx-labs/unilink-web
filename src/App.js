import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CandidateList from "./pages/candidates/CandidateList";
import CandidatePage from "./pages/candidates/CandidatePage";
import CompanyList from "./pages/companies/CompanyList";
import LoginPage from "./pages/login/LoginPage";
import { LoadingSpinner } from "./components/ui/loader";
import RoleList from "./pages/roles/RoleList";
import UserMenu from "./components/UserMenu";
import "./styles/global.css";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="container mx-auto p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            <Link to="/">UniLink</Link>
          </h1>
          {user && <UserMenu user={user} />}
        </header>
        <div className="flex flex-col gap-4">
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
                  path="/companies/:companyId/roles/:roleId/candidates"
                  element={<CandidateList />}
                />
                <Route
                  path="/companies/:companyId/roles/:roleId/candidates/:candidateId"
                  element={<CandidatePage />}
                />
              </>
            ) : (
              <Route path="*" element={<Navigate replace to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
