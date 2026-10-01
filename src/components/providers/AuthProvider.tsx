"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const isSuperAdmin = firebaseUser.email === "sabilianggita@gmail.com";
        if (isSuperAdmin) {
          setIsAdmin(true);
        } else {
          try {
            const adminDocRef = doc(db, 'admins', firebaseUser.uid);
            const adminDocSnap = await getDoc(adminDocRef);
            const accountIsAdmin = adminDocSnap.exists();
            setIsAdmin(accountIsAdmin);
            if (!accountIsAdmin) {
              await signOut(auth);
              setUser(null);
            }
          } catch {
            setIsAdmin(false);
            await signOut(auth);
            setUser(null);
          }
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
