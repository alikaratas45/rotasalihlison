'use client';

import { useState, useEffect } from 'next/navigation';
import Image from 'next/image';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Volume2, Pause } from 'lucide-react';
import Link from 'next/link';

export default function PlaceDetailPage() {
  const params = useState();
  const slug = params.slug;
  const { t, language } = useTranslation();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const place = places.find(p => p.slug.tr === slug || p.slug.en === slug);
  
  const name = place ? place.name[language] || place.name.tr : '';
  const description = place ? place.description[language] || place.description.tr : '';

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(description);
    
    // Find a Turkish voice if language is 'tr'
    const voices = synth.getVoices();
    if (language === 'tr') {
      const turkishVoice = voices.find(voice => voice.lang.startsWith('tr'));
      if (turkishVoice) {
        u.voice = turkishVoice;
      }
    }
    
    u.onend = () => {
      setIsPlaying(false);
    };
    setUtterance(u);

    // Cleanup function to cancel speech when component unmounts or description changes
    return () => {
      synth.cancel();
    };
  }, [description, language]);

  // Load voices
  useEffect(() => {
      const synth = window.speechSynthesis;
      if (synth.getVoices().length === 0) {
          synth.onvoiceschanged = () => {
               // Re-create utterance when voices are loaded to pick the correct one
                const u = new SpeechSynthesisUtterance(description);
                const voices = synth.getVoices();
                 if (language === 'tr') {
                    const turkishVoice = voices.find(voice => voice.lang.startsWith('tr'));
                    if (turkishVoice) {
                        u.voice = turkishVoice;
                    }
                }
                u.onend = () => {
                    setIsPlaying(false);
                };
                setUtterance(u);
          };
      }
  }, [description, language]);


  const handlePlayPause = () => {
    const synth = window.speechSynthesis;
    if (isPlaying) {
      synth.cancel(); // Stop speaking
      setIsPlaying(false);
    } else if (utterance) {
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };
  
  const placeholder = place ? Placeholders.find(p => p.id === place.slug.en) : undefined;

  if (!place) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold">Yer Bulunamadı</h1>
        <p className="text-muted-foreground mt-4">Aradığınız yer mevcut değil.</p>
        <Button asChild className="mt-8">
          <Link href="/yerler">Tüm Yerleri Gör</Link>
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
                    Haritada Göster
                </a>
            </Button>
            <Button size="lg" variant="outline" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="mr-2" /> : <Volume2 className="mr-2" />}
                {isPlaying ? t('actions.stopAudio') : t('actions.listenAudio')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
