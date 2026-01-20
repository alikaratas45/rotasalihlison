'use client';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { initializeFirebase } from '..';
import type { UserProfile } from '@/lib/definitions';
import { getFirestore } from 'firebase/firestore';

export const createUserProfileDocument = async (userAuth: User) => {
    const app = initializeFirebase();
    const firestore = getFirestore(app);
    const userDocRef = doc(firestore, `users/${userAuth.uid}`);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        // Check if this is the first user
        const usersCollectionRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const isFirstUser = usersSnapshot.empty;

        const { email, displayName, photoURL } = userAuth;
        
        const newUserProfile: UserProfile = {
            uid: userAuth.uid,
            email,
            displayName,
            photoURL,
            isAdmin: isFirstUser, // Make the first user an admin
        };

        try {
            await setDoc(userDocRef, newUserProfile);
        } catch (error) {
            console.error('Error creating user profile', error);
        }
    }

    return userDocRef;
};
