'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { googleMapsApiKey } from '@/lib/config';

interface PlacesMapProps {
  places: Place[];
  className?: string;
}

export const PlacesMap: React.FC<PlacesMapProps> = ({ places, className }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const typedLanguage = language as Language;
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const handleAuthError = () => {
      setAuthFailed(true);
    };

    window.addEventListener('gm-auth-failure', handleAuthError);

    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
      return;
    }
    
    // Check if API key is missing
    if (!googleMapsApiKey) {
        setApiError(`Google Haritalar API anahtarı (.env dosyasındaki NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) eksik. Lütfen bir anahtar ekleyin.`);
        return;
    }

    const checkApi = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
            setIsApiLoaded(true);
            return true;
        }
        return false;
    };
    
    if (checkApi()) return;

    // Fallback timer in case the script fails to load for other reasons
    const timeoutId = setTimeout(() => {
        if (!checkApi()) {
           setApiError("Google Haritalar betiği yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.");
        }
    }, 7000);

    const interval = setInterval(() => {
        if (checkApi()) {
            clearInterval(interval);
            clearTimeout(timeoutId);
        }
    }, 200);

    return () => {
      window.removeEventListener('gm-auth-failure', handleAuthError);
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isApiLoaded && mapRef.current && !map && !authFailed) {
      const salihliCenter = { lat: 38.48, lng: 28.14 };
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: salihliCenter,
        zoom: 11,
        mapId: 'ROTA_SALIHLI_MAP',
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(newMap);
    }
  }, [isApiLoaded, map, authFailed]);

  useEffect(() => {
    if (!map || !places || authFailed) return;

    const markers: google.maps.Marker[] = [];
    const infoWindow = new window.google.maps.InfoWindow();

    places.forEach(place => {
      if (!place.coordinates) return;

      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage],
      });

      const contentString = `
        <div style="color: black; max-width: 250px; font-family: 'PT Sans', sans-serif;">
          <h3 style="font-weight: bold; font-size: 1.1rem; margin-bottom: 4px;">${place.name[typedLanguage]}</h3>
          <p style="font-size: 0.9rem; margin: 0 0 8px 0; line-height: 1.4;">${place.description[typedLanguage].substring(0, 100)}...</p>
          <a href="/yerler/${place.slug[typedLanguage]}" style="color: hsl(var(--primary)); text-decoration: none; font-weight: bold;">${t('actions.seeDetails')}</a>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });

      markers.push(marker);
    });

    if (places.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => {
        if (place.coordinates) bounds.extend(place.coordinates);
      });
      map.fitBounds(bounds);

      if (places.length === 1) {
        map.setZoom(14);
      }
    }

    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [map, places, typedLanguage, t, authFailed]);

  if (authFailed) {
      const searchQuery = places.map(p => p.name[typedLanguage] + ", Salihli").join(' | ');
      const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed&hl=${language}`;
      
      return (
          <div className={className}>
              <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Google Haritalar Yüklenemedi (Yetki Hatası)</AlertTitle>
                  <AlertDescription>
                    Google API anahtarınız bu web sitesi için yetkilendirilmemiş. <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Cloud Console</a>'da API anahtarı ayarlarınızı kontrol edin. Şimdilik daha basit bir harita gösteriliyor.
                  </AlertDescription>
              </Alert>
              <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px', borderRadius: 'var(--radius)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('places.title')}
              ></iframe>
          </div>
      );
  }
  
  if (apiError) {
      return (
        <Alert variant="destructive" className={className}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Google Haritalar Yüklenemedi</AlertTitle>
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
      )
  }

  return (
    <div className={cn("relative", className)}>
      {!isApiLoaded && (
         <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg absolute inset-0 z-10">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-muted-foreground">Harita yükleniyor...</p>
         </div>
      )}
      <div ref={mapRef} className={cn("w-full h-full rounded-lg overflow-hidden", { 'invisible': !isApiLoaded })} />
    </div>
  );
};
