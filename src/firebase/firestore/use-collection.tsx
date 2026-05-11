'use client';
import { type Query } from 'firebase/firestore';
import { useCollection as useFirebaseCollection } from 'react-firebase-hooks/firestore';
import { useMemo } from 'react';

export const useCollection = <T,>(
  query: Query | null
): {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: Error | null;
} => {
  const [snapshot, loading, error] = useFirebaseCollection(query);

  const data = useMemo(() => {
    if (!snapshot) return null;
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as T),
      id: doc.id,
    }));
  }, [snapshot]);

  return { data, loading, error: error || null };
};
