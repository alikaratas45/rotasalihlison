// IMPORTANT: This file is a work in progress and should not be used in production.
'use client';
import {
  type DocumentReference,
  type DocumentData,
  onSnapshot,
  type FirestoreError,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export const useDoc = <T,>(
  docRef: DocumentReference<DocumentData> | null
): {
  data: (T & { id: string }) | null;
  loading: boolean;
  error: FirestoreError | null;
} => {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (docRef) {
      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            setData({ id: doc.id, ...(doc.data() as T) });
          } else {
            setData(null);
          }
          setLoading(false);
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: (docRef as any)._path?.segments.join('/'),
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
          setError(err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setData(null);
      setLoading(false);
    }
  }, [docRef]);

  return { data, loading, error };
};
