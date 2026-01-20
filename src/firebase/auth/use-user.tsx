'use client';
import { doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useDoc } from '../firestore/use-doc';
import { useAuth, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/definitions';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, userLoading, userError] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const userDocRef = user ? doc(firestore, `users/${user.uid}`) : null;
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    setLoading(userLoading || profileLoading);
  }, [userLoading, profileLoading]);

  useEffect(() => {
    if (userError) {
      setError(userError);
    } else if (profileError) {
      setError(profileError);
    } else {
      setError(null);
    }
  }, [userError, profileError]);

  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    } else {
      setProfile(null);
    }
  }, [profileData]);

  return { user, profile, loading, error };
}
