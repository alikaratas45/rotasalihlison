'use client';
import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/definitions';

export const createUserProfileDocument = async (firestore: Firestore, userAuth: User) => {
    const userDocRef = doc(firestore, `users/${userAuth.uid}`);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        const { email, displayName, photoURL } = userAuth;
        
        const newUserProfile: UserProfile = {
            uid: userAuth.uid,
            email,
            displayName,
            photoURL,
        };

        try {
            await setDoc(userDocRef, newUserProfile);
        } catch (error) {
            console.error('Error creating user profile', error);
        }
    }

    return userDocRef;
};
