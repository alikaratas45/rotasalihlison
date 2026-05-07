
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
}

export const PlacesMap: React.FC<PlacesMapProps> = ({ places, className, isRoute = false, startLocation, kmlUrl }) => {
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

  // Initialize Map
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
          strokeWeight: 8,       
          strokeOpacity: 0.9,     
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // Track User Location and Show Marker
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
            scale: 10,
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
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [map, isApiLoaded]);

  // Directions logic for routes (standard routing)
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
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result);
      }
    });
  }, [map, places, isRoute, authFailed, startLocation, kmlUrl]);

  // Professional KML Processing: Manual fetch and draw
  useEffect(() => {
    // Clear previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (!map || !kmlUrl || authFailed) return;

    const processKml = async () => {
      try {
        const response = await fetch(kmlUrl);
        const kmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        const coordinatesElements = xmlDoc.getElementsByTagName('coordinates');
        const bounds = new google.maps.LatLngBounds();
        let hasPath = false;

        for (let i = 0; i < coordinatesElements.length; i++) {
          const coordString = coordinatesElements[i].textContent?.trim();
          if (coordString) {
            const path: google.maps.LatLngLiteral[] = [];
            const points = coordString.split(/\s+/);
            
            points.forEach(p => {
              const [lng, lat] = p.split(',').map(Number);
              if (!isNaN(lat) && !isNaN(lng)) {
                const coord = { lat, lng };
                path.push(coord);
                bounds.extend(coord);
              }
            });

            if (path.length > 0) {
              const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#1A237E', // Dark Blue
                strokeOpacity: 0.9,
                strokeWeight: 8,
                map: map,
              });
              polylinesRef.current.push(polyline);
              hasPath = true;
            }
          }
        }

        if (hasPath) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("KML loading error:", error);
      }
    };

    processKml();

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, kmlUrl, authFailed]);

  // Place Markers
  useEffect(() => {
    if (!map || !places || authFailed) return;

    const markers: google.maps.Marker[] = [];
    const infoWindow = new window.google.maps.InfoWindow();

    places.forEach((place, idx) => {
      if (!place.coordinates) return;
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage],
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: 'hsl(140, 56%, 36%)',
            fillOpacity: 0.9,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 10,
        }
      });

      const contentString = `
        <div style="color: black; max-width: 250px; font-family: 'PT Sans', sans-serif; padding: 4px;">
          <h3 style="font-weight: bold; font-size: 1rem; margin-bottom: 4px;">${place.name[typedLanguage]}</h3>
          <p style="font-size: 0.85rem; margin: 0 0 8px 0; line-height: 1.4;">${place.description[typedLanguage].substring(0, 80)}...</p>
          <a href="/yerler/${place.slug[typedLanguage]}" style="color: hsl(140, 56%, 36%); text-decoration: none; font-weight: bold; font-size: 0.85rem;">${t('actions.seeDetails')}</a>
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
      places.forEach(place => { if (place.coordinates) bounds.extend(place.coordinates); });
      if (userMarkerRef.current?.getPosition()) {
          bounds.extend(userMarkerRef.current.getPosition()!);
      }
      if (startLocation) bounds.extend(startLocation);
      map.fitBounds(bounds);
      if (places.length === 1 && !startLocation) map.setZoom(14);
    }

    return () => markers.forEach(m => m.setMap(null));
  }, [map, places, typedLanguage, t, authFailed, isRoute, startLocation, kmlUrl]);

  const handleCenterOnUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map?.panTo(coords);
        map?.setZoom(15);
    });
  };

  if (authFailed) return <div className={className}><Alert variant="destructive"><AlertTitle>Harita Hatası</AlertTitle><AlertDescription>Google Maps yüklenemedi.</AlertDescription></Alert></div>;

  return (
    <div className={cn("relative", className)}>
      {!isApiLoaded && (
         <div className="w-full h-full flex items-center justify-center bg-muted absolute inset-0 z-10">
            <Loader2 className="h-8 w-8 animate-spin" /><p className="ml-4 text-muted-foreground">Harita yükleniyor...</p>
         </div>
      )}
      <div ref={mapRef} className={cn("w-full h-full rounded-lg overflow-hidden", { 'invisible': !isApiLoaded })} />
      {isApiLoaded && (
          <Button variant="secondary" size="icon" className="absolute bottom-6 right-4 z-20 shadow-lg bg-background/90 h-12 w-12 rounded-full border-2 border-primary/20" onClick={handleCenterOnUser}>
            <Navigation className="h-6 w-6 text-primary fill-primary/20" />
          </Button>
      )}
    </div>
  );
};
