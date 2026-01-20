// IMPORTANT: This file is a work in progress and should not be used in production.
'use client';
import { type DocumentReference, type DocumentData } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export const useDoc = <T,>(
  docRef: DocumentReference<DocumentData> | null
): {
  data: (T & { id: string }) | null;
  loading: boolean;
  error: Error | null;
} => {
  // react-firebase-hooks' useDocumentData is stable and handles connection state.
  // The idField option automatically includes the document ID in the data.
  const [data, loading, error] = useDocumentData<T & { id: string }>(
    docRef as DocumentReference<T & { id: string }>,
    {
      idField: 'id',
    }
  );

  return { data: data || null, loading, error: error || null };
};
