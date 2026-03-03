
'use client';

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Survey } from '@/components/survey';

function PlaceDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-6xl mx-auto">
                <Skeleton className="h-12 w-3/4 mb-8" />
                <div className="block">
                    <div className="md:float-left md:w-1/2 md:mr-10 md:mb-8 mb-8 w-full">
                        <Skeleton className="h-[300px] md:h-[500px] w-full rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function PlaceDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const autoplay = searchParams.get('autoplay') === 'true';
  const { t, language, isAudioGuideEnabled } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const typedLanguage = language as Language;

  const firestore = useFirestore();
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);

  const place = useMemo(() => {
    if (!places) return null;
    return places.find(p => Object.values(p.slug).includes(slug as string));
  }, [places, slug]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const isNear = useMemo(() => {
    if (!userLocation || !place) return false;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      place.coordinates.lat,
      place.coordinates.lng
    );
    return distance <= 500;
  }, [userLocation, place]);
  
  const name = place ? place.name[typedLanguage] : '';
  const description = place ? place.description[typedLanguage] : '';

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isAudioGuideEnabled) {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isAudioGuideEnabled, stopAudio]);

  const speak = useCallback((text: string, lang: Language) => {
    const trySpeak = () => {
      setIsGenerating(true);
      const voices = window.speechSynthesis.getVoices();

      if (voices.length === 0) {
        window.speechSynthesis.resume();
        window.speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
        return;
      }
      setIsGenerating(false);
      
      // Pronunciation and expansion fixes
      let fixedText = text.replace(/Gymnasium/gi, 'Cimnazyum');
      if (lang === 'tr') {
        fixedText = fixedText
          .replace(/M\.Ö\./g, 'milattan önce')
          .replace(/M\.Ö/g, 'milattan önce')
          .replace(/MÖ/g, 'milattan önce')
          .replace(/İ\. Ö\./g, 'milattan önce')
          .replace(/İ\.Ö\./g, 'milattan önce');
      }
      
      const utterance = new SpeechSynthesisUtterance(fixedText);
      
      const langMap: Record<Language, string[]> = {
        'tr': ['tr-TR'],
        'en': ['en-US', 'en-GB'],
        'fr': ['fr-FR'],
        'de': ['de-DE'],
        'ja': ['ja-JP'],
      };
      
      const voiceLang = lang;
      const voicePreferences = langMap[voiceLang];

      let selectedVoice;
      if (voicePreferences && voicePreferences.length > 0) {
        selectedVoice = voices.find(voice => voice.lang.replace('_', '-') === voicePreferences[0]);
      }
      
      if (!selectedVoice) {
         selectedVoice = voices.find(voice => voice.lang.startsWith(voiceLang));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = (voicePreferences && voicePreferences.length > 0) ? voicePreferences[0] : 'en-US';
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
    trySpeak();
  }, []);

  const handlePlayPause = useCallback(async () => {
    if (!isAudioGuideEnabled || isGenerating) return;

    if (window.speechSynthesis.speaking) {
        stopAudio();
    } else {
      speak(description, typedLanguage);
    }
  }, [isAudioGuideEnabled, isGenerating, description, typedLanguage, speak, stopAudio]);

  useEffect(() => {
    if (autoplay && place && !placesLoading && !isPlaying && isAudioGuideEnabled) {
      const timer = setTimeout(() => {
        handlePlayPause();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoplay, place, placesLoading, isAudioGuideEnabled, handlePlayPause, isPlaying]);
  
  if (placesLoading) {
      return <PlaceDetailSkeleton />;
  }

  if (!place) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold">{t('places.notFoundTitle')}</h1>
        <p className="text-muted-foreground mt-4">{t('places.notFoundDescription')}</p>
        <Button asChild className="mt-8">
          <Link href="/yerler">{t('actions.viewAllPlaces')}</Link>
        </Button>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/yerler" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('actions.backToPlaces')}
          </Link>
        </Button>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-8 text-primary">{name}</h1>
        
        <div className="relative block">
          {/* Image Floated Left */}
          <div className="md:float-left md:w-1/2 lg:w-3/5 md:mr-10 md:mb-8 mb-8 w-full">
            <Card className="overflow-hidden shadow-2xl border-none">
              <div className="relative h-[300px] md:h-[500px] w-full">
                <Image
                  src={place.imageUrl || `https://picsum.photos/seed/${place.id}/800/600`}
                  alt={name}
                  data-ai-hint={place.imageHint || 'landmark'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          </div>

          {/* Description Text - Justified and wrapping around the image */}
          <div className="text-lg md:text-xl text-muted-foreground whitespace-pre-line leading-relaxed text-justify">
            {description}
          </div>

          {/* Buttons - Clears float or stays next to it based on length */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 clear-both md:clear-none pt-4">
             <Button size="lg" asChild className="flex-1 md:flex-none md:min-w-[200px]">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-5 w-5" />
                    {t('actions.showOnMap')}
                </a>
            </Button>
            {isAudioGuideEnabled && (
                <Button size="lg" variant="outline" onClick={handlePlayPause} disabled={isGenerating} className="flex-1 md:flex-none md:min-w-[200px]">
                    {isGenerating ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="mr-2 h-5 w-5" />
                    ) : (
                        <Volume2 className="mr-2 h-5 w-5" />
                    )}
                    {isGenerating ? t('actions.loadingAudio') : isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
                </Button>
            )}
          </div>

          {/* Survey section appears at bottom, clearing any floats */}
          {isNear && (
            <div className="clear-both pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Survey placeId={place.id} placeName={name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
    return (
        <Suspense fallback={<PlaceDetailSkeleton />}>
            <PlaceDetailContent />
        </Suspense>
    )
}
