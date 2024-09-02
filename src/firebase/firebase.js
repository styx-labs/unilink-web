// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7dPXvnby7PHEcIlKdKFO4GBSQCCpsegM",
  authDomain: "astute-veld-431703-b8.firebaseapp.com",
  projectId: "astute-veld-431703-b8",
  storageBucket: "astute-veld-431703-b8.appspot.com",
  messagingSenderId: "16250094868",
  appId: "1:16250094868:web:db5be621f452eb3e942e01",
  measurementId: "G-8XHXCZFNRK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize App Check
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Le2cjAqAAAAAGqF2HZnJSaoWmvnlvq2dsijNj4j"),
  isTokenAutoRefreshEnabled: true,
});

export { app, auth, appCheck };
