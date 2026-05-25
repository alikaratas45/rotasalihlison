'use client';

import { useState, useEffect, useRef } from 'react';
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
import type { Language } from '@/lib/language-config';

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
  const spokenRef = useRef<string | null>(null);

  // Mekana yaklaşıldığında sesli uyarı ver
  useEffect(() => {
    if (activeAlertPlace && isAudioGuideEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        const placeName = activeAlertPlace.name[language as keyof typeof activeAlertPlace.name] || activeAlertPlace.name.tr;
        const alertText = t('proximity.alert', placeName);
        
        // Eğer bu mekan için zaten seslendirme yapılmadıysa seslendir
        if (spokenRef.current !== activeAlertPlace.id) {
            window.speechSynthesis.cancel(); // Mevcut sesleri durdur
            
            const utterance = new SpeechSynthesisUtterance(alertText);
            const langMap: Record<string, string> = {
                tr: 'tr-TR',
                en: 'en-US',
                fr: 'fr-FR',
                de: 'de-DE',
                ja: 'ja-JP'
            };
            utterance.lang = langMap[language] || 'tr-TR';
            utterance.rate = 0.9;
            
            window.speechSynthesis.speak(utterance);
            spokenRef.current = activeAlertPlace.id;
        }
    } else if (!activeAlertPlace) {
        spokenRef.current = null;
    }
  }, [activeAlertPlace, language, isAudioGuideEnabled, t]);

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
          
          // 25 metre içine girince tetikle
          if (dist <= 25 && !notifiedPlaceIds.has(place.id)) {
            setActiveAlertPlace(place);
            setNotifiedPlaceIds(prev => new Set(prev).add(place.id));
            break; 
          } 
          // 100 metreden uzaklaşınca tekrar bildirim alabilir hale getir
          else if (dist > 100 && notifiedPlaceIds.has(place.id)) {
            setNotifiedPlaceIds(prev => {
              const next = new Set(prev);
              next.delete(place.id);
              return next;
            });
          }
        }
      },
      (error) => {
        console.log("Konum servisi bilgisi:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isAudioGuideEnabled, places, notifiedPlaceIds]);

  const handleConfirm = () => {
    if (!activeAlertPlace) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    const typedLanguage = language as keyof typeof activeAlertPlace.slug;
    const slug = activeAlertPlace.slug[typedLanguage] || activeAlertPlace.slug.tr;
    
    setActiveAlertPlace(null);
    router.push(`/yerler/${slug}?autoplay=true`);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setActiveAlertPlace(null);
  };

  if (!activeAlertPlace) return null;

  return (
    <Dialog open={!!activeAlertPlace} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden p-0">
        <div className="bg-primary/5 p-8 pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-primary animate-pulse">
                <Volume2 className="h-8 w-8" />
            </div>
            <DialogHeader>
                <DialogTitle className="text-2xl font-black font-headline text-primary text-center">
                    {t('header.audioGuide')}
                </DialogTitle>
            </DialogHeader>
        </div>
        <div className="p-8 pt-4 space-y-6">
          <DialogDescription className="text-lg leading-relaxed font-bold text-slate-700 text-center">
            {t('proximity.alert', activeAlertPlace.name[language as keyof typeof activeAlertPlace.name] || activeAlertPlace.name.tr)}
          </DialogDescription>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleClose} className="h-12 rounded-xl flex-1 font-bold">
              {t('proximity.no')}
            </Button>
            <Button onClick={handleConfirm} className="h-12 rounded-xl flex-1 bg-primary text-white hover:bg-primary/90 font-black shadow-lg shadow-primary/20">
              {t('proximity.yes')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
