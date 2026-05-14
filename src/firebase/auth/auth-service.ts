'use client';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { createUserProfileDocument } from '../firestore/user-service';
import { getFirestore, type Firestore } from 'firebase/firestore';

const ADMIN_EMAIL = 'alikarataskula@gmail.com';

export const signInWithUsername = async (auth: Auth, firestore: Firestore, username: string, password: string): Promise<User | null> => {
  if (username.toLowerCase() !== 'salihli_belediye') {
    throw new Error('Invalid username');
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    const user = result.user;
    
    // Ensure user profile exists in Firestore
    await createUserProfileDocument(firestore, user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with username and password', error);
    throw error;
  }
};


export const signOut = async (auth: Auth): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};
