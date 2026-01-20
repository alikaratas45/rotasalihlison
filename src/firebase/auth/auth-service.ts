'use client';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '..';
import { createUserProfileDocument } from '../firestore/user-service';

const app = initializeFirebase();
const auth = getAuth(app);

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    // Create a user document in Firestore if it doesn't exist
    await createUserProfileDocument(user);
  } catch (error) {
    console.error('Error signing in with email and password: ', error);
    // Re-throw the error to be handled by the UI
    throw error;
  }
};


export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
