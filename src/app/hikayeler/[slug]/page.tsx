
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { stories } from '@/lib/data/stories';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoryDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;

  const firestore = useFirestore();
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);

  const story = stories.find(s => Object.values(s.slug).includes(slug as string));

  const relatedPlace = useMemo(() => {
    if (!story?.placeId || !places) return null;
    return places.find(p => p.id === story.placeId) || null;
  }, [story, places]);


  if (!story) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold">{t('stories.notFoundTitle')}</h1>
        <p className="text-muted-foreground mt-4">{t('stories.notFoundDescription')}</p>
        <Button asChild className="mt-8">
          <Link href="/hikayeler">{t('actions.viewAllStories')}</Link>
        </Button>
      </div>
    );
  }

  const title = story.title[typedLanguage];
  const content = story.content[typedLanguage];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/hikayeler" className="gap-2">
                    <ArrowLeft />
                    {t('actions.backToStories')}
                </Link>
            </Button>
        </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8 text-center">{title}</h1>
        
        {placesLoading && story?.placeId && (
            <Card className="mb-8 overflow-hidden shadow-lg">
                <div className="grid md:grid-cols-2">
                    <Skeleton className="h-64 md:h-auto w-full" />
                    <div className="p-6 flex flex-col justify-center">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-8 w-48 mb-6" />
                        <Skeleton className="h-11 w-40" />
                    </div>
                </div>
            </Card>
        )}

        {!placesLoading && relatedPlace && (
          <Card className="mb-8 overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={relatedPlace.imageUrl || `https://picsum.photos/seed/${relatedPlace.id}/600/400`}
                  alt={relatedPlace.name[typedLanguage]}
                  data-ai-hint={relatedPlace.imageHint || 'landscape'}
                  fill
                  className="object-cover"
                  sizes="500px"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold font-headline mb-2">{t('stories.relatedPlace')}</h3>
                <p className="text-2xl font-semibold mb-4">{relatedPlace.name[typedLanguage]}</p>
                <Button asChild>
                  <Link href={`/yerler/${relatedPlace.slug[typedLanguage]}`}>
                    <MapPin className="mr-2" />
                    {t('actions.discoverPlace')}
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}

        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto bg-card p-6 md:p-8 rounded-lg shadow-sm border border-primary/5">
          <div className="whitespace-pre-line text-card-foreground text-justify leading-relaxed">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
}
