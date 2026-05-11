
'use client';

import { doc, setDoc, increment, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Increments the global visitor counter in Firestore.
 */
export function incrementVisitorCount(db: Firestore) {
  const statsRef = doc(db, 'settings', 'stats');

  setDoc(statsRef, { 
    visitorCount: increment(1) 
  }, { merge: true })
    .catch(async (serverError) => {
      // Create a rich, contextual error for the dev overlay
      const permissionError = new FirestorePermissionError({
        path: statsRef.path,
        operation: 'update',
        requestResourceData: { visitorCount: 'increment' },
      });

      // Emit the error centrally
      errorEmitter.emit('permission-error', permissionError);
    });
}
