
'use client';

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2, ArrowLeft, Navigation, Utensils, ExternalLink, Info } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place, SubPoint } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Survey } from '@/components/survey';
import { Badge } from '@/components/ui/badge';

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
  const { t, language, mounted } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNearPlace, setIsNearPlace] = useState(false);
  const [activeSubPoint, setActiveSubPoint] = useState<SubPoint | null>(null);
  
  const hasAutoplayedRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
    utteranceRef.current = null;
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
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const distToMain = calculateDistance(lat, lng, place.coordinates.lat, place.coordinates.lng);
          setIsNearPlace(distToMain <= 50);

          // SubPoint Proximity Check
          if (place.subPoints && place.subPoints.length > 0) {
              let nearestSub: SubPoint | null = null;
              let minDistance = 30; // 30 metre eşiği

              for (const sub of place.subPoints) {
                  const dist = calculateDistance(lat, lng, sub.coordinates.lat, sub.coordinates.lng);
                  if (dist < minDistance) {
                      minDistance = dist;
                      nearestSub = sub;
                  }
              }
              setActiveSubPoint(nearestSub);
          } else {
              setActiveSubPoint(null);
          }
        },
        null,
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [place]);

  const speak = useCallback((text: string, lang: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

    const synth = window.speechSynthesis;

    const startUtterance = () => {
      synth.cancel();
      
      setTimeout(() => {
        // PHONETIC FIXES for better Turkish narration on mobile
        let fixedText = text
            .replace(/Gymnasium/gi, 'Cimnazyum')
            .replace(/Sardes/gi, 'Sardes')
            .replace(/Artemis/gi, 'Artemis')
            .replace(/Lidya/gi, 'Lidya')
            .replace(/Bintepeler/gi, 'Bintepeler')
            .replace(/Sinagog/gi, 'Sinagog')
            .replace(/Havra/gi, 'Havra');

        if (lang === 'tr') {
            fixedText = fixedText
                .replace(/M\.Ö\./g, 'milattan önce')
                .replace(/MÖ/g, 'milattan önce')
                .replace(/İ\.Ö\./g, 'milattan önce')
                .replace(/MS/g, 'milattan sonra')
                .replace(/M\.S\./g, 'milattan sonra');
        }

        if (!fixedText.trim()) {
            setIsGenerating(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(fixedText);
        utteranceRef.current = utterance;
        (window as any)._lastUtterance = utterance; 
        
        utterance.lang = lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'tr-TR';

        const voices = synth.getVoices();
        const findVoice = () => {
            let v = voices.find(v => v.lang.replace('_', '-').toLowerCase() === utterance.lang.toLowerCase());
            if (v) return v;
            v = voices.find(v => v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türkçe'));
            if (v) return v;
            return null;
        };

        const voice = findVoice();
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        }

        utterance.rate = 0.95; 
        utterance.pitch = 1.0;

        utterance.onstart = () => { setIsPlaying(true); setIsGenerating(false); };
        utterance.onend = () => { setIsPlaying(false); utteranceRef.current = null; };
        utterance.onerror = () => { setIsPlaying(false); setIsGenerating(false); utteranceRef.current = null; };
        
        synth.speak(utterance);
      }, 150);
    };

    setIsGenerating(true);
    const priming = new SpeechSynthesisUtterance('');
    priming.volume = 0;
    synth.speak(priming);

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => { startUtterance(); synth.onvoiceschanged = null; };
      setTimeout(startUtterance, 1000);
    } else {
      startUtterance();
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isGenerating || !place) return;
    if (isPlaying) {
      stopAudio();
    } else {
      // Prioritize SubPoint description if active
      const textToSpeak = activeSubPoint 
        ? activeSubPoint.description[typedLanguage] 
        : place.description[typedLanguage];
      speak(textToSpeak, typedLanguage);
    }
  }, [isGenerating, isPlaying, place, activeSubPoint, typedLanguage, speak, stopAudio]);

  const handleGetDirections = useCallback(() => {
    if (!place) return;
    const { lat, lng } = activeSubPoint ? activeSubPoint.coordinates : place.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  }, [place, activeSubPoint]);

  const handleOpenRestaurants = useCallback(() => {
    const searchQuery = encodeURIComponent("Salihli'deki Restaurantlar");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  }, []);

  useEffect(() => {
    if (autoplay && place && !placesLoading && !hasAutoplayedRef.current && mounted) {
      hasAutoplayedRef.current = true;
      const timer = setTimeout(() => {
          const textToSpeak = activeSubPoint 
            ? activeSubPoint.description[typedLanguage] 
            : place.description[typedLanguage];
          speak(textToSpeak, typedLanguage);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoplay, place, placesLoading, speak, typedLanguage, mounted, activeSubPoint]);
  
  if (placesLoading || !mounted) return <PlaceDetailSkeleton />;
  if (!place) return <div className="container mx-auto px-4 py-12 text-center"><h1 className="text-4xl font-bold">{t('places.notFoundTitle')}</h1><Button asChild className="mt-8"><Link href="/yerler">{t('actions.viewAllPlaces')}</Link></Button></div>;

  const currentDisplayName = activeSubPoint ? activeSubPoint.name[typedLanguage] : place.name[typedLanguage];
  const currentDescription = activeSubPoint ? activeSubPoint.description[typedLanguage] : place.description[typedLanguage];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6"><Button asChild variant="ghost" size="sm"><Link href="/yerler" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />{t('actions.backToPlaces')}</Link></Button></div>
      <div className="max-w-6xl mx-auto">
        
        {/* Dynamic Title and Proximity Badge */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary transition-all duration-500">
                {currentDisplayName}
            </h1>
            {activeSubPoint && (
                <Badge className="w-fit bg-accent text-accent-foreground animate-bounce py-1.5 px-4 text-sm font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Şu an buradasınız
                </Badge>
            )}
        </div>

        <div className="relative block">
          <div className="md:float-left md:w-1/2 lg:w-3/5 md:mr-10 md:mb-8 mb-8 w-full">
            <Card className="overflow-hidden shadow-2xl border-none">
              <div className="relative h-[300px] md:h-[500px] w-full">
                <Image 
                    src={place.imageUrl || `https://picsum.photos/seed/${place.id}/800/600`} 
                    alt={currentDisplayName} 
                    data-ai-hint={place.imageHint || 'landmark'} 
                    fill 
                    className="object-cover transition-opacity duration-500" 
                    priority 
                />
                {activeSubPoint && (
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-background/90 p-4 rounded-xl shadow-lg border-2 border-primary/20 max-w-[80%]">
                            <p className="text-primary font-bold text-center flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                {currentDisplayName} detaylarını görüntülüyorsunuz.
                            </p>
                        </div>
                    </div>
                )}
              </div>
            </Card>
          </div>
          <div className="text-lg md:text-xl text-muted-foreground whitespace-pre-line leading-relaxed text-justify transition-all duration-500">
            {currentDescription}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 clear-both pt-4">
            <Button size="lg" variant="outline" onClick={handlePlayPause} disabled={isGenerating} className={cn("flex-1 md:flex-none md:min-w-[200px]", activeSubPoint && "border-primary ring-1 ring-primary/20")}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />}
              {isGenerating ? t('actions.loadingAudio') : isPlaying ? t('actions.stopAudio') : `${currentDisplayName} Dinle`}
            </Button>
            
            {place.id !== '3' ? (
              <Button size="lg" onClick={handleGetDirections} className="flex-1 md:flex-none md:min-w-[200px] gap-2">
                <Navigation className="h-5 w-5" />
                {t('actions.showOnMap')}
              </Button>
            ) : (
              <Button size="lg" onClick={handleOpenRestaurants} className="flex-1 md:flex-none md:min-w-[200px] gap-2 bg-orange-600 hover:bg-orange-700 text-white border-none shadow-md">
                <Utensils className="h-5 w-5" />
                Haritada Tüm Restaurantlar
                <ExternalLink className="h-4 w-4 opacity-70 ml-1" />
              </Button>
            )}
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
