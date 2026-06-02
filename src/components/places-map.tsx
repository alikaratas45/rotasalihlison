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
  extraMarkers?: Place[];
}

export const PlacesMap: React.FC<PlacesMapProps> = ({ 
  places = [], 
  className, 
  isRoute = false, 
  startLocation, 
  kmlUrl,
  travelMode = 'DRIVING',
  extraMarkers = []
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
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // 1. Google Maps API Kontrolü
  useEffect(() => {
    const handleAuthError = () => setAuthFailed(true);
    window.addEventListener('gm-auth-failure', handleAuthError);

    const checkGoogleMaps = setInterval(() => {
      if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Map) {
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
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: 'greedy',
        styles: [{ "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }]
      });
      setMap(newMap);
      
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#0055FF',
          strokeWeight: 8,
          strokeOpacity: 0.9,
          zIndex: 60
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // 3. Verileri İşleme (Markers, KML, Directions)
  useEffect(() => {
    if (!map || authFailed) return;

    // Temizlik
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] } as any);

    const validPlaces = (places || []).filter(p => p.coordinates?.lat && !isNaN(p.coordinates.lat));
    const validExtra = (extraMarkers || []).filter(p => p.coordinates?.lat && !isNaN(p.coordinates.lat));
    const bounds = new google.maps.LatLngBounds();

    // Kullanıcı Konumu (Mavi Nokta)
    if (startLocation) {
        userMarkerRef.current = new google.maps.Marker({
            position: startLocation,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
                scale: 8
            },
            title: 'Konumunuz',
            zIndex: 200
        });
        bounds.extend(startLocation);
    }

    // Durak İşaretçileri
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
        infoWindow.setContent(`<div style="color:black;padding:5px;"><b>${place.name[typedLanguage] || place.name.tr}</b><br/><a href="/yerler/${place.slug[typedLanguage] || place.slug.tr}" style="color:#166534;font-size:12px;text-decoration:none;">Detaylar →</a></div>`);
        infoWindow.open(map, marker);
      });
      markersRef.current.push(marker);
      bounds.extend(place.coordinates);
    });

    validExtra.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.coordinates,
          map: map,
          title: place.name[typedLanguage] || place.name.tr,
          icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#6B7280',
              fillOpacity: 0.8,
              strokeColor: 'white',
              strokeWeight: 1,
              scale: 8,
          },
          zIndex: 90
        });
        markersRef.current.push(marker);
    });

    // --- ROTA ÇİZİMİ ---
    
    // YOL TARİFİ FONKSİYONU (Smart Fallback)
    const drawDirections = async (pts: Place[], mode: string, bnds: google.maps.LatLngBounds, currentMap: google.maps.Map) => {
        const directionsService = new google.maps.DirectionsService();
        
        const tryRoute = (targetMode: google.maps.TravelMode): Promise<google.maps.DirectionsResult> => {
            return new Promise((resolve, reject) => {
                const waypoints = pts.slice(1, -1).map(p => ({
                    location: p.coordinates,
                    stopover: true
                }));

                directionsService.route({
                    origin: pts[0].coordinates,
                    destination: pts[pts.length - 1].coordinates,
                    waypoints: waypoints,
                    travelMode: targetMode,
                    optimizeWaypoints: false
                }, (result, status) => {
                    if (status === 'OK' && result) resolve(result);
                    else reject(status);
                });
            });
        };

        try {
            // Önce istenen modu dene (WALKING/BICYCLING)
            const gMode = mode === 'BICYCLING' ? google.maps.TravelMode.BICYCLING : 
                          mode === 'WALKING' ? google.maps.TravelMode.WALKING : 
                          google.maps.TravelMode.DRIVING;
            
            const result = await tryRoute(gMode).catch(async () => {
                // Başarısız olursa (yol verisi yoksa) DRIVING dene
                if (gMode !== google.maps.TravelMode.DRIVING) {
                    return await tryRoute(google.maps.TravelMode.DRIVING);
                }
                throw new Error("No route found");
            });

            if (directionsRendererRef.current && result) {
                directionsRendererRef.current.setDirections(result);
            }
        } catch (err) {
            // Tamamen başarısızsa düz çizgilerle bağla
            const path = pts.map(p => p.coordinates);
            const polyline = new google.maps.Polyline({
                path: path,
                strokeColor: '#0055FF',
                strokeOpacity: 0.8,
                strokeWeight: 6,
                map: currentMap,
                zIndex: 50
            });
            polylinesRef.current.push(polyline);
            if (!bnds.isEmpty()) currentMap.fitBounds(bnds);
        }
    };

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

                let kmlHasData = false;
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
                                    kmlHasData = true;
                                }
                            }
                        });

                        if (path.length > 0) {
                            const polyline = new google.maps.Polyline({
                                path: path,
                                strokeColor: '#0055FF',
                                strokeOpacity: 0.9,
                                strokeWeight: 10,
                                map: map,
                                zIndex: 50
                            });
                            polylinesRef.current.push(polyline);
                        }
                    }
                });

                if (kmlHasData && !bounds.isEmpty()) {
                    map.fitBounds(bounds);
                } else if (isRoute && validPlaces.length > 1) {
                    drawDirections(validPlaces, travelMode, bounds, map);
                }
            } catch (error) {
                if (isRoute && validPlaces.length > 1) {
                    drawDirections(validPlaces, travelMode, bounds, map);
                }
            } finally {
                setIsKmlLoading(false);
            }
        };
        processKml();
    } else if (isRoute && validPlaces.length > 1) {
        drawDirections(validPlaces, travelMode, bounds, map);
    } else if (validPlaces.length > 0) {
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
            if (validPlaces.length === 1) map.setZoom(15);
        }
    }

  }, [map, places, extraMarkers, kmlUrl, isRoute, authFailed, language, startLocation, travelMode]);

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