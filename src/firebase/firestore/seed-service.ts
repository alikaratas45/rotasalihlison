
'use client';
import { collection, doc, getDoc, setDoc, updateDoc, type Firestore } from 'firebase/firestore';
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
    isPlaces: boolean = false
): Promise<{ added: number, updated: number, errors: number }> {
    let added = 0, updated = 0, errors = 0;
    const collectionRef = collection(firestore, collectionName);

    for (const item of staticData) {
        const docRef = doc(collectionRef, item.id);
        try {
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                // BELGE MEVCUTSA: Manuel değişiklikleri (açıklama, resim vb.) ASLA EZME
                const updates: any = {};
                
                if (isPlaces) {
                    const placeItem = item as unknown as Place;
                    // Sadece subPoints (Sinagog gibi) eksikse veya güncellenmesi gerekiyorsa ekle
                    if (placeItem.subPoints) {
                        updates.subPoints = placeItem.subPoints;
                    }
                }

                // Sadece belirlenen kritik/yeni alanları güncelle, diğer alanlara (description, imageUrl vb.) dokunma
                if (Object.keys(updates).length > 0) {
                    await updateDoc(docRef, updates);
                    updated++;
                }
            } else {
                // BELGE YOKSA: Yeni belge olarak tamamını ekle
                await setDoc(docRef, item);
                added++;
            }
        } catch (serverError) {
            console.error(`Error seeding document ${item.id} in ${collectionName}: `, serverError);
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'create',
                requestResourceData: item,
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
  // Not: Artık deleteDoc (silme) işlemleri kaldırıldı, tamamen koruyucu moda geçildi.

  const placesResult = await seedCollection<Place>(firestore, 'places', staticPlaces, true);
  const routesResult = await seedCollection<Route>(firestore, 'routes', staticRoutes);
  const experienceResult = await seedCollection<ExperienceItem>(firestore, 'experience-items', staticExperienceItems.map((item, index) => ({...item, id: `exp${index+1}`})));
  
  if (placesResult.errors > 0 || routesResult.errors > 0 || experienceResult.errors > 0) {
      throw new Error("Veritabanı beslenirken bir veya daha fazla hata oluştu.");
  }

  return {
    places: { added: placesResult.added, updated: placesResult.updated },
    routes: { added: routesResult.added, updated: routesResult.updated },
    experienceItems: { added: experienceResult.added, updated: experienceResult.updated },
  };
}
