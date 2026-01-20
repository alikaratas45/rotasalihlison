'use client';
import {
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createUserProfileDocument } from '../firestore/user-service';

export const signInWithEmail = async (auth: Auth, firestore: Firestore, email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    // Create a user document in Firestore if it doesn't exist
    await createUserProfileDocument(firestore, user);
  } catch (error) {
    console.error('Error signing in with email and password: ', error);
    // Re-throw the error to be handled by the UI
    throw error;
  }
};


export const signOutUser = async (auth: Auth) => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
