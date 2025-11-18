'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause } from 'lucide-react';
import Link from 'next/link';

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language, isAudioGuideEnabled } = useTranslation();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const place = places.find(p => p.slug.tr === slug || p.slug.en === slug);
  
  const name = place ? place.name[language] || place.name.tr : '';
  const description = place ? place.description[language] || place.description.tr : '';

  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Cleanup on component unmount or when dependencies change
    return () => {
      synth.cancel();
    };
  }, [description, language]);

  useEffect(() => {
    if (!isAudioGuideEnabled) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isAudioGuideEnabled]);

  const handlePlayPause = () => {
    if (!isAudioGuideEnabled) return;
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
    } else {
      const u = new SpeechSynthesisUtterance(description);
      const voices = synth.getVoices();
      
      let selectedVoice;
      if (language === 'tr') {
          selectedVoice = voices.find(voice => voice.lang.startsWith('tr'));
      } else if (language === 'en') {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (selectedVoice) {
          u.voice = selectedVoice;
      }
      
      u.onend = () => {
        setIsPlaying(false);
      };
      
      synth.cancel(); // Stop any previous speech
      synth.speak(u);
      setIsPlaying(true);
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
                <Button size="lg" variant="outline" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="mr-2" /> : <Volume2 className="mr-2" />}
                    {isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
