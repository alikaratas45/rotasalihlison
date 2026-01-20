'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

function PlaceDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                <div className="md:col-span-3">
                    <Card className="overflow-hidden shadow-lg">
                        <Skeleton className="h-[300px] md:h-[450px] w-full" />
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-2/3 mb-6" />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Skeleton className="h-12 w-40" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language, isAudioGuideEnabled } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const typedLanguage = language as Language;

  const firestore = useFirestore();
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);

  const place = useMemo(() => {
    if (!places) return null;
    return places.find(p => Object.values(p.slug).includes(slug as string));
  }, [places, slug]);
  
  const name = place ? place.name[typedLanguage] : '';
  const description = place ? place.description[typedLanguage] : '';

  const stopAudio = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    // When the audio guide is disabled from the header, stop audio
    if (!isAudioGuideEnabled) {
      stopAudio();
    }
    // Cleanup on component unmount
    return () => {
      stopAudio();
    };
  }, [isAudioGuideEnabled, stopAudio]);

  const speak = useCallback((text: string, lang: Language) => {
    
    const trySpeak = () => {
      setIsGenerating(true);
      const voices = speechSynthesis.getVoices();

      if (voices.length === 0) {
        speechSynthesis.resume(); // Try to wake up the speech engine
        speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
        return;
      }
      setIsGenerating(false);
      
      const utterance = new SpeechSynthesisUtterance(text);
      
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
      utterance.onerror = (event) => {
        setIsPlaying(false);
        setIsGenerating(false);
      };
      
      speechSynthesis.speak(utterance);
    }
    trySpeak();
  }, []);

  const handlePlayPause = async () => {
    if (!isAudioGuideEnabled || isGenerating) return;

    if (speechSynthesis.speaking) {
        stopAudio();
    } else {
      speak(description, typedLanguage);
    }
  };
  
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
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
          <Card className="overflow-hidden shadow-lg">
            <div className="relative h-[300px] md:h-[450px] w-full">
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
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">{name}</h1>
          <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Button size="lg" asChild>
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2" />
                    {t('actions.showOnMap')}
                </a>
            </Button>
            {isAudioGuideEnabled && (
                <Button size="lg" variant="outline" onClick={handlePlayPause} disabled={isGenerating}>
                    {isGenerating ? (
                        <Loader2 className="mr-2 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="mr-2" />
                    ) : (
                        <Volume2 className="mr-2" />
                    )}
                    {isGenerating ? t('actions.loadingAudio') : isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
