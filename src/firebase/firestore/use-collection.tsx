// IMPORTANT: This file is a work in progress and should not be used in production.
'use client';
import {
  type DocumentData,
  type Query,
  onSnapshot,
  type FirestoreError,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export const useCollection = <T,>(
  query: Query | null
): {
  data: (T & { id: string })[] | null;
  loading: boolean;
  error: FirestoreError | null;
} => {
  const [data, setData] = useState<(T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (query) {
      const unsubscribe = onSnapshot(
        query,
        (querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as T),
          }));
          setData(docs);
          setLoading(false);
        },
        async (err) => {
          const permissionError = new FirestorePermissionError({
            path: (query as any)._path?.segments.join('/'),
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);

          setError(err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [query]);

  return { data, loading, error };
};
