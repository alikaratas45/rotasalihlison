'use client';
import { collection, doc, getDoc, setDoc, deleteDoc, type Firestore } from 'firebase/firestore';
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
    dataProcessor: (item: T, existingData?: any) => any = (item) => item
): Promise<{ added: number, updated: number, errors: number }> {
    let added = 0, updated = 0, errors = 0;
    const collectionRef = collection(firestore, collectionName);

    for (const item of staticData) {
        const docRef = doc(collectionRef, item.id);
        try {
            const docSnap = await getDoc(docRef);
            const existingData = docSnap.exists() ? docSnap.data() : undefined;
            const processedData = dataProcessor(item, existingData);
            
            await setDoc(docRef, processedData, { merge: true });
            
            if (docSnap.exists()) {
                updated++;
            } else {
                added++;
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
    return { added, updated, errors };
}

export async function seedDatabase(firestore: Firestore): Promise<{
    places: { added: number, updated: number },
    routes: { added: number, updated: number },
    experienceItems: { added: number, updated: number }
}> {
  
  try {
      const ataturkAnitiRef = doc(firestore, 'places', '4');
      await deleteDoc(ataturkAnitiRef);
  } catch (e) {
      console.warn("Atatürk Anıtı silinirken bir sorun oluştu.");
  }

  const placesResult = await seedCollection<Place>(firestore, 'places', staticPlaces, (place, existingData) => {
    const data = { ...place };
    
    // Basit ve kesin kural: Kod tarafındaki görsel bir 'imgur' veya 'unsplash' linki ise veritabanını güncelle.
    // Sadece 'picsum.photos' gibi geçici/rastgele görseller varsa veritabanındaki veriyi koru.
    const isCodeImageSpecific = place.imageUrl && (
        place.imageUrl.includes('imgur.com') || 
        place.imageUrl.includes('unsplash.com')
    );

    const isDbImagePlaceholder = !existingData?.imageUrl || existingData.imageUrl.includes('picsum.photos');

    // Eğer kod tarafındaki görsel spesifik bir link değilse ve DB'de zaten iyi bir görsel varsa DB'dekini tut.
    if (!isCodeImageSpecific && !isDbImagePlaceholder) {
        data.imageUrl = existingData.imageUrl;
    }

    data.coordinates = place.coordinates;
    return data;
  });

  const routesResult = await seedCollection<Route>(firestore, 'routes', staticRoutes);
  
  // Experience items seeding with icon fix
  const experienceResult = await seedCollection<ExperienceItem>(firestore, 'experience-items', staticExperienceItems.map((item, index) => ({...item, id: `exp${index+1}`})), (item) => {
      // Fix hiking icon if it was previously set to something else
      if (item.link.includes('category=nature')) {
          return { ...item, icon: 'Climbing' };
      }
      return item;
  });
  
  if (placesResult.errors > 0 || routesResult.errors > 0 || experienceResult.errors > 0) {
      throw new Error("Veritabanı beslenirken bir veya daha fazla hata oluştu.");
  }

  return {
    places: { added: placesResult.added, updated: placesResult.updated },
    routes: { added: routesResult.added, updated: routesResult.updated },
    experienceItems: { added: experienceResult.added, updated: experienceResult.updated },
  };
}
