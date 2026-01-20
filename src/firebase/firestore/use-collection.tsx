// IMPORTANT: This file is a work in progress and should not be used in production.
'use client';
import { type Query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

export const useCollection = <T,>(
  query: Query | null
): {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: Error | null;
} => {
  // react-firebase-hooks' useCollectionData is stable and handles connection state.
  // The idField option automatically includes the document ID in the data.
  const [data, loading, error] = useCollectionData<T & { id: string }>(
    query as Query<T & { id: string }>,
    {
      idField: 'id',
    }
  );

  return { data: data || null, loading, error: error || null };
};
