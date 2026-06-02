'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Loader2 } from 'lucide-react';
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
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [authFailed, setAuthFailed] = useState(false);
  const [isKmlLoading, setIsKmlLoading] = useState(false);
  
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const fallbackPolylineRef = useRef<google.maps.Polyline | null>(null);

  // 1. Google Maps Script Ready Check
  useEffect(() => {
    const handleAuthError = () => setAuthFailed(true);
    window.addEventListener('gm-auth-failure', handleAuthError);

    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setIsApiLoaded(true);
        clearInterval(checkGoogleMaps);
      }
    }, 500);

    return () => {
      window.removeEventListener('gm-auth-failure', handleAuthError);
      clearInterval(checkGoogleMaps);
    };
  }, []);

  // 2. Map Initialization
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
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ]
      });
      setMap(newMap);

      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: '#0047FF',
          strokeWeight: 8,
          strokeOpacity: 0.8,
          zIndex: 50
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // 3. Directions & Path Logic (Used when NO KML is provided)
  useEffect(() => {
    if (!map || !places || authFailed || !directionsServiceRef.current || !directionsRendererRef.current || kmlUrl) {
      if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] } as any);
      if (fallbackPolylineRef.current) fallbackPolylineRef.current.setMap(null);
      return;
    }

    const validPlaces = places.filter(p => p.coordinates?.lat && p.coordinates?.lng);
    
    if (!isRoute) {
        const bounds = new google.maps.LatLngBounds();
        validPlaces.forEach(p => bounds.extend(p.coordinates));
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            if (validPlaces.length === 1) map.setZoom(15);
        }
        return;
    }

    const origin = startLocation || (validPlaces.length >= 1 ? validPlaces[0].coordinates : null);
    if (!origin || validPlaces.length < 1) return;

    let destination;
    let waypoints: google.maps.DirectionsWaypoint[] = [];

    if (startLocation) {
        destination = validPlaces[validPlaces.length - 1].coordinates;
        waypoints = validPlaces.slice(0, -1).map(p => ({ location: p.coordinates, stopover: true }));
    } else {
        if (validPlaces.length < 2) {
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
        const path = [origin, ...validPlaces.map(p => p.coordinates)];
        const fallback = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0047FF',
            strokeOpacity: 0.8,
            strokeWeight: 8,
            map: map,
            zIndex: 50
        });
        fallbackPolylineRef.current = fallback;
        const bounds = new google.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds);
      }
    });
  }, [map, places, isRoute, authFailed, startLocation, travelMode, kmlUrl]);

  // 4. KML Path Logic
  useEffect(() => {
    if (!map || authFailed || !kmlUrl) {
        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];
        return;
    }
    
    const processKml = async () => {
      setIsKmlLoading(true);
      try {
        const response = await fetch(kmlUrl).catch(() => null);
        if (!response || !response.ok) throw new Error("KML load failed");
        
        const kmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
        
        const coordinatesElements = xmlDoc.getElementsByTagName('coordinates');
        const bounds = new google.maps.LatLngBounds();

        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

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
                strokeColor: '#0047FF',
                strokeOpacity: 0.9,
                strokeWeight: 8,       
                map: map,
                zIndex: 40
              });
              polylinesRef.current.push(polyline);
            }
          }
        });

        places.forEach(p => {
            if(p.coordinates?.lat) bounds.extend(p.coordinates);
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("KML Error:", error);
      } finally {
        setIsKmlLoading(false);
      }
    };

    processKml();
  }, [map, kmlUrl, authFailed, places]);

  // 5. Markers Logic
  useEffect(() => {
    if (!map || authFailed) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (!places || places.length === 0) return;

    const infoWindow = new window.google.maps.InfoWindow();
    const typedLanguage = language as Language;

    places.forEach((place, index) => {
      if (!place.coordinates || isNaN(place.coordinates.lat)) return;
      
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage] || place.name.tr,
        label: isRoute ? {
            text: (index + 1).toString(),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
        } : undefined,
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#166534',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: isRoute ? 12 : 10,
        },
        zIndex: 100
      });

      const contentString = `
        <div style="color: black; max-width: 200px; font-family: sans-serif; padding: 4px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name[typedLanguage] || place.name.tr}</h3>
          <a href="/yerler/${place.slug[typedLanguage] || place.slug.tr}" style="color: #166534; font-weight: bold; font-size: 12px; text-decoration: none;">Detayları Gör →</a>
        </div>
      `;

      marker.addListener('click', () => {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });
      
      markersRef.current.push(marker);
    });
  }, [map, places, language, authFailed, isRoute]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-50", className)}>
      {(!isApiLoaded || isKmlLoading) && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};