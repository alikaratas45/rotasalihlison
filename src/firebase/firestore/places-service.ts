'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Place } from '@/lib/definitions';

type NewPlaceData = Omit<Place, 'id'>;

export function addPlace(
  firestore: Firestore,
  placeData: NewPlaceData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore) {
    const error = new Error("Firestore instance is missing.");
    console.error("Error in addPlace:", error);
    callbacks?.onError?.(error);
    return;
  }
  const placesCollection = collection(firestore, 'places');
  addDoc(placesCollection, placeData)
    .then(() => {
      callbacks?.onSuccess?.();
    })
    .catch((serverError) => {
      console.error('Error adding document: ', serverError);
      const permissionError = new FirestorePermissionError({
        path: 'places',
        operation: 'create',
        requestResourceData: placeData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function updatePlace(
  firestore: Firestore,
  placeId: string,
  formData: any,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !placeId || placeId === 'undefined') {
    const error = new Error("Geçerli bir yer ID'si bulunamadı.");
    console.error("Error in updatePlace:", error);
    callbacks?.onError?.(error);
    return;
  }
  const placeDocRef = doc(firestore, 'places', placeId);

  const updatedData = {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    category: formData.category,
    coordinates: { lat: formData.lat, lng: formData.lng },
    imageUrl: formData.imageUrl,
    imageHint: formData.imageHint,
  };

  updateDoc(placeDocRef, updatedData)
    .then(() => {
      callbacks?.onSuccess?.();
    })
    .catch((serverError) => {
      console.error(`Error updating document ${placeId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: placeDocRef.path,
        operation: 'update',
        requestResourceData: updatedData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function deletePlace(
  firestore: Firestore,
  placeId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !placeId || placeId === 'undefined') {
    const error = new Error("Silinecek yerin ID'si eksik.");
    console.error("Error in deletePlace:", error);
    callbacks?.onError?.(error);
    return;
  }

  const placeDocRef = doc(firestore, 'places', placeId);
  deleteDoc(placeDocRef)
    .then(() => {
      callbacks?.onSuccess?.();
    })
    .catch((serverError) => {
      console.error(`Error deleting document ${placeId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: placeDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}
