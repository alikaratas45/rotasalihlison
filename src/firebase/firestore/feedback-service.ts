
'use client';
import { collection, addDoc, doc, updateDoc, increment, arrayUnion, type Firestore, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function addFeedbackComment(
  firestore: Firestore,
  data: { name?: string; message: string },
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const coll = collection(firestore, 'feedback');
  const payload = {
    ...data,
    likes: 0,
    replies: [],
    createdAt: serverTimestamp(),
  };

  addDoc(coll, payload)
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: 'feedback',
        operation: 'create',
        requestResourceData: payload,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function likeFeedback(
  firestore: Firestore,
  feedbackId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const docRef = doc(firestore, 'feedback', feedbackId);
  updateDoc(docRef, { likes: increment(1) })
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { likes: 'increment' },
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function addFeedbackReply(
  firestore: Firestore,
  feedbackId: string,
  reply: { name: string; message: string },
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const docRef = doc(firestore, 'feedback', feedbackId);
  const payload = {
    ...reply,
    createdAt: new Date(), // using plain date for arrayUnion consistency if needed, or structured data
  };

  updateDoc(docRef, {
    replies: arrayUnion(payload)
  })
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { replies: 'arrayUnion' },
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function deleteFeedbackComment(
  firestore: Firestore,
  feedbackId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const docRef = doc(firestore, 'feedback', feedbackId);
  deleteDoc(docRef)
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}
