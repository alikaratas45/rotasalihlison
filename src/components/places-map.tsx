'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2 } from 'lucide-react';

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

  useEffect(() => {
    const checkApi = () => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setIsApiLoaded(true);
        return true;
      }
      return false;
    };

    if (checkApi()) return;

    const interval = setInterval(() => {
      if (checkApi()) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isApiLoaded && mapRef.current && !map) {
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
  }, [isApiLoaded, map]);

  useEffect(() => {
    if (!map || !places || places.length === 0) return;

    const infoWindow = new window.google.maps.InfoWindow();

    const markers = places.map(place => {
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
      
      return marker;
    });
    
    // Adjust map bounds to include all markers
    if (places.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        places.forEach(place => {
            bounds.extend(place.coordinates);
        });
        map.fitBounds(bounds);
    } else if (places.length === 1) {
        map.setCenter(places[0].coordinates);
        map.setZoom(14);
    }


    return () => {
      markers.forEach(marker => marker.setMap(null));
    };

  }, [map, places, typedLanguage, t]);
  

  return (
    <div className={className}>
      {!isApiLoaded && (
         <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4 text-muted-foreground">Harita yükleniyor...</p>
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" style={{ display: isApiLoaded ? 'block' : 'none' }} />
    </div>
  );
};
