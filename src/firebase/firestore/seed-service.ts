'use client';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, type Firestore, serverTimestamp, query, orderBy, limit, where } from 'firebase/firestore';

import { places as staticPlaces } from '@/lib/data/places';
import { routes as staticRoutes } from '@/lib/data/routes';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';

import type { Place, Route, ExperienceItem } from '@/lib/definitions';

/**
 * Mevcut veritabanı durumunu 'backups' koleksiyonuna yedekler.
 */
export async function createBackup(firestore: Firestore) {
  const collections = ['places', 'routes', 'experience-items'];
  const backupData: any = { timestamp: serverTimestamp() };

  for (const collName of collections) {
    const snap = await getDocs(collection(firestore, collName));
    backupData[collName] = snap.docs.map(d => ({ ...d.data(), id: d.id }));
  }

  const backupRef = doc(collection(firestore, 'backups'));
  await setDoc(backupRef, backupData);
  return backupRef.id;
}

/**
 * En son yedeği bulur ve veritabanını o hale geri döndürür.
 */
export async function undoLastOperation(firestore: Firestore) {
  const backupsQuery = query(collection(firestore, 'backups'), orderBy('timestamp', 'desc'), limit(1));
  const snap = await getDocs(backupsQuery);

  if (snap.empty) throw new Error("Geri yüklenecek yedek bulunamadı.");

  const lastBackup = snap.docs[0].data();
  const collections = ['places', 'routes', 'experience-items'];

  for (const collName of collections) {
    const currentSnap = await getDocs(collection(firestore, collName));
    for (const d of currentSnap.docs) {
      await deleteDoc(doc(firestore, collName, d.id));
    }
    const items = lastBackup[collName] || [];
    for (const item of items) {
      const { id, ...data } = item;
      await setDoc(doc(firestore, collName, id), data);
    }
  }
  await deleteDoc(snap.docs[0].ref);
}

async function seedCollection<T extends { id?: string }>(
  firestore: Firestore,
  collectionName: string,
  staticData: T[],
  mode: 'SAFE' | 'UPDATE'
): Promise<{ added: number, updated: number, errors: number }> {
  let added = 0, updated = 0, errors = 0;
  const collectionRef = collection(firestore, collectionName);

  for (const item of staticData) {
    // If no ID provided, try to find by link (for exp items) or generate one
    let targetId = (item as any).id;
    let docRef: any = targetId ? doc(collectionRef, targetId) : null;
    
    try {
      let docSnap = docRef ? await getDoc(docRef) : null;

      // Handle experience-items specially to avoid duplicates based on link
      if ((!docSnap || !docSnap.exists()) && collectionName === 'experience-items') {
          const q = query(collectionRef, where('link', '==', (item as any).link));
          const existing = await getDocs(q);
          if (!existing.empty) {
              docRef = existing.docs[0].ref;
              docSnap = existing.docs[0];
              targetId = docRef.id;
          }
      }

      if (docSnap && docSnap.exists()) {
        if (mode === 'SAFE') continue;

        const currentData = docSnap.data();
        const { id, ...staticPayload } = item as any;
        
        let mergedData;
        if (collectionName === 'experience-items') {
            // Update order and names from code, but keep user changes if necessary
            // Here we prioritize code values for order to fix menu layout
            mergedData = { ...currentData, ...staticPayload, order: staticPayload.order };
        } else {
            // Standard merge
            mergedData = { ...staticPayload, ...currentData };
            // Ensure subPoints from code are added if Firestore version is empty
            if (staticPayload.subPoints && (!currentData.subPoints || currentData.subPoints.length === 0)) {
                mergedData.subPoints = staticPayload.subPoints;
            }
        }
        
        await setDoc(docRef, mergedData, { merge: true });
        updated++;
      } else {
        const { id, ...data } = item as any;
        if (targetId) {
            await setDoc(doc(collectionRef, targetId), data);
        } else {
            const newDoc = doc(collectionRef);
            await setDoc(newDoc, data);
        }
        added++;
      }
    } catch (serverError) {
      console.error(`Error in seedCollection (${collectionName}):`, serverError);
      errors++;
    }
  }
  return { added, updated, errors };
}

export async function seedDatabase(firestore: Firestore, mode: 'SAFE' | 'UPDATE' = 'SAFE'): Promise<{
  places: { added: number, updated: number },
  routes: { added: number, updated: number },
  experienceItems: { added: number, updated: number }
}> {
  await createBackup(firestore);

  const placesResult = await seedCollection<Place>(firestore, 'places', staticPlaces, mode);
  const routesResult = await seedCollection<Route>(firestore, 'routes', staticRoutes, mode);
  const experienceResult = await seedCollection<Omit<ExperienceItem, 'id'>>(firestore, 'experience-items', staticExperienceItems, mode);

  return {
    places: { added: placesResult.added, updated: placesResult.updated },
    routes: { added: routesResult.added, updated: routesResult.updated },
    experienceItems: { added: experienceResult.added, updated: experienceResult.updated },
  };
}
