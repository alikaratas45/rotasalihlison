'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { ExperienceItem } from '@/lib/definitions';

type ExperienceItemData = Omit<ExperienceItem, 'id'>;

export function addExperienceItem(
  firestore: Firestore,
  itemData: ExperienceItemData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const itemsCollection = collection(firestore, 'experience-items');
  addDoc(itemsCollection, itemData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error('Error adding document: ', serverError);
      const permissionError = new FirestorePermissionError({
        path: 'experience-items',
        operation: 'create',
        requestResourceData: itemData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function updateExperienceItem(
  firestore: Firestore,
  itemId: string,
  itemData: ExperienceItemData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const itemDocRef = doc(firestore, 'experience-items', itemId);
  updateDoc(itemDocRef, itemData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error(`Error updating document ${itemId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: itemDocRef.path,
        operation: 'update',
        requestResourceData: itemData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function deleteExperienceItem(
  firestore: Firestore,
  itemId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  const itemDocRef = doc(firestore, 'experience-items', itemId);
  deleteDoc(itemDocRef)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error(`Error deleting document ${itemId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: itemDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}
