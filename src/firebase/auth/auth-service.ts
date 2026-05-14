'use client';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { createUserProfileDocument } from '../firestore/user-service';
import { type Firestore } from 'firebase/firestore';

const ADMIN_EMAIL = 'alikarataskula@gmail.com';

/**
 * Kullanıcı adı (salihli_belediye) ve şifre ile giriş yapar.
 * Arka planda belirlenen admin e-postası ile eşleşme yapar.
 */
export const signInWithUsername = async (auth: Auth, firestore: Firestore, username: string, password: string): Promise<User | null> => {
  if (username.toLowerCase() !== 'salihli_belediye') {
    const error = new Error('auth/invalid-credential');
    (error as any).code = 'auth/invalid-credential';
    throw error;
  }
  
  try {
    // Geliştirici için konsol bilgisi (Üretimde görünebilir, sadece hata ayıklama için)
    console.log(`Giriş denemesi yapılıyor: ${ADMIN_EMAIL}`);
    
    const result = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    const user = result.user;
    
    await createUserProfileDocument(firestore, user);
    return user;
  } catch (error: any) {
    // Hata NextJS ekranını kilitlemesin diye burada yakalayıp dışarı fırlatıyoruz
    throw error;
  }
};

/**
 * Oturumu kapatır.
 */
export const signOut = async (auth: Auth): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};
