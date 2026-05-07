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
  if (!firestore) {
    callbacks?.onError?.(new Error("Firestore instance missing"));
    return;
  }
  const itemsCollection = collection(firestore, 'experience-items');
  addDoc(itemsCollection, itemData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
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
  if (!firestore || !itemId || itemId === 'undefined') {
    const error = new Error("Geçerli bir öğe ID'si bulunamadı.");
    console.error("updateExperienceItem error:", error);
    callbacks?.onError?.(error);
    return;
  }
  const itemDocRef = doc(firestore, 'experience-items', itemId);
  updateDoc(itemDocRef, itemData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
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
  if (!firestore || !itemId || itemId === 'undefined') {
    const error = new Error("Geçerli bir öğe ID'si bulunamadığı için silinemedi.");
    console.error("deleteExperienceItem error:", error);
    callbacks?.onError?.(error);
    return;
  }
  const itemDocRef = doc(firestore, 'experience-items', itemId);
  deleteDoc(itemDocRef)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: itemDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}
