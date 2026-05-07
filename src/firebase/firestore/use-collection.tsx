'use client';
import { type Query } from 'firebase/firestore';
import { useCollection as useFirebaseCollection } from 'react-firebase-hooks/firestore';

export const useCollection = <T,>(
  query: Query | null
): {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: Error | null;
} => {
  const [snapshot, loading, error] = useFirebaseCollection(query);

  const data = snapshot
    ? snapshot.docs.map((doc) => ({
        ...(doc.data() as T),
        id: doc.id,
      }))
    : null;

  return { data, loading, error: error || null };
};
