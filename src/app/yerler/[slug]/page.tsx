'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Ear, Loader, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { generateAudioGuide } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language } = useTranslation();
  const { toast } = useToast();

  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const place = places.find(p => p.slug.tr === slug || p.slug.en === slug);
  const placeholder = place ? Placeholders.find(p => p.id === place.slug.en) : undefined;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);

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

  const name = place.name[language] || place.name.tr;
  const description = place.description[language] || place.description.tr;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;

  const handleAudioGuide = async () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return;
    }

    setIsLoadingAudio(true);
    try {
      const result = await generateAudioGuide({ textToSpeak: description });
      setAudioUrl(result.audioDataUri);
    } catch (error) {
      console.error('Error generating audio guide:', error);
      toast({
        variant: 'destructive',
        title: 'Sesli Rehber Hatası',
        description: 'Sesli rehber oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };
  
  useEffect(() => {
    if (audioUrl && audioRef.current) {
        audioRef.current.play();
    }
  }, [audioUrl]);

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
            <Button size="lg" variant="outline" onClick={handleAudioGuide} disabled={isLoadingAudio}>
                {isLoadingAudio ? (
                    <Loader className="mr-2 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="mr-2" />
                ) : (
                    <Play className="mr-2" />
                )}
                {isPlaying ? t('Durdur') : t('actions.listenAudio')}
            </Button>
          </div>
        </div>
      </div>
      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
    </div>
  );
}
