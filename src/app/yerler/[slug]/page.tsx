
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

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function PlaceDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-6xl mx-auto">
                <Skeleton className="h-12 w-3/4 mb-8" />
                <div className="block">
                    <div className="md:float-left md:w-1/2 md:mr-10 md:mb-8 mb-8 w-full"><Skeleton className="h-[300px] md:h-[500px] w-full rounded-lg" /></div>
                    <div className="space-y-4"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-3/4" /></div>
                </div>
            </div>
        </div>
    );
}

function PlaceDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const autoplay = searchParams.get('autoplay') === 'true';
  const { t, language } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNearPlace, setIsNearPlace] = useState(false);
  
  const hasAutoplayedRef = useRef(false);

  const typedLanguage = language as Language;
  const firestore = useFirestore();
  const { data: places, loading: placesLoading } = useCollection<Place>(query(collection(firestore, 'places')));

  const place = useMemo(() => places?.find(p => Object.values(p.slug).includes(slug as string)), [places, slug]);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  useEffect(() => {
    if (!place) return;
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const dist = calculateDistance(position.coords.latitude, position.coords.longitude, place.coordinates.lat, place.coordinates.lng);
          setIsNearPlace(dist <= 50);
        },
        null,
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [place]);

  const speak = useCallback((text: string, lang: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const startUtterance = () => {
      // Temizlik
      window.speechSynthesis.cancel();
      
      const voices = window.speechSynthesis.getVoices();
      
      let fixedText = text.replace(/Gymnasium/gi, 'Cimnazyum');
      if (lang === 'tr') {
        fixedText = fixedText.replace(/M\.Ö\./g, 'milattan önce').replace(/MÖ/g, 'milattan önce').replace(/İ\.Ö\./g, 'milattan önce');
      } else if (lang === 'en') {
        fixedText = fixedText.replace(/M\.Ö\./g, 'Before Christ').replace(/BC/g, 'Before Christ').replace(/B\.C\./g, 'Before Christ');
      }
      
      const utterance = new SpeechSynthesisUtterance(fixedText);
      
      const langMap: Record<Language, string[]> = {
        'tr': ['tr-TR', 'tr_TR', 'tr'],
        'en': ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN'],
        'fr': ['fr-FR', 'fr-CA'],
        'de': ['de-DE'],
        'ja': ['ja-JP'],
      };
      
      const voicePreferences = langMap[lang];
      utterance.lang = voicePreferences[0]; // Default lang code
      
      // En iyi sesi seç
      let selectedVoice = voices.find(v => voicePreferences?.some(pref => v.lang.replace('_', '-').toLowerCase() === pref.toLowerCase())) || 
                          voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
      
      if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
      }

      utterance.onstart = () => { 
        setIsPlaying(true); 
        setIsGenerating(false); 
      };
      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.error("Speech Synthesis Error:", e);
        }
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      window.speechSynthesis.speak(utterance);
    };

    setIsGenerating(true);

    // Bazı tarayıcılar sesleri asenkron yükler
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        startUtterance();
        window.speechSynthesis.onvoiceschanged = null;
      };
      // Fallback
      setTimeout(() => {
        if (window.speechSynthesis.getVoices().length > 0) startUtterance();
      }, 300);
    } else {
      // User gesture'ı korumak için hemen başlat (timeout'suz)
      startUtterance();
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isGenerating || !place) return;
    if (isPlaying) {
      stopAudio();
    } else {
      speak(place.description[typedLanguage], typedLanguage);
    }
  }, [isGenerating, isPlaying, place, typedLanguage, speak, stopAudio]);

  useEffect(() => {
    if (autoplay && place && !placesLoading && !hasAutoplayedRef.current) {
      hasAutoplayedRef.current = true;
      // Autoplay için kısa bir gecikme (sayfa yüklendikten sonra)
      const timer = setTimeout(() => {
          speak(place.description[typedLanguage], typedLanguage);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoplay, place, placesLoading, speak, typedLanguage]);
  
  if (placesLoading) return <PlaceDetailSkeleton />;
  if (!place) return <div className="container mx-auto px-4 py-12 text-center"><h1 className="text-4xl font-bold">{t('places.notFoundTitle')}</h1><Button asChild className="mt-8"><Link href="/yerler">{t('actions.viewAllPlaces')}</Link></Button></div>;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6"><Button asChild variant="ghost" size="sm"><Link href="/yerler" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />{t('actions.backToPlaces')}</Link></Button></div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-8 text-primary">{place.name[typedLanguage]}</h1>
        <div className="relative block">
          <div className="md:float-left md:w-1/2 lg:w-3/5 md:mr-10 md:mb-8 mb-8 w-full">
            <Card className="overflow-hidden shadow-2xl border-none">
              <div className="relative h-[300px] md:h-[500px] w-full">
                <Image src={place.imageUrl || `https://picsum.photos/seed/${place.id}/800/600`} alt={place.name[typedLanguage]} data-ai-hint={place.imageHint || 'landmark'} fill className="object-cover" priority />
              </div>
            </Card>
          </div>
          <div className="text-lg md:text-xl text-muted-foreground whitespace-pre-line leading-relaxed text-justify">
            {place.description[typedLanguage]}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 clear-both pt-4">
             {place.id !== '3' && (
               <Button size="lg" asChild className="flex-1 md:flex-none md:min-w-[200px]">
                 <a href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`} target="_blank" rel="noopener noreferrer">
                   <MapPin className="mr-2 h-5 w-5" />{t('actions.showOnMap')}
                 </a>
               </Button>
             )}
            <Button size="lg" variant="outline" onClick={handlePlayPause} disabled={isGenerating} className="flex-1 md:flex-none md:min-w-[200px]">
              {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />}
              {isGenerating ? t('actions.loadingAudio') : isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
            </Button>
          </div>
        </div>
        {isNearPlace && (
          <div className="mt-20 border-t pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Survey placeId={place.id} placeName={place.name.tr} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
    return <Suspense fallback={<PlaceDetailSkeleton />}><PlaceDetailContent /></Suspense>
}
