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
  formData: any, // The type is enforced by zod in the page
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
    if (!firestore || !placeId) {
        const error = new Error("Firestore instance or placeId is missing.");
        console.error("Error in updatePlace:", error);
        callbacks?.onError?.(error);
        return;
    }
  const placeDocRef = doc(firestore, 'places', placeId);

  const updatedData = {
    name: {
      tr: formData.name_tr,
      en: formData.name_en || formData.name_tr,
      fr: formData.name_fr || formData.name_tr,
      de: formData.name_de || formData.name_tr,
      ja: formData.name_ja || formData.name_tr,
    },
    slug: {
      tr: formData.slug_tr,
      en: formData.slug_en || formData.slug_tr,
      fr: formData.slug_fr || formData.slug_tr,
      de: formData.slug_de || formData.slug_tr,
      ja: formData.slug_ja || formData.slug_tr,
    },
    description: {
      tr: formData.description_tr,
      en: formData.description_en || formData.description_tr,
      fr: formData.description_fr || formData.description_tr,
      de: formData.description_de || formData.description_tr,
      ja: formData.description_ja || formData.description_tr,
    },
    category: formData.category,
    coordinates: { lat: formData.lat, lng: formData.lng },
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
  if (!firestore || !placeId) {
    const error = new Error("Firestore instance or placeId is missing.");
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
