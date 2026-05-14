'use client';

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2, ArrowLeft, Navigation, Utensils, ExternalLink, Info, MapPinned, Headphones } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place, SubPoint } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Survey } from '@/components/survey';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Helper to fix common URL mistakes (like Imgur page links instead of direct image links)
const sanitizeImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
    // Convert https://imgur.com/re1zINK to https://i.imgur.com/re1zINK.png
    const parts = url.split('/');
    const id = parts[parts.length - 1];
    return `https://i.imgur.com/${id}.png`;
  }
  return url;
};

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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNearPlace, setIsNearPlace] = useState(false);
  const [activeSubPoint, setActiveSubPoint] = useState<SubPoint | null>(null);
  
  const hasAutoplayedRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const typedLanguage = language as Language;
  const firestore = useFirestore();
  const { data: places, loading: placesLoading } = useCollection<Place>(query(collection(firestore, 'places')));

  const place = useMemo(() => places?.find(p => Object.values(p.slug).includes(slug as string)), [places, slug]);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined') {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
    }
    setIsPlaying(false);
    setIsGenerating(false);
    setPlayingId(null);
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

          if (place.subPoints && place.subPoints.length > 0) {
              let nearestSub: SubPoint | null = null;
              
              const detectionThreshold = (place.id === '12' || place.id === '13') ? 15 : 30;
              let minDistance = detectionThreshold;

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

  const speak = useCallback((text: string, lang: Language, id: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;

    const synth = window.speechSynthesis;

    const startUtterance = () => {
      synth.cancel();
      
      setTimeout(() => {
        let fixedText = text;

        if (lang === 'tr') {
            fixedText = fixedText
                .replace(/Gymnasium/gi, 'Cimnazyum')
                .replace(/Sardes/gi, 'Sardes')
                .replace(/Artemis/gi, 'Artemis')
                .replace(/Lidya/gi, 'Lidya')
                .replace(/Bintepeler/gi, 'Bintepeler')
                .replace(/Sinagog/gi, 'Sinagog')
                .replace(/Havra/gi, 'Havra')
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
        
        const langMap: Record<string, string> = {
            tr: 'tr-TR',
            en: 'en-US',
            fr: 'fr-FR',
            de: 'de-DE',
            ja: 'ja-JP'
        };
        const targetLang = langMap[lang] || 'tr-TR';
        utterance.lang = targetLang;

        const voices = synth.getVoices();
        
        const findBestVoice = () => {
            let matchingVoices = voices.filter(v => v.lang.toLowerCase().replace('_', '-') === targetLang.toLowerCase());
            
            if (matchingVoices.length === 0) {
                const langPart = targetLang.split('-')[0];
                matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPart.toLowerCase()));
            }

            if (matchingVoices.length === 0) return null;

            const googleVoice = matchingVoices.find(v => v.name.includes('Google'));
            if (googleVoice) return googleVoice;

            return matchingVoices[0];
        };

        const voice = findBestVoice();
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
        }

        utterance.rate = 0.95; 
        utterance.pitch = 1.0;

        utterance.onstart = () => { 
            setIsPlaying(true); 
            setIsGenerating(false); 
            setPlayingId(id);
        };
        utterance.onend = () => { 
            setIsPlaying(false); 
            setPlayingId(null);
            utteranceRef.current = null; 
        };
        utterance.onerror = () => { 
            setIsPlaying(false); 
            setIsGenerating(false); 
            setPlayingId(null);
            utteranceRef.current = null; 
        };
        
        synth.speak(utterance);
      }, 150);
    };

    setIsGenerating(true);
    setPlayingId(id);
    
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

  const handlePlayPause = useCallback((id: string, text: string, customAudioUrl?: string) => {
    if (isGenerating) return;
    
    if (isPlaying && playingId === id) {
      stopAudio();
      return;
    }

    stopAudio();

    if (typedLanguage === 'tr' && customAudioUrl) {
        if (!audioPlayerRef.current) {
            audioPlayerRef.current = new Audio();
        }
        audioPlayerRef.current.src = customAudioUrl;
        
        audioPlayerRef.current.onplay = () => {
            setIsPlaying(true);
            setPlayingId(id);
        };
        audioPlayerRef.current.onended = () => {
            setIsPlaying(false);
            setPlayingId(null);
        };
        audioPlayerRef.current.onerror = () => {
            speak(text, typedLanguage, id);
        };

        audioPlayerRef.current.play().catch(err => {
            speak(text, typedLanguage, id);
        });
    } else {
        speak(text, typedLanguage, id);
    }
  }, [isGenerating, isPlaying, playingId, typedLanguage, speak, stopAudio]);

  const handleGetDirections = useCallback((coords?: {lat: number, lng: number}) => {
    if (!place) return;
    const { lat, lng } = coords || (activeSubPoint ? activeSubPoint.coordinates : place.coordinates);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  }, [place, activeSubPoint]);

  useEffect(() => {
    if (autoplay && place && !placesLoading && !hasAutoplayedRef.current && mounted) {
      hasAutoplayedRef.current = true;
      const timer = setTimeout(() => {
          const textToSpeak = activeSubPoint 
            ? activeSubPoint.description[typedLanguage] 
            : place.description[typedLanguage];
          const id = activeSubPoint ? activeSubPoint.id : 'main';
          const audioUrl = activeSubPoint ? activeSubPoint.audioUrlTr : place.audioUrlTr;
          handlePlayPause(id, textToSpeak, audioUrl);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoplay, place, placesLoading, handlePlayPause, typedLanguage, mounted, activeSubPoint]);
  
  if (placesLoading || !mounted) return <PlaceDetailSkeleton />;
  if (!place) return <div className="container mx-auto px-4 py-12 text-center"><h1 className="text-4xl font-bold">{t('places.notFoundTitle')}</h1><Button asChild className="mt-8"><Link href="/yerler">{t('actions.viewAllPlaces')}</Link></Button></div>;

  const currentDisplayName = activeSubPoint ? activeSubPoint.name[typedLanguage] : place.name[typedLanguage];
  const currentDescription = activeSubPoint ? activeSubPoint.description[typedLanguage] : place.description[typedLanguage];
  const currentAudioUrl = activeSubPoint ? activeSubPoint.audioUrlTr : place.audioUrlTr;
  const currentImageUrl = sanitizeImageUrl(activeSubPoint?.imageUrl || place.imageUrl || `https://picsum.photos/seed/${place.id}/800/600`);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6"><Button asChild variant="ghost" size="sm"><Link href="/yerler" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />{t('actions.backToPlaces')}</Link></Button></div>
      <div className="max-w-6xl mx-auto">
        
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
              <div className="relative h-[300px] md:h-[500px] w-full bg-muted">
                <Image 
                    src={currentImageUrl} 
                    alt={currentDisplayName} 
                    data-ai-hint={place.imageHint || 'landmark'} 
                    fill 
                    className="object-cover transition-opacity duration-500" 
                    sizes="800px"
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
            <Button 
                size="lg" 
                variant="outline" 
                onClick={() => handlePlayPause(activeSubPoint ? activeSubPoint.id : 'main', currentDescription, currentAudioUrl)} 
                disabled={isGenerating && playingId !== (activeSubPoint ? activeSubPoint.id : 'main')} 
                className={cn("flex-1 md:flex-none md:min-w-[200px]", activeSubPoint && "border-primary ring-1 ring-primary/20")}
            >
              {isGenerating && playingId === (activeSubPoint ? activeSubPoint.id : 'main') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isPlaying && playingId === (activeSubPoint ? activeSubPoint.id : 'main') ? <Pause className="mr-2 h-5 w-5" /> : (typedLanguage === 'tr' && currentAudioUrl ? <Headphones className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />)}
              {isGenerating && playingId === (activeSubPoint ? activeSubPoint.id : 'main') ? t('actions.loadingAudio') : isPlaying && playingId === (activeSubPoint ? activeSubPoint.id : 'main') ? t('actions.stopAudio') : t('actions.listenTo', currentDisplayName)}
            </Button>
            
            {place.id !== '3' ? (
              <Button size="lg" onClick={() => handleGetDirections()} className="flex-1 md:flex-none md:min-w-[200px] gap-2">
                <Navigation className="h-5 w-5" />
                {t('actions.showOnMap')}
              </Button>
            ) : (
              <Button size="lg" onClick={() => {
                const searchQuery = encodeURIComponent("Salihli'deki Restaurantlar");
                window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
              }} className="flex-1 md:flex-none md:min-w-[200px] gap-2 bg-orange-600 hover:bg-orange-700 text-white border-none shadow-md">
                <Utensils className="h-5 w-5" />
                Haritada Tüm Restaurantlar
                <ExternalLink className="h-4 w-4 opacity-70 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {place.subPoints && place.subPoints.length > 0 && (
            <div className="mt-16 clear-both">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <MapPinned className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold font-headline">{t('subPoints.title')}</h2>
                </div>
                <div className="grid gap-8">
                    {place.subPoints.map((sub) => (
                        <Card key={sub.id} className={cn(
                            "overflow-hidden transition-all duration-500 border-none shadow-lg",
                            activeSubPoint?.id === sub.id ? "ring-2 ring-primary bg-primary/5" : "bg-card"
                        )}>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row min-h-[300px]">
                                    {sub.imageUrl && (
                                        <div className="relative w-full aspect-video md:aspect-auto md:w-2/5 shrink-0 bg-muted">
                                            <Image src={sanitizeImageUrl(sub.imageUrl)} alt={sub.name[typedLanguage]} fill className="object-cover" sizes="500px" />
                                        </div>
                                    )}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold font-headline text-primary mb-2 flex items-center gap-2 flex-wrap">
                                                    {sub.name[typedLanguage]}
                                                    {activeSubPoint?.id === sub.id && <Badge variant="secondary">{t('subPoints.youAreHere', 'Şu an buradasınız')}</Badge>}
                                                </h3>
                                                <div className="flex items-center text-muted-foreground text-sm gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {sub.coordinates.lat.toFixed(6)}, {sub.coordinates.lng.toFixed(6)}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto shrink-0">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handlePlayPause(sub.id, sub.description[typedLanguage], sub.audioUrlTr)}
                                                    disabled={isGenerating && playingId !== sub.id}
                                                    className="flex-1 md:flex-none rounded-xl"
                                                >
                                                    {isGenerating && playingId === sub.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : isPlaying && playingId === sub.id ? <Pause className="h-4 w-4 mr-2" /> : (typedLanguage === 'tr' && sub.audioUrlTr ? <Headphones className="mr-2 h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />)}
                                                    {t('subPoints.listen')}
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => handleGetDirections(sub.coordinates)}
                                                    className="flex-1 md:flex-none rounded-xl"
                                                >
                                                    <Navigation className="h-4 w-4 mr-2" />
                                                    {t('subPoints.directions')}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground leading-relaxed text-justify whitespace-pre-line text-lg flex-1">
                                            {sub.description[typedLanguage]}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}

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
