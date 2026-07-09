import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './_petaniAuthService';
import { db } from '@/lib/firebase'; // Menggunakan alias @/ yang umum di Expo
import { doc, setDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const SESSION_KEY = 'petani_session';

interface PetaniSession {
  petaniId: string;
  nama: string;
  email: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  petaniId?: string;
  nama?: string;
  email?: string;
}

interface PetaniAuthContextValue {
  petani: PetaniSession | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (nama: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const PetaniAuthContext = createContext<PetaniAuthContextValue | undefined>(undefined);

export const PetaniAuthProvider = ({ children }: { children: ReactNode }) => {
  const [petani, setPetani] = useState<PetaniSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const sessionData = {
            petaniId: user.uid,
            nama: user.displayName || 'Sobat Tani',
            email: user.email || '',
          };
          setPetani(sessionData);
          await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        } else {
          setPetani(null);
          await AsyncStorage.removeItem(SESSION_KEY);
        }
      } catch (error) {
        console.error("Gagal sinkronisasi sesi:", error);
      } finally {
        setIsReady(true);
      }
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const session = { petaniId: user.uid, nama: user.displayName || 'Sobat Tani', email: user.email || '' };
      setPetani(session);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, petaniId: user.uid, nama: session.nama, email: session.email };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const register = async (nama: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: nama });

      // SIMPAN DATA PROFIL KE FIRESTORE
      await setDoc(doc(db, "users", user.uid), {
        nama: nama,
        email: email.trim(),
        role: 'petani',
        createdAt: new Date().toISOString()
      });

      const session = { petaniId: user.uid, nama, email: user.email || '' };
      setPetani(session);
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true, petaniId: user.uid, nama, email: session.email };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setPetani(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <PetaniAuthContext.Provider value={{ petani, isReady, login, register, logout }}>
      {children}
    </PetaniAuthContext.Provider>
  );
};

export const usePetaniAuth = () => useContext(PetaniAuthContext)!;