// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA61ekV5vlbKuyYqBYixW72_UJrgjc8IMQ",
  authDomain: "library-management-84ac7.firebaseapp.com",
  projectId: "library-management-84ac7",
  storageBucket: "library-management-84ac7.firebasestorage.app",
  messagingSenderId: "757959174891",
  appId: "1:757959174891:web:248b1cb2a036890e8c2cae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
