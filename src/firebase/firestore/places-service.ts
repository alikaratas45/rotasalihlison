'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Place } from '@/lib/definitions';

// We are defining a type for the data we expect to add, excluding the ID,
// as Firestore will generate it.
type NewPlaceData = Omit<Place, 'id'>;

export async function addPlace(firestore: Firestore, placeData: NewPlaceData) {
  try {
    const placesCollection = collection(firestore, 'places');
    const docRef = await addDoc(placesCollection, placeData);
    return docRef.id;
  } catch (serverError) {
    console.error('Error adding document: ', serverError);

    // Create a contextual error and emit it
    const permissionError = new FirestorePermissionError({
      path: 'places',
      operation: 'create',
      requestResourceData: placeData,
    });

    errorEmitter.emit('permission-error', permissionError);
    
    // Re-throw the original error to be caught by the calling function
    throw serverError;
  }
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

export async function updatePlace(firestore: Firestore, placeId: string, formData: PlaceFormData) {
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

  try {
    await updateDoc(placeDocRef, updatedData);
  } catch (serverError) {
    console.error(`Error updating document ${placeId}: `, serverError);

    const permissionError = new FirestorePermissionError({
      path: placeDocRef.path,
      operation: 'update',
      requestResourceData: updatedData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

export async function deletePlace(firestore: Firestore, placeId: string) {
  const placeDocRef = doc(firestore, 'places', placeId);
  try {
    await deleteDoc(placeDocRef);
  } catch (serverError) {
    console.error(`Error deleting document ${placeId}: `, serverError);
    
    const permissionError = new FirestorePermissionError({
      path: placeDocRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}
