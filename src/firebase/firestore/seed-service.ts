'use client';
import { collection, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import { places as staticPlaces } from '@/lib/data/places';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Place } from '@/lib/definitions';

// This function seeds the Firestore database with the static places data.
// It's designed to be idempotent: it checks if a place with the same ID
// already exists before writing, preventing duplicates and data loss.
export async function seedPlaces(firestore: Firestore): Promise<{ addedCount: number, skippedCount: number }> {
  const placesCollection = collection(firestore, 'places');
  let addedCount = 0;
  let skippedCount = 0;

  for (const place of staticPlaces) {
    // Use the static ID as the document ID in Firestore for consistency
    const docRef = doc(placesCollection, place.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // If the document doesn't exist, create it.
      // Ensure every place has an image for visual consistency.
      const placeData: Place = {
        ...place,
        imageUrl: place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`,
        imageHint: place.imageHint || 'landmark'
      };
      
      try {
        await setDoc(docRef, placeData);
        addedCount++;
      } catch (serverError) {
         console.error(`Error seeding document ${place.id}: `, serverError);
         const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: placeData,
          });
          errorEmitter.emit('permission-error', permissionError);
          // Re-throw to notify the calling function
          throw serverError;
      }
    } else {
      skippedCount++;
    }
  }

  return { addedCount, skippedCount };
}
