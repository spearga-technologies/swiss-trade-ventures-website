// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqJ8XzGqJ8XzGqJ8XzGqJ8XzGqJ8XzGqJ8",
  authDomain: "swisstradeventures-admin.firebaseapp.com",
  projectId: "swisstradeventures-admin",
  storageBucket: "swisstradeventures-admin.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;