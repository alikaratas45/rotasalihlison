'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Place } from '@/lib/definitions';

// We are defining a type for the data we expect to add, excluding the ID,
// as Firestore will generate it.
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

// Data shape coming from the admin form
export type PlaceFormData = {
  name_tr: string;
  slug_tr: string;
  description_tr: string;
  category: Place['category'];
  lat: number;
  lng: number;
};

export function updatePlace(
  firestore: Firestore,
  placeId: string,
  formData: PlaceFormData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
    if (!firestore || !placeId) {
        const error = new Error("Firestore instance or placeId is missing.");
        console.error("Error in updatePlace:", error);
        callbacks?.onError?.(error);
        return;
    }
  const placeDocRef = doc(firestore, 'places', placeId);

  // Construct the data with dot notation for Firestore update and copy to other languages
  const updatedData = {
    'name.tr': formData.name_tr,
    'name.en': formData.name_tr,
    'name.fr': formData.name_tr,
    'name.de': formData.name_tr,
    'name.ja': formData.name_tr,
    'slug.tr': formData.slug_tr,
    'slug.en': formData.slug_tr,
    'slug.fr': formData.slug_tr,
    'slug.de': formData.slug_tr,
    'slug.ja': formData.slug_tr,
    'description.tr': formData.description_tr,
    'description.en': formData.description_tr,
    'description.fr': formData.description_tr,
    'description.de': formData.description_tr,
    'description.ja': formData.description_tr,
    'category': formData.category,
    'coordinates.lat': formData.lat,
    'coordinates.lng': formData.lng,
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
