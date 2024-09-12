import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext<{
  currentUser: any;
  userLoggedIn: boolean;
  loading: boolean;
  isAuthorizedDomain: (email: string) => boolean;
}>({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
  isAuthorizedDomain: () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const initializeUser = (user: any) => {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };

  const isAuthorized = (email: string) => {
    // This is a temporary solution to allow access to the app for testing purposes. In the future, we should use custom claims to manage access to the app and features.
    const whitelistedEmails = ["jasonhe.md@gmail.com"];
    return (
      whitelistedEmails.includes(email) || email.endsWith("@joinunilink.com")
    );
  };

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    isAuthorizedDomain: isAuthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
