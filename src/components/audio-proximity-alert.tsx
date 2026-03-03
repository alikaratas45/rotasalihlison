
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const R = 6371000; // Meters
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

  const speakPrompt = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    
    // Pronunciation fix for Gymnasium and M.Ö.
    let fixedText = text.replace(/Gymnasium/gi, 'Cimnazyum');
    if (language === 'tr') {
      fixedText = fixedText
        .replace(/M\.Ö\./g, 'milattan önce')
        .replace(/M\.Ö/g, 'milattan önce')
        .replace(/MÖ/g, 'milattan önce')
        .replace(/İ\. Ö\./g, 'milattan önce')
        .replace(/İ\.Ö\./g, 'milattan önce');
    }
    
    const utterance = new SpeechSynthesisUtterance(fixedText);
    
    const langMap: Record<string, string> = {
      'tr': 'tr-TR',
      'en': 'en-US',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
    };
    
    utterance.lang = langMap[language] || 'tr-TR';
    window.speechSynthesis.speak(utterance);
  }, [language]);

  useEffect(() => {
    if (!isAudioGuideEnabled || !places || places.length === 0) return;

    if (!("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        for (const place of places) {
          const dist = calculateDistance(latitude, longitude, place.coordinates.lat, place.coordinates.lng);
          
          if (dist <= 30 && !notifiedPlaceIds.has(place.id)) {
            setActiveAlertPlace(place);
            setNotifiedPlaceIds(prev => new Set(prev).add(place.id));
            
            const typedLanguage = language as keyof typeof place.name;
            const placeName = place.name[typedLanguage] || place.name.tr;
            const promptText = t('proximity.alert', placeName);
            
            setTimeout(() => speakPrompt(promptText), 500);
            break; 
          } else if (dist > 150 && notifiedPlaceIds.has(place.id)) {
            setNotifiedPlaceIds(prev => {
              const next = new Set(prev);
              next.delete(place.id);
              return next;
            });
          }
        }
      },
      (error) => {
        console.warn("Geolocation watch error:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isAudioGuideEnabled, places, notifiedPlaceIds, language, speakPrompt, t]);

  const handleConfirm = () => {
    if (!activeAlertPlace) return;
    const typedLanguage = language as keyof typeof activeAlertPlace.slug;
    const slug = activeAlertPlace.slug[typedLanguage] || activeAlertPlace.slug.tr;
    
    window.speechSynthesis.cancel();
    setActiveAlertPlace(null);
    router.push(`/yerler/${slug}?autoplay=true`);
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
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
