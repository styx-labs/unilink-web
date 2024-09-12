import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="mb-4">You do not have permission to access this page.</p>
        <button
          onClick={handleSignOut}
          className="text-primary hover:underline cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
