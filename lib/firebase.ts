import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. TAMBAHKAN INI

const firebaseConfig = {
  apiKey: "AIzaSyD89GppQ38Kxpyl2FPYScoi7vuDOzS16Jk",
  authDomain: "deteksitanahfix.firebaseapp.com",
  projectId: "deteksitanahfix",
  storageBucket: "deteksitanahfix.firebasestorage.app",
  messagingSenderId: "821311826346",
  appId: "1:821311826346:web:bce7ef49cf7cd74ea6e3d3",
  measurementId: "G-6V7CG7D106"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore Database // 2. TAMBAHKAN INI
const db = getFirestore(app);

export { app, auth, db }; // 3. TAMBAHKAN db DI SINI  