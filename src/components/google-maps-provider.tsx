'use client';
import { useEffect } from 'react';
import { googleMapsApiKey } from '@/lib/config';

export function GoogleMapsProvider() {
  useEffect(() => {
    // Prevent script from being added multiple times
    if (document.getElementById('google-maps-script')) {
      return;
    }
    
    if (!googleMapsApiKey) {
      console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing from .env. Google Maps will not be loaded.");
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=marker&loading=async`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
