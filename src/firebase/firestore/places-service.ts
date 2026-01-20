'use client';
import { collection, addDoc, type Firestore } from 'firebase/firestore';
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
