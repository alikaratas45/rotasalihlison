
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2, Navigation } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const fallbackPolylineRef = useRef<google.maps.Polyline | null>(null);

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
        gestureHandling: 'greedy',
        mapTypeControl: false,
      });
      setMap(newMap);

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: '#0047FF', // Ultra Belirgin Mavi
          strokeWeight: 10,       // Kalın çizgi
          strokeOpacity: 1.0,     
          zIndex: 50
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // Directions & Fallback Routing
  useEffect(() => {
    if (!map || !places || authFailed || !directionsServiceRef.current || !directionsRendererRef.current) return;

    // Clear previous fallback
    if (fallbackPolylineRef.current) {
        fallbackPolylineRef.current.setMap(null);
        fallbackPolylineRef.current = null;
    }

    if (!isRoute || kmlUrl) {
      directionsRendererRef.current.setDirections({ routes: [] });
      return;
    }

    const validPlaces = places.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    const origin = startLocation || (validPlaces.length >= 1 ? validPlaces[0].coordinates : null);
    
    if (!origin || validPlaces.length < 1) return;

    let destination;
    let waypoints: google.maps.DirectionsWaypoint[] = [];

    if (startLocation) {
        destination = validPlaces[validPlaces.length - 1].coordinates;
        waypoints = validPlaces.slice(0, -1).map(p => ({ location: p.coordinates, stopover: true }));
    } else {
        if (validPlaces.length < 2) {
            // Sadece tek bir nokta varsa odaklan ve çık
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(validPlaces[0].coordinates);
            map.fitBounds(bounds);
            map.setZoom(15);
            return;
        }
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
        console.warn("Directions failed, falling back to simple Polyline:", status);
        
        // FALLBACK: Draw simple polyline between all points
        const path = [origin, ...validPlaces.map(p => p.coordinates)];
        const fallback = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0047FF',
            strokeOpacity: 1.0,
            strokeWeight: 10,
            map: map,
            zIndex: 50
        });
        fallbackPolylineRef.current = fallback;

        // Auto-center fallback
        const bounds = new google.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds);
      }
    });
  }, [map, places, isRoute, authFailed, startLocation, kmlUrl, travelMode]);

  // KML Logic with Robust Parsing
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
            // Handle various coord formats (comma, space, newline separated)
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
                strokeColor: '#0047FF', // Ultra Belirgin Mavi
                strokeOpacity: 1.0,
                strokeWeight: 10,       
                map: map,
                zIndex: 40
              });
              polylinesRef.current.push(polyline);
              hasPath = true;
            }
          }
        });

        // Also add places to bounds
        if (places && places.length > 0) {
            places.forEach(p => {
                if(p.coordinates?.lat) bounds.extend(p.coordinates);
            });
        }

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("KML Error:", error);
      }
    };

    processKml();
  }, [map, kmlUrl, authFailed, places]);

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
            fillColor: '#166534',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 4,
            scale: 9,
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
  }, [map, places, typedLanguage, authFailed, isRoute, kmlUrl]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-50", className)}>
      {!isApiLoaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
