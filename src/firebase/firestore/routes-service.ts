'use client';
import { collection, addDoc, doc, updateDoc, deleteDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Route } from '@/lib/definitions';

type RouteData = Omit<Route, 'id'>;

export function addRoute(
  firestore: Firestore,
  routeData: RouteData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore) {
    const error = new Error("Firestore instance is missing.");
    callbacks?.onError?.(error);
    return;
  }
  const routesCollection = collection(firestore, 'routes');
  addDoc(routesCollection, routeData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error('Error adding document: ', serverError);
      const permissionError = new FirestorePermissionError({
        path: 'routes',
        operation: 'create',
        requestResourceData: routeData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function updateRoute(
  firestore: Firestore,
  routeId: string,
  routeData: RouteData,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !routeId) {
    const error = new Error("Geçerli bir rota ID'si bulunamadı.");
    callbacks?.onError?.(error);
    return;
  }
  const routeDocRef = doc(firestore, 'routes', routeId);
  updateDoc(routeDocRef, routeData)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error(`Error updating document ${routeId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: routeDocRef.path,
        operation: 'update',
        requestResourceData: routeData,
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}

export function deleteRoute(
  firestore: Firestore,
  routeId: string,
  callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
) {
  if (!firestore || !routeId) {
    const error = new Error("Silinecek rotanın ID'si eksik.");
    callbacks?.onError?.(error);
    return;
  }
  const routeDocRef = doc(firestore, 'routes', routeId);
  deleteDoc(routeDocRef)
    .then(() => callbacks?.onSuccess?.())
    .catch((serverError) => {
      console.error(`Error deleting document ${routeId}: `, serverError);
      const permissionError = new FirestorePermissionError({
        path: routeDocRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
      callbacks?.onError?.(serverError);
    });
}
