
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2, Navigation } from 'lucide-react';
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
  const { language } = useLanguage();
  const typedLanguage = language as Language;
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [authFailed, setAuthFailed] = useState(false);
  
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    const handleAuthError = () => setAuthFailed(true);
    window.addEventListener('gm-auth-failure', handleAuthError);

    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setIsApiLoaded(true);
        clearInterval(checkGoogleMaps);
      }
    }, 200);

    return () => {
      window.removeEventListener('gm-auth-failure', handleAuthError);
      clearInterval(checkGoogleMaps);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (isApiLoaded && mapRef.current && !map && !authFailed) {
      const salihliCenter = { lat: 38.48, lng: 28.14 };
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: salihliCenter,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy', // Better for mobile maps
        mapTypeControl: false,
      });
      setMap(newMap);

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: '#2563EB', // Vibrant Blue
          strokeWeight: 8,       // Thicker for better visibility
          strokeOpacity: 0.9,     
          zIndex: 50
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // User Location Tracking
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
            strokeWeight: 3,
            scale: 9,
          },
          zIndex: 1000
        });
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => updateUserMarker({ lat: position.coords.latitude, lng: position.coords.longitude }),
        null,
        { enableHighAccuracy: true }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => updateUserMarker({ lat: position.coords.latitude, lng: position.coords.longitude }),
        null,
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [map, isApiLoaded]);

  // Directions Logic
  useEffect(() => {
    if (!map || !places || authFailed || !directionsServiceRef.current || !directionsRendererRef.current) return;

    if (!isRoute || kmlUrl) {
      directionsRendererRef.current.setDirections({ routes: [] });
      return;
    }

    const validPlaces = places.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    const origin = startLocation || (validPlaces.length >= 2 ? validPlaces[0].coordinates : null);
    
    if (!origin || validPlaces.length < 1) {
      directionsRendererRef.current.setDirections({ routes: [] });
      return;
    }

    let destination;
    let waypoints: google.maps.DirectionsWaypoint[] = [];

    if (startLocation) {
        destination = validPlaces[validPlaces.length - 1].coordinates;
        waypoints = validPlaces.slice(0, -1).map(p => ({ location: p.coordinates, stopover: true }));
    } else {
        if (validPlaces.length < 2) return;
        destination = validPlaces[validPlaces.length - 1].coordinates;
        waypoints = validPlaces.slice(1, -1).map(p => ({ location: p.coordinates, stopover: true }));
    }

    directionsServiceRef.current.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode[travelMode || 'DRIVING'],
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result);
      } else {
        console.warn("Directions request failed:", status);
        // Fallback: Fit to markers if route fails
        const bounds = new google.maps.LatLngBounds();
        validPlaces.forEach(p => bounds.extend(p.coordinates));
        if (startLocation) bounds.extend(startLocation);
        map.fitBounds(bounds);
      }
    });
  }, [map, places, isRoute, authFailed, startLocation, kmlUrl, travelMode]);

  // KML Logic
  useEffect(() => {
    if (!map || authFailed) return;
    
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    if (!kmlUrl) return;

    const processKml = async () => {
      try {
        const response = await fetch(kmlUrl).catch(() => null);
        if (!response || !response.ok) return;
        
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
                strokeColor: '#2563EB', // Vibrant Blue
                strokeOpacity: 0.9,
                strokeWeight: 8,       // Thick line for visibility
                map: map,
                zIndex: 40
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

  // Markers Logic
  useEffect(() => {
    if (!map || authFailed) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (!places || places.length === 0) return;

    const infoWindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();
    let validMarkerCount = 0;

    places.forEach((place) => {
      if (!place.coordinates || isNaN(place.coordinates.lat)) return;
      
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage] || place.name.tr,
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#166534', // Deep Heritage Green
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3,
            scale: 8,
        },
        zIndex: 100
      });

      const contentString = `
        <div style="color: black; max-width: 200px; font-family: sans-serif; padding: 4px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name[typedLanguage] || place.name.tr}</h3>
          <p style="font-size: 12px; margin-bottom: 8px;">${(place.description[typedLanguage] || place.description.tr).substring(0, 60)}...</p>
          <a href="/yerler/${place.slug[typedLanguage] || place.slug.tr}" style="color: #166534; font-weight: bold; font-size: 12px; text-decoration: none;">Detayları Gör →</a>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });
      
      markersRef.current.push(marker);
      bounds.extend(place.coordinates);
      validMarkerCount++;
    });

    if (validMarkerCount > 0 && !kmlUrl && !isRoute) {
      map.fitBounds(bounds);
      if (validMarkerCount === 1) map.setZoom(15);
    }

    return () => {
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];
    };
  }, [map, places, typedLanguage, authFailed, isRoute, kmlUrl]);

  const handleCenterOnUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        map?.panTo(coords);
        map?.setZoom(15);
    });
  };

  if (authFailed) return <div className={className}><Alert variant="destructive"><AlertTitle>Harita Hatası</AlertTitle><AlertDescription>Google Haritalar API yüklenemedi.</AlertDescription></Alert></div>;

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-50", className)}>
      {!isApiLoaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {isApiLoaded && (
          <Button variant="secondary" size="icon" className="absolute bottom-6 right-6 z-20 shadow-xl h-12 w-12 rounded-full bg-white border-2 border-primary/10 hover:bg-slate-50" onClick={handleCenterOnUser}>
            <Navigation className="h-6 w-6 text-primary fill-primary/10" />
          </Button>
      )}
    </div>
  );
};
