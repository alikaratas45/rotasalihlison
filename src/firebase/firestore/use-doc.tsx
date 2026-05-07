'use client';
import { type DocumentReference, type DocumentData } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

export const useDoc = <T,>(
  docRef: DocumentReference<DocumentData> | null
): {
  data: (T & { id: string }) | null;
  loading: boolean;
  error: Error | null;
} => {
  const [snapshot, loading, error] = useDocument(docRef);

  const data = snapshot && snapshot.exists()
    ? ({
        ...(snapshot.data() as T),
        id: snapshot.id,
      } as T & { id: string })
    : null;

  return { data, loading, error: error || null };
};
