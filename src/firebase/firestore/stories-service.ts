'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Story } from '@/lib/definitions';

type StoryData = Omit<Story, 'id'>;

export function addStory(
  firestore: Firestore,
  storyData: StoryData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore) return;
  const coll = collection(firestore, 'stories');
  addDoc(coll, storyData)
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: 'stories',
        operation: 'create',
        requestResourceData: storyData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function updateStory(
  firestore: Firestore,
  storyId: string,
  storyData: StoryData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !storyId) return;
  const docRef = doc(firestore, 'stories', storyId);
  updateDoc(docRef, storyData)
    .then(() => callbacks?.onSuccess?.())
    .catch((err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: storyData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function deleteStory(
  firestore: Firestore,
  storyId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !storyId) return;
  const docRef = doc(firestore, 'stories', storyId);
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
