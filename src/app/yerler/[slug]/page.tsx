'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/context/language-context';

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language, isAudioGuideEnabled } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Used as a loading state
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const typedLanguage = language as Language;

  const place = places.find(p => Object.values(p.slug).includes(slug as string));
  
  const name = place ? place.name[typedLanguage] : '';
  const description = place ? place.description[typedLanguage] : '';

  const stopAudio = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
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
    const speakText = () => {
      setIsGenerating(false);
      
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        setIsGenerating(true);
        speechSynthesis.addEventListener('voiceschanged', speakText, { once: true });
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;
      
      const langMap: Record<Language, string> = {
        'tr': 'tr-TR',
        'en': 'en-US',
        'fr': 'fr-FR',
        'de': 'de-DE'
      };
      const voiceLang = langMap[lang] || 'en-US';

      // 1. Try to find the exact voice match first (e.g., 'tr-TR')
      let selectedVoice = voices.find(voice => voice.lang === voiceLang);
      
      // 2. If no exact match, find a voice that starts with the language code (e.g., 'en' for 'en-GB')
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(lang));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = selectedVoice?.lang || voiceLang;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = (event) => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    };

    speakText();
  }, []);

  const handlePlayPause = async () => {
    if (!isAudioGuideEnabled) return;

    if (speechSynthesis.speaking) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    } else {
      speak(description, typedLanguage);
    }
  };
  
  const placeholder = place ? Placeholders.find(p => p.id === place.slug.en) : undefined;

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
                src={placeholder?.imageUrl || `https://picsum.photos/seed/${place.id}/800/600`}
                alt={name}
                data-ai-hint={placeholder?.imageHint || 'landmark'}
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
                    {isGenerating ? "Yükleniyor..." : isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
