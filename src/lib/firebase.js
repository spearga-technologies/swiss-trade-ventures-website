// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADADzp8HDoX8dWs8OE2Iv_rWQT01yF8zQ",
  authDomain: "swisstradeventures-admin.firebaseapp.com",
  projectId: "swisstradeventures-admin",
  storageBucket: "swisstradeventures-admin.firebasestorage.app",
  messagingSenderId: "251484801619",
  appId: "1:251484801619:web:2b5418b63c39f7271514a6",
  measurementId: "G-M59VCMVXVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;