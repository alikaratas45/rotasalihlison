'use client';
import { collection, doc, getDoc, setDoc, writeBatch, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { places as staticPlaces } from '@/lib/data/places';
import { routes as staticRoutes } from '@/lib/data/routes';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';

import type { Place, Route, ExperienceItem } from '@/lib/definitions';


async function seedCollection<T extends {id: string}>(
    firestore: Firestore,
    collectionName: string,
    staticData: T[],
    dataProcessor: (item: T) => any = (item) => item
): Promise<{ added: number, skipped: number, errors: number }> {
    let added = 0, skipped = 0, errors = 0;
    const collectionRef = collection(firestore, collectionName);

    for (const item of staticData) {
        const docRef = doc(collectionRef, item.id);
        try {
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                const processedData = dataProcessor(item);
                await setDoc(docRef, processedData);
                added++;
            } else {
                skipped++;
            }
        } catch (serverError) {
            console.error(`Error seeding document ${item.id} in ${collectionName}: `, serverError);
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'create',
                requestResourceData: dataProcessor(item),
            });
            errorEmitter.emit('permission-error', permissionError);
            errors++;
        }
    }
    return { added, skipped, errors };
}


export async function seedDatabase(firestore: Firestore): Promise<{
    places: { added: number, skipped: number },
    routes: { added: number, skipped: number },
    experienceItems: { added: number, skipped: number }
}> {
  
  const placesResult = await seedCollection<Place>(firestore, 'places', staticPlaces, (place) => ({
    ...place,
    imageUrl: place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`,
    imageHint: place.imageHint || 'landmark'
  }));

  const routesResult = await seedCollection<Route>(firestore, 'routes', staticRoutes);
  
  const experienceResult = await seedCollection<ExperienceItem>(firestore, 'experience-items', staticExperienceItems.map((item, index) => ({...item, id: `exp${index+1}`})));
  
  if (placesResult.errors > 0 || routesResult.errors > 0 || experienceResult.errors > 0) {
      throw new Error("One or more errors occurred during database seeding. Check console for details.");
  }

  return {
    places: { added: placesResult.added, skipped: placesResult.skipped },
    routes: { added: routesResult.added, skipped: routesResult.skipped },
    experienceItems: { added: experienceResult.added, skipped: experienceResult.skipped },
  };
}
