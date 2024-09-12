import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { LoadingSpinner } from "../ui/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthorizedDomain, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser || !isAuthorizedDomain(currentUser.email)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
