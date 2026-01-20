'use client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { initializeFirebase, useFirestore } from '..';
import type { UserProfile } from '@/lib/definitions';


export const createUserProfileDocument = async (userAuth: User) => {
    const firestore = getDoc(initializeFirebase()).firestore;
    const userDocRef = doc(firestore, `users/${userAuth.uid}`);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        const { email, displayName, photoURL } = userAuth;
        const createdAt = new Date();

        const newUserProfile: UserProfile = {
            uid: userAuth.uid,
            email,
            displayName,
            photoURL,
            isAdmin: false, // Default to false
        };

        try {
            await setDoc(userDocRef, newUserProfile);
        } catch (error) {
            console.error('Error creating user profile', error);
        }
    }

    return userDocRef;
};
