'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { Language } from '@/providers/i18n-provider';
import { generateAudioGuide, type AudioGuideOutput } from '@/ai/flows/text-to-speech-flow';

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language, isAudioGuideEnabled } = useTranslation();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioData, setAudioData] = useState<AudioGuideOutput | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const typedLanguage = language as Language;

  const place = places.find(p => Object.values(p.slug).includes(slug as string));
  
  const name = place ? place.name[typedLanguage] : '';
  const description = place ? place.description[typedLanguage] : '';

  useEffect(() => {
    // When the audio guide is disabled from the header, stop and reset audio
    if (!isAudioGuideEnabled) {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setAudioData(null);
    }
  }, [isAudioGuideEnabled]);

  const handlePlayPause = async () => {
    if (!isAudioGuideEnabled) return;

    // If audio is currently playing, pause it
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is paused, resume playing
    if (!isPlaying && audioData && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        return;
    }

    // If no audio data, generate it
    if (!audioData) {
        setIsGenerating(true);
        try {
            const result = await generateAudioGuide({ textToSpeak: description });
            setAudioData(result);
            // The audio will be played via the useEffect below once audioData is set
        } catch (error) {
            console.error("Error generating audio:", error);
            // Optionally, show a toast notification to the user
        } finally {
            setIsGenerating(false);
        }
    }
  };

  // Effect to play audio when data becomes available
  useEffect(() => {
    if (audioData && audioRef.current) {
        audioRef.current.src = audioData.audioDataUri;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        setIsPlaying(true);
    }
  }, [audioData]);

  // Effect to handle audio ending
  useEffect(() => {
    const audioElement = audioRef.current;
    const handleAudioEnd = () => setIsPlaying(false);
    
    if (audioElement) {
        audioElement.addEventListener('ended', handleAudioEnd);
        return () => {
            audioElement.removeEventListener('ended', handleAudioEnd);
        };
    }
  }, []);

  
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
                    {isGenerating ? "Üretiliyor..." : isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
                </Button>
            )}
          </div>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
