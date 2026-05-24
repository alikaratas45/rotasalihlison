'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2, AlertCircle, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { googleMapsApiKey } from '@/lib/config';

interface PlacesMapProps {
  places: Place[];
  className?: string;
  isRoute?: boolean;
  startLocation?: { lat: number; lng: number };
  kmlUrl?: string;
  travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING';
}

export const PlacesMap: React.FC<PlacesMapProps> = ({ 
  places, 
  className, 
  isRoute = false, 
  startLocation, 
  kmlUrl,
  travelMode = 'DRIVING'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const typedLanguage = language as Language;
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authFailed, setAuthFailed] = useState(false);
  
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    const handleAuthError = () => {
      setAuthFailed(true);
    };

    window.addEventListener('gm-auth-failure', handleAuthError);

    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
    } else if (!googleMapsApiKey) {
        setApiError(`Google Haritalar API anahtarı eksik.`);
    } else {
        const interval = setInterval(() => {
            if (window.google && window.google.maps && window.google.maps.Map) {
                setIsApiLoaded(true);
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }

    return () => {
      window.removeEventListener('gm-auth-failure', handleAuthError);
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

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#1A237E', 
          strokeWeight: 6,       
          strokeOpacity: 0.8,     
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  useEffect(() => {
    if (!map || !isApiLoaded) return;

    const updateUserMarker = (pos: { lat: number, lng: number }) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(pos);
      } else {
        userMarkerRef.current = new window.google.maps.Marker({
          position: pos,
          map: map,
          title: "Konumunuz",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 8,
          },
          zIndex: 1000
        });
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            updateUserMarker(coords);
        },
        null,
        { enableHighAccuracy: true }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            updateUserMarker(coords);
        },
        (error) => console.warn("Geolocation warning:", error.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [map, isApiLoaded]);

  useEffect(() => {
    if (!map || !places || !isRoute || authFailed || !directionsServiceRef.current || !directionsRendererRef.current || kmlUrl) {
      directionsRendererRef.current?.setDirections({ routes: [] });
      return;
    }

    const origin = startLocation || (places.length >= 2 ? places[0].coordinates : null);
    if (!origin) return;

    let destination;
    let waypoints: google.maps.DirectionsWaypoint[] = [];

    if (startLocation) {
        if (places.length === 0) return;
        destination = places[places.length - 1].coordinates;
        waypoints = places.slice(0, -1).map(p => ({ location: p.coordinates, stopover: true }));
    } else {
        if (places.length < 2) return;
        destination = places[places.length - 1].coordinates;
        waypoints = places.slice(1, -1).map(p => ({ location: p.coordinates, stopover: true }));
    }

    directionsServiceRef.current.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode[travelMode || 'DRIVING'],
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result);
      }
    });
  }, [map, places, isRoute, authFailed, startLocation, kmlUrl, travelMode]);

  useEffect(() => {
    if (!map || !kmlUrl || authFailed) {
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];
        return;
    }

    const processKml = async () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];

      try {
        const response = await fetch(kmlUrl);
        if (!response.ok) return;
        const kmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        const coordinatesElements = xmlDoc.getElementsByTagName('coordinates');
        const bounds = new google.maps.LatLngBounds();
        let hasPath = false;

        Array.from(coordinatesElements).forEach((element) => {
          const coordString = element.textContent?.trim();
          if (coordString) {
            const path: google.maps.LatLngLiteral[] = [];
            const rawPoints = coordString.split(/[\s\n\r]+/).filter(p => p.trim());
            
            rawPoints.forEach(p => {
              const parts = p.split(',');
              if (parts.length >= 2) {
                const lng = parseFloat(parts[0]);
                const lat = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  const coord = { lat, lng };
                  path.push(coord);
                  bounds.extend(coord);
                }
              }
            });

            if (path.length > 0) {
              const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#1A237E',
                strokeOpacity: 0.8,
                strokeWeight: 5,
                map: map,
              });
              polylinesRef.current.push(polyline);
              hasPath = true;
            }
          }
        });

        if (hasPath && !bounds.isEmpty()) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("KML Processing error:", error);
      }
    };

    processKml();
  }, [map, kmlUrl, authFailed]);

  useEffect(() => {
    if (!map || !places || authFailed) return;

    const markers: google.maps.Marker[] = [];
    const infoWindow = new window.google.maps.InfoWindow();

    places.forEach((place) => {
      if (!place.coordinates) return;
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage],
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: 'hsl(142, 35%, 25%)',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 8,
        }
      });

      const contentString = `
        <div style="color: black; max-width: 200px; font-family: sans-serif; padding: 4px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name[typedLanguage]}</h3>
          <p style="font-size: 12px; margin-bottom: 8px;">${place.description[typedLanguage].substring(0, 60)}...</p>
          <a href="/yerler/${place.slug[typedLanguage]}" style="color: #2D5A27; font-weight: bold; font-size: 12px; text-decoration: none;">Detayları Gör →</a>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });
      markers.push(marker);
    });

    if (places.length > 0 && !isRoute && !kmlUrl) {
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => bounds.extend(place.coordinates));
      map.fitBounds(bounds);
      if (places.length === 1) map.setZoom(14);
    }

    return () => markers.forEach(m => m.setMap(null));
  }, [map, places, typedLanguage, t, authFailed, isRoute, kmlUrl]);

  const handleCenterOnUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map?.panTo(coords);
        map?.setZoom(15);
    });
  };

  if (authFailed) return <div className={className}><Alert variant="destructive"><AlertTitle>Harita Hatası</AlertTitle><AlertDescription>Google Haritalar API yüklenemedi.</AlertDescription></Alert></div>;

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {!isApiLoaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {isApiLoaded && (
          <Button variant="secondary" size="icon" className="absolute bottom-4 right-4 z-20 shadow-md h-10 w-10 rounded-full" onClick={handleCenterOnUser}>
            <Navigation className="h-5 w-5 text-primary fill-primary/20" />
          </Button>
      )}
    </div>
  );
};