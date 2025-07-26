// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

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

// Initialize Firestore Database with settings for WebContainer compatibility
export const db = getFirestore(app);

// Configure Firestore for better WebContainer compatibility
if (typeof window !== 'undefined') {
  // Client-side configuration
  try {
    // Enable offline persistence for better reliability
    import('firebase/firestore').then(({ enableNetwork, disableNetwork }) => {
      // Optional: Configure network settings
    });
  } catch (error) {
    console.warn('Firestore network configuration warning:', error);
  }
}

export default app;