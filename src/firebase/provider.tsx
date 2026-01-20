'use client';

import {
  createContext,
  useContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from 'react';

import { type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

type FirebaseProviderProps = PropsWithChildren<{
  firebaseApp: FirebaseApp;
}>;

export function FirebaseProvider({
  firebaseApp,
  children,
}: FirebaseProviderProps) {
  const [auth, setAuth] = useState<Auth>(() => getAuth(firebaseApp));
  const [firestore, setFirestore] = useState<Firestore>(() =>
    getFirestore(firebaseApp)
  );

  useEffect(() => {
    setAuth(getAuth(firebaseApp));
    setFirestore(getFirestore(firebaseApp));
  }, [firebaseApp]);

  return (
    <FirebaseContext.Provider value={{ firebaseApp, auth, firestore }}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
