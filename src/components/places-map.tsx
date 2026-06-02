'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Map, useMap, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Place } from '@/lib/definitions';
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
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-slate-100 h-full w-full", className)}>
      <Map
        mapId="ROTA_SALIHLI_MAP_ID"
        defaultCenter={{ lat: 38.48, lng: 28.14 }}
        defaultZoom={12}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        <KmlAndDirectionsLayer 
          places={places} 
          isRoute={isRoute} 
          kmlUrl={kmlUrl} 
          travelMode={travelMode}
          setIsLoading={setIsLoading}
        />

        {/* User Location Marker */}
        {startLocation && (
          <AdvancedMarker position={startLocation} title="Konumunuz">
            <Pin background={'#4285F4'} glyphColor={'#FFFFFF'} borderColor={'#FFFFFF'} scale={0.8} />
          </AdvancedMarker>
        )}

        {/* Place Markers */}
        {places.map((place, index) => (
          <AdvancedMarker
            key={place.id}
            position={place.coordinates}
            onClick={() => setSelectedPlace(place)}
          >
            <Pin 
              background={'#166534'} 
              glyphColor={'#FFFFFF'} 
              borderColor={'#FFFFFF'} 
              glyph={isRoute ? (index + 1).toString() : undefined}
              scale={isRoute ? 1.2 : 1.0}
            />
          </AdvancedMarker>
        ))}

        {/* Extra Markers */}
        {extraMarkers.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={place.coordinates}
            onClick={() => setSelectedPlace(place)}
          >
            <Pin background={'#6B7280'} glyphColor={'#FFFFFF'} borderColor={'#FFFFFF'} scale={0.8} />
          </AdvancedMarker>
        ))}

        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.coordinates}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-2 text-slate-900">
              <h3 className="font-bold text-sm">{selectedPlace.name.tr}</h3>
              <a href={`/yerler/${selectedPlace.slug.tr}`} className="text-xs text-primary hover:underline mt-1 block">
                Detayları Gör →
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-50">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

/**
 * KML ve Yol Tarifi Katmanını Yöneten Alt Bileşen
 */
const KmlAndDirectionsLayer = ({ 
  places, 
  isRoute, 
  kmlUrl, 
  travelMode,
  setIsLoading 
}: { 
  places: Place[]; 
  isRoute: boolean; 
  kmlUrl?: string; 
  travelMode: string;
  setIsLoading: (val: boolean) => void;
}) => {
  const map = useMap();
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const cleanup = useCallback(() => {
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!map) return;
    cleanup();

    const bounds = new google.maps.LatLngBounds();
    const validPlaces = places.filter(p => p.coordinates?.lat && !isNaN(p.coordinates.lat));

    // --- 1. ÖNCELİK: KML DOSYASI ---
    if (kmlUrl) {
      const processKml = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(kmlUrl).catch(() => null);
          if (!response || !response.ok) throw new Error("KML yüklenemedi");

          const text = await response.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'text/xml');
          const coordsElems = xml.getElementsByTagName('coordinates');
          
          let hasFoundAnyLine = false;

          Array.from(coordsElems).forEach(elem => {
            const raw = elem.textContent?.trim() || "";
            // KML format: "lng,lat,alt lng,lat,alt ..."
            const pointsStr = raw.split(/\s+/).filter(p => p.trim());
            const path: google.maps.LatLngLiteral[] = [];
            
            pointsStr.forEach(p => {
              const parts = p.split(',');
              if (parts.length >= 2) {
                const lng = parseFloat(parts[0]);
                const lat = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  const pt = { lat, lng };
                  path.push(pt);
                  bounds.extend(pt);
                }
              }
            });

            if (path.length > 1) {
              const polyline = new google.maps.Polyline({
                path,
                strokeColor: '#0047FF',
                strokeWeight: 6,
                strokeOpacity: 0.9,
                map
              });
              polylinesRef.current.push(polyline);
              hasFoundAnyLine = true;
            }
          });

          if (hasFoundAnyLine) {
            map.fitBounds(bounds, 50); // 50px padding
          } else {
             // KML'de çizgi yoksa duraklara odaklan
             validPlaces.forEach(p => bounds.extend(p.coordinates));
             if (!bounds.isEmpty()) map.fitBounds(bounds);
          }
        } catch (err) {
          console.warn("KML Hatası, Yol Tarifine Geçiliyor:", err);
          if (isRoute && validPlaces.length >= 2) {
            drawDirections(map, validPlaces, travelMode, bounds, directionsRendererRef);
          }
        } finally {
          setIsLoading(false);
        }
      };
      processKml();
    } 
    // --- 2. SEÇENEK: GOOGLE DIRECTIONS API ---
    else if (isRoute && validPlaces.length >= 2) {
      drawDirections(map, validPlaces, travelMode, bounds, directionsRendererRef);
    } 
    // --- 3. SEÇENEK: SADECE MARKER ODAKLAMA ---
    else if (validPlaces.length > 0) {
      validPlaces.forEach(p => bounds.extend(p.coordinates));
      map.fitBounds(bounds);
      if (validPlaces.length === 1) map.setZoom(15);
    }

    return cleanup;
  }, [map, kmlUrl, places, isRoute, travelMode, cleanup, setIsLoading]);

  return null;
};

/**
 * Standart Google Yol Tarifi Çizme Fonksiyonu
 */
const drawDirections = (
  map: google.maps.Map, 
  places: Place[], 
  mode: string, 
  bounds: google.maps.LatLngBounds,
  rendererRef: React.MutableRefObject<google.maps.DirectionsRenderer | null>
) => {
  if (!places || places.length < 2) return;

  const directionsService = new google.maps.DirectionsService();
  const renderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#0047FF',
      strokeWeight: 6,
      strokeOpacity: 0.8
    }
  });
  rendererRef.current = renderer;

  const waypoints = places.slice(1, -1).map(p => ({
    location: p.coordinates,
    stopover: true
  }));

  const targetMode = mode === 'BICYCLING' ? google.maps.TravelMode.BICYCLING :
                    mode === 'WALKING' ? google.maps.TravelMode.WALKING :
                    google.maps.TravelMode.DRIVING;

  directionsService.route({
    origin: places[0].coordinates,
    destination: places[places.length - 1].coordinates,
    waypoints: waypoints,
    travelMode: targetMode,
    optimizeWaypoints: false
  }, (result, status) => {
    if (status === 'OK' && result) {
      renderer.setDirections(result);
    } else {
      // Fallback: Düz çizgi
      const path = places.map(p => p.coordinates);
      const polyline = new google.maps.Polyline({
        path,
        strokeColor: '#0047FF',
        strokeOpacity: 0.6,
        strokeWeight: 4,
        map
      });
      places.forEach(p => bounds.extend(p.coordinates));
      map.fitBounds(bounds);
    }
  });
};
