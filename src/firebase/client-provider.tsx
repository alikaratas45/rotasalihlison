'use client';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';

import { getApps } from 'firebase/app';

type Props = { children: React.ReactNode };

const firebaseApp = initializeFirebase();

export function FirebaseClientProvider({ children }: Props) {
  return <FirebaseProvider firebaseApp={firebaseApp}>{children}</FirebaseProvider>;
}
