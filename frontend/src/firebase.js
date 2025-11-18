// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmx6n4IDQpSxWBcu93sDbqytIYYKnlmhY",
  authDomain: "https://eclipx-cznr.onrender.com",
  projectId: "video-1f884",
  storageBucket: "video-1f884.firebasestorage.app",
  messagingSenderId: "373887744107",
  appId: "1:373887744107:web:b2564e667e1a1df5f1192e",
  measurementId: "G-R1KRNYKH58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();

export default app;
