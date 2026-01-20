'use client';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '..';
import { createUserProfileDocument } from '../firestore/user-service';

const app = initializeFirebase();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Create a user document in Firestore
    await createUserProfileDocument(user);
  } catch (error) {
    console.error('Error signing in with Google: ', error);
  }
};

export const signOutWithGoogle = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out with Google: ', error);
  }
};
