'use client';
import { collection, doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { places as staticPlaces } from '@/lib/data/places';
import { routes as staticRoutes } from '@/lib/data/routes';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';

import type { Place, Route, ExperienceItem } from '@/lib/definitions';

/**
 * Belirli bir koleksiyonu statik verilerle besler.
 * Verileri silmez, mevcut verilerin kritik alanlarını koruyarak güncelleme yapar.
 */
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
            
            // Mevcut veriye zarar vermeden sadece koddaki güncellemeleri yazar
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
  
  // Yerleri güvenli şekilde güncelle
  const placesResult = await seedCollection<Place>(firestore, 'places', staticPlaces, (place, existingData) => {
    const data = { ...place };
    
    // KRİTİK GÖRSEL KORUMA MANTIĞI:
    // 1. Eğer veritabanında (Firestore) zaten bir görsel VARSA ve bu görsel kaliteli bir linkse (Imgur veya Unsplash)
    // 2. Koddaki varsayılan linki (picsum gibi) ASLA onun üzerine yazma.
    
    const hasExistingSpecialImage = existingData?.imageUrl && (
        existingData.imageUrl.includes('imgur.com') || 
        existingData.imageUrl.includes('images.unsplash.com') ||
        existingData.imageUrl.includes('i.imgur.com')
    );

    // Eğer veritabanında sizin girdiğiniz özel bir link varsa, onu KORU.
    if (hasExistingSpecialImage) {
        data.imageUrl = existingData.imageUrl;
    }

    // Koordinatları her zaman koddaki en güncel (sizin verdiğiniz kesin değerlerle) güncelle
    // Bu sayede görseller korunurken yanlış konumlar düzelir.
    data.coordinates = place.coordinates;

    return data;
  });

  // Rotaları güncelle
  const routesResult = await seedCollection<Route>(firestore, 'routes', staticRoutes);
  
  // Deneyim menüsü öğelerini güncelle
  const experienceResult = await seedCollection<ExperienceItem>(firestore, 'experience-items', staticExperienceItems.map((item, index) => ({...item, id: `exp${index+1}`})));
  
  if (placesResult.errors > 0 || routesResult.errors > 0 || experienceResult.errors > 0) {
      throw new Error("Veritabanı beslenirken bir veya daha fazla hata oluştu. Detaylar için konsolu kontrol edin.");
  }

  return {
    places: { added: placesResult.added, updated: placesResult.updated },
    routes: { added: routesResult.added, updated: routesResult.updated },
    experienceItems: { added: experienceResult.added, updated: experienceResult.updated },
  };
}