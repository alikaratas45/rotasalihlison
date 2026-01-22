'use client';
import { useEffect } from 'react';
import { firebaseConfig } from '@/firebase/config';

export function GoogleMapsProvider() {
  useEffect(() => {
    // Prevent script from being added multiple times
    if (document.getElementById('google-maps-script')) {
      return;
    }
    
    if (!firebaseConfig.apiKey) {
      console.warn("Firebase API Key is missing. Google Maps will not be loaded.");
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${firebaseConfig.apiKey}&libraries=marker&loading=async`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
