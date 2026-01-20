'use client';
import { collection, doc, getDoc, getDocs, setDoc, type Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/definitions';

export const createUserProfileDocument = async (firestore: Firestore, userAuth: User) => {
    const userDocRef = doc(firestore, `users/${userAuth.uid}`);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
        // Check if this is the first user
        const usersCollectionRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const isFirstUser = usersSnapshot.empty;
        
        const isHardcodedAdmin = userAuth.email === 'alikarataskula@gmail.com';

        const { email, displayName, photoURL } = userAuth;
        
        const newUserProfile: UserProfile = {
            uid: userAuth.uid,
            email,
            displayName,
            photoURL,
            isAdmin: isFirstUser || isHardcodedAdmin, // Make the first user or the hardcoded user an admin
        };

        try {
            await setDoc(userDocRef, newUserProfile);
        } catch (error) {
            console.error('Error creating user profile', error);
        }
    }

    return userDocRef;
};
