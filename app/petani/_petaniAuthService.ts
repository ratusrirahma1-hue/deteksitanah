import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD89GppQ38Kxpyl2FPYScoi7vuDOzS16Jk",
  authDomain: "deteksitanahfix.firebaseapp.com",
  projectId: "deteksitanahfix",
  storageBucket: "deteksitanahfix.firebasestorage.app",
  messagingSenderId: "821311826346",
  appId: "1:821311826346:web:bce7ef49cf7cd74ea6e3d3",
  measurementId: "G-6V7CG7D106"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Solusi anti-error: Menggunakan trik require langsung ke internal modular Firebase 
// Ini memotong bug pencarian path pada Metro Bundler Expo
let persistenceModule;
try {
  persistenceModule = require("firebase/auth/react-native").getReactNativePersistence;
} catch (e) {
  persistenceModule = null;
}

export const auth = persistenceModule 
  ? initializeAuth(app, { persistence: persistenceModule(AsyncStorage) })
  : getAuth(app);