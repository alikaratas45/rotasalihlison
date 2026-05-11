'use client';
import { type DocumentReference, type DocumentData } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useMemo } from 'react';

export const useDoc = <T,>(
  docRef: DocumentReference<DocumentData> | null
): {
  data: (T & { id: string }) | null;
  loading: boolean;
  error: Error | null;
} => {
  const [snapshot, loading, error] = useDocument(docRef);

  const data = useMemo(() => {
    if (!snapshot || !snapshot.exists()) return null;
    return {
      ...(snapshot.data() as T),
      id: snapshot.id,
    } as T & { id: string };
  }, [snapshot]);

  return { data, loading, error: error || null };
};
