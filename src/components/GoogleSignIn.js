import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

function GoogleSignIn() {
  const [user] = useAuthState(auth);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful sign-in
        console.log("Signed in successfully", result.user);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error signing in with Google", error);
      });
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4">
      {user ? (
        <div className="flex flex-row justify-between item-center">
          <h2>Welcome, {user.displayName}</h2>
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={signInWithGoogle}>Sign In with Google</Button>
      )}
    </div>
  );
}

export default GoogleSignIn;
