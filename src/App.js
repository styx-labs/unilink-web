import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyList from "./pages/CompanyList";
import AddCompany from "./pages/AddCompany";
import RoleList from "./pages/RoleList";
import AddRole from "./pages/AddRole";
import EditCompany from "./pages/EditCompany";
import EditRole from "./pages/EditRole";
import CandidateList from "./components/CandidateList";
import AddCandidate from "./pages/AddCandidate";
import EditCandidate from "./pages/EditCandidate";
import "./App.css";

// var firebase = require("firebase");
// var firebaseui = require("firebaseui");

// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function () {
//       // The widget is rendered.
//       // Hide the loader.
//       document.getElementById("loader").style.display = "none";
//     },
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: "popup",
//   signInSuccessUrl: "<url-to-redirect-to-on-success>",
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//   ],
//   // Terms of service url.
//   tosUrl: "<your-tos-url>",
//   // Privacy policy url.
//   privacyPolicyUrl: "<your-privacy-policy-url>",
// };

function App() {
  return (
    <Router>
      <div className="App">
        <h1>UniLink</h1>
        <Routes>
          <Route path="/" element={<CompanyList />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/companies/:companyId/roles" element={<RoleList />} />
          <Route path="/companies/:companyId/add-role" element={<AddRole />} />
          <Route path="/companies/:companyId/edit" element={<EditCompany />} />
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
      </div>
    </Router>
  );
}

export default App;
