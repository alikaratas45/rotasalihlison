'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

// Note: Omit 'id' when adding a new place as Firestore generates it.
type PlaceForCreate = Omit<Place, 'id'>;

export const addPlace = (
  db: Firestore,
  placeData: PlaceForCreate
) => {
  addDoc(collection(db, 'places'), placeData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: 'places',
      operation: 'create',
      requestResourceData: placeData,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error to be caught by form logic if necessary
    throw serverError;
  });
};

export const updatePlace = (
  db: Firestore,
  placeId: string,
  placeData: Partial<PlaceForCreate>
) => {
  const placeDocRef = doc(db, 'places', placeId);
  updateDoc(placeDocRef, placeData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: placeDocRef.path,
      operation: 'update',
      requestResourceData: placeData,
    });
    errorEmitter.emit('permission-error', permissionError);
    // Re-throw the error to be caught by form logic if necessary
    throw serverError;
  });
};

export const deletePlace = (db: Firestore, placeId: string) => {
  const placeDocRef = doc(db, 'places', placeId);
  deleteDoc(placeDocRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: placeDocRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
     // Re-throw the error to be caught by form logic if necessary
     throw serverError;
  });
};
