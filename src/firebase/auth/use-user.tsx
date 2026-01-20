'use client';
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useDoc } from '../firestore/use-doc';
import { useAuth, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/definitions';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, userLoading, userError] = useAuthState(auth);

  // Create a document reference. useDoc will handle the null case.
  const userDocRef = user ? doc(firestore, `users/${user.uid}`) : null;
  
  // Use our new, stable useDoc hook to get the profile
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useDoc<UserProfile>(userDocRef);

  // Combine loading states and errors
  const loading = userLoading || profileLoading;
  const error = userError || profileError;

  return { user, profile, loading, error };
}
