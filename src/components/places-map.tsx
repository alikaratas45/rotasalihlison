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
  places = [], 
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
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // 1. Google Maps API Kontrolü
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

  // 2. Harita Başlatma
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
        styles: [{ "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }]
      });
      setMap(newMap);
      
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#0055FF',
          strokeWeight: 10,
          strokeOpacity: 0.9,
          zIndex: 60
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // 3. Rota Çizimi ve İşaretçiler
  useEffect(() => {
    if (!map || authFailed) return;

    // Temizlik
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] } as any);

    const validPlaces = (places || []).filter(p => p.coordinates?.lat && !isNaN(p.coordinates.lat));
    const bounds = new google.maps.LatLngBounds();

    // İşaretçileri Ekle
    const infoWindow = new window.google.maps.InfoWindow();
    const typedLanguage = language as Language;

    validPlaces.forEach((place, index) => {
      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: map,
        title: place.name[typedLanguage] || place.name.tr,
        label: isRoute ? { text: (index + 1).toString(), color: 'white', fontWeight: 'bold' } : undefined,
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

      marker.addListener('click', () => {
        infoWindow.setContent(`<div style="color:black;padding:5px;"><b>${place.name[typedLanguage]}</b><br/><a href="/yerler/${place.slug[typedLanguage]}" style="color:#166534;font-size:12px;text-decoration:none;">Detaylar →</a></div>`);
        infoWindow.open(map, marker);
      });
      markersRef.current.push(marker);
      bounds.extend(place.coordinates);
    });

    // Rota Çizimi (KML Varsa)
    if (kmlUrl) {
        const processKml = async () => {
            setIsKmlLoading(true);
            try {
                const response = await fetch(kmlUrl).catch(() => null);
                if (!response || !response.ok) throw new Error("Fetch failed");
                const kmlText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
                const coordinatesElements = xmlDoc.getElementsByTagName('coordinates');

                Array.from(coordinatesElements).forEach((element) => {
                    const coordString = element.textContent?.trim();
                    if (coordString) {
                        const path: google.maps.LatLngLiteral[] = [];
                        // KML formatı genelde: lng,lat,alt (boşluk veya yeni satırla ayrılmış)
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
                                strokeColor: '#0055FF',
                                strokeOpacity: 0.85,
                                strokeWeight: 12,
                                map: map,
                                zIndex: 50
                            });
                            polylinesRef.current.push(polyline);
                        }
                    }
                });

                if (!bounds.isEmpty()) {
                    map.fitBounds(bounds);
                    if (validPlaces.length === 1) map.setZoom(15);
                }
            } catch (error) {
                console.warn("KML Error:", error);
            } finally {
                setIsKmlLoading(false);
            }
        };
        processKml();
    } else if (isRoute && validPlaces.length > 1) {
        // KML yoksa ama duraklar varsa, durakları birbirine bağlayan kalın bir çizgi çiz (Directions yerine daha garanti)
        const path = validPlaces.map(p => p.coordinates);
        const polyline = new google.maps.Polyline({
            path: path,
            strokeColor: '#0055FF',
            strokeOpacity: 0.8,
            strokeWeight: 10,
            map: map,
            zIndex: 50
        });
        polylinesRef.current.push(polyline);
        if (!bounds.isEmpty()) map.fitBounds(bounds);
    } else if (validPlaces.length > 0) {
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            if (validPlaces.length === 1) map.setZoom(15);
        }
    }

  }, [map, places, kmlUrl, isRoute, authFailed, language]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-100", className)}>
      {(!isApiLoaded || isKmlLoading) && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {authFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-500 p-4 text-center text-sm font-bold">
              Harita yüklenemedi. Lütfen API anahtarını kontrol edin.
          </div>
      )}
    </div>
  );
};