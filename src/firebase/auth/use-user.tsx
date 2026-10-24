'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, type DocumentReference } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import type { UserProfile } from '@/lib/definitions';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, authLoading, authError] = useAuthState(auth);

  const userDocRef = user ? (doc(firestore, `users/${user.uid}`) as DocumentReference<UserProfile>) : null;
  const [profile, profileLoading, profileError] = useDocumentData<UserProfile>(userDocRef);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && profile) {
      // Check if the user's email matches the admin email.
      // In a real app, this might be a role in the user's profile document.
      setIsAdmin(user.email === 'alikarataskula@gmail.com');
    } else {
      setIsAdmin(false);
    }
  }, [user, profile]);

  return {
    user,
    profile,
    isAdmin,
    loading: authLoading || profileLoading,
    error: authError || profileError,
  };
}
