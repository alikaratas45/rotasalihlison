'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // Metre cinsinden
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function AudioProximityAlert() {
  const { t, language, isAudioGuideEnabled } = useLanguage();
  const router = useRouter();
  const firestore = useFirestore();
  const { data: places } = useCollection<Place>(query(collection(firestore, 'places')));

  const [activeAlertPlace, setActiveAlertPlace] = useState<Place | null>(null);
  const [notifiedPlaceIds, setNotifiedPlaceIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Sesli rehber kapalıysa veya yerler yüklenmediyse takip yapma
    if (!isAudioGuideEnabled || !places || places.length === 0) return;

    // ÖNEMLİ: Iframe içinde (önizleme ortamlarında) veya güvensiz (HTTP) bağlamlarda konum takibini engelle
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;
    const isSecure = typeof window !== 'undefined' && window.isSecureContext;

    if (isIframe || !isSecure) {
      console.log("Konum takibi güvenlik politikası veya önizleme ortamı nedeniyle devre dışı bırakıldı.");
      return;
    }

    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        for (const place of places) {
          if (!place.coordinates) continue;
          const dist = calculateDistance(latitude, longitude, place.coordinates.lat, place.coordinates.lng);
          
          if (dist <= 20 && !notifiedPlaceIds.has(place.id)) {
            setActiveAlertPlace(place);
            setNotifiedPlaceIds(prev => new Set(prev).add(place.id));
            break; 
          } else if (dist > 100 && notifiedPlaceIds.has(place.id)) {
            setNotifiedPlaceIds(prev => {
              const next = new Set(prev);
              next.delete(place.id);
              return next;
            });
          }
        }
      },
      (error) => {
        // Hataları sessizce logla, kullanıcıya uyarı verme (özellikle yetki hataları için)
        console.log("Konum servisi bilgisi:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isAudioGuideEnabled, places, notifiedPlaceIds]);

  const handleConfirm = () => {
    if (!activeAlertPlace) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
        const primingUtterance = new SpeechSynthesisUtterance('');
        primingUtterance.volume = 0;
        window.speechSynthesis.speak(primingUtterance);
    }

    const typedLanguage = language as keyof typeof activeAlertPlace.slug;
    const slug = activeAlertPlace.slug[typedLanguage] || activeAlertPlace.slug.tr;
    
    setActiveAlertPlace(null);
    router.push(`/yerler/${slug}?autoplay=true`);
  };

  const handleClose = () => {
    setActiveAlertPlace(null);
  };

  if (!activeAlertPlace) return null;

  return (
    <Dialog open={!!activeAlertPlace} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Volume2 className="h-6 w-6" />
            {t('header.audioGuide')}
          </DialogTitle>
          <DialogDescription className="text-lg py-4 leading-relaxed font-medium text-foreground">
            {t('proximity.alert', activeAlertPlace.name[language as keyof typeof activeAlertPlace.name] || activeAlertPlace.name.tr)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            {t('proximity.no')}
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            {t('proximity.yes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
