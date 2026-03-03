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
  isRoute?: boolean; // Rota olarak mı çizilsin (Google Directions API)
}

export const PlacesMap: React.FC<PlacesMapProps> = ({ places, className, isRoute = false }) => {
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

      // Initialize Directions Service
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true, // We will use our own custom markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });
    }
  }, [isApiLoaded, map, authFailed]);

  // Continuous Location Tracking
  useEffect(() => {
    if (!map || !isApiLoaded) return;

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(userPos);
          } else {
            userMarkerRef.current = new window.google.maps.Marker({
              position: userPos,
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
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              break;
            default:
              console.warn("Geolocation warning:", error.message);
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, [map, isApiLoaded]);

  // Handle Real Road Route using Directions API
  useEffect(() => {
    if (!map || !places || !isRoute || authFailed || !directionsServiceRef.current || !directionsRendererRef.current) {
      directionsRendererRef.current?.setDirections({ routes: [] });
      return;
    }

    if (places.length < 2) {
      directionsRendererRef.current.setDirections({ routes: [] });
      return;
    }

    const origin = places[0].coordinates;
    const destination = places[places.length - 1].coordinates;
    const waypoints = places.slice(1, -1).map(p => ({
      location: p.coordinates,
      stopover: true
    }));

    directionsServiceRef.current.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result);
      } else {
        console.warn("Directions request failed due to " + status);
      }
    });
  }, [map, places, isRoute, authFailed]);

  // Handle Place Markers
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

    if (places.length > 0 && !isRoute) { // Only auto-fit bounds if it's not a route (Directions API handles its own bounds)
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
  }, [map, places, typedLanguage, t, authFailed, isRoute]);

  const handleCenterOnUser = () => {
      if (userMarkerRef.current && map) {
          const pos = userMarkerRef.current.getPosition();
          if (pos) {
              map.panTo(pos);
              map.setZoom(15);
          }
      } else {
          navigator.geolocation.getCurrentPosition((pos) => {
              const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              map?.panTo(coords);
              map?.setZoom(15);
          }, (error) => {
              console.warn("Manual center failed:", error.message);
          });
      }
  };

  if (authFailed) {
      const searchQuery = places.map(p => p.name[typedLanguage] + ", Salihli").join(' | ');
      const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed&hl=${language}`;
      
      return (
          <div className={className}>
              <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Harita Yüklenemedi</AlertTitle>
                  <AlertDescription>
                    Alternatif harita görünümü kullanılıyor.
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
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
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
      
      {isApiLoaded && (
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute bottom-6 right-4 z-20 shadow-lg bg-background/90 backdrop-blur hover:bg-background border-2 border-primary/20 h-12 w-12 rounded-full"
            onClick={handleCenterOnUser}
            title="Konumuma Odaklan"
          >
            <Navigation className="h-6 w-6 text-primary fill-primary/20" />
          </Button>
      )}
    </div>
  );
};