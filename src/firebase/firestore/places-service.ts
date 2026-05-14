'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Place, SubPoint } from '@/lib/definitions';

type NewPlaceData = Omit<Place, 'id'>;

export function addPlace(
  firestore: Firestore,
  placeData: NewPlaceData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore) {
    const error = new Error("Firestore instance is missing.");
    callbacks?.onError?.(error);
    return;
  }
  const placesCollection = collection(firestore, 'places');
  addDoc(placesCollection, { ...placeData, subPoints: placeData.subPoints || [] })
    .then(() => {
      callbacks?.onSuccess?.();
    })
    .catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: 'places',
        operation: 'create',
        requestResourceData: placeData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export async function updatePlace(
  firestore: Firestore,
  placeId: string,
  formData: any,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !placeId) {
    const error = new Error("Geçerli bir yer ID'si bulunamadı.");
    callbacks?.onError?.(error);
    return;
  }
  
  const placeDocRef = doc(firestore, 'places', placeId);

  try {
    const currentSnap = await getDoc(placeDocRef);
    const currentData = currentSnap.exists() ? currentSnap.data() : {};

    const updatedData: any = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      category: formData.category,
      coordinates: { lat: formData.lat, lng: formData.lng },
      imageUrl: formData.imageUrl,
      imageHint: formData.imageHint,
      order: formData.order !== undefined ? Number(formData.order) : (currentData.order ?? 99),
      audioUrlTr: formData.audioUrlTr !== undefined ? formData.audioUrlTr : (currentData.audioUrlTr || null)
    };

    if (formData.subPoints !== undefined) {
      updatedData.subPoints = formData.subPoints;
    }

    await updateDoc(placeDocRef, updatedData);
    callbacks?.onSuccess?.();
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: placeDocRef.path,
      operation: 'update',
      requestResourceData: formData,
    });
    errorEmitter.emit('permission-error', permissionError);
    callbacks?.onError?.(serverError);
  }
}

export function updateSubPoints(
  firestore: Firestore,
  placeId: string,
  subPoints: SubPoint[],
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !placeId) return;
  const docRef = doc(firestore, 'places', placeId);
  
  // Array data update is better handled by replacing the field
  updateDoc(docRef, { subPoints: subPoints })
    .then(() => callbacks?.onSuccess?.())
    .catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { subPoints },
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(err);
    });
}

export function deletePlace(
  firestore: Firestore,
  placeId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !placeId) {
    const error = new Error("Silinecek yerin ID'si eksik.");
    callbacks?.onError?.(error);
    return;
  }

  const placeDocRef = doc(firestore, 'places', placeId);
  deleteDoc(placeDocRef)
    .then(() => {
      callbacks?.onSuccess?.();
    })
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: placeDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}
