
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { stories } from '@/lib/data/stories';
import { useLanguage } from '@/hooks/use-language';
import { Suspense, useMemo } from 'react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';


function HikayelerContent() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  
  const firestore = useFirestore();
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);

  const enrichedStories = useMemo(() => {
    if (!places) return stories.map(story => ({...story, placeholder: {imageUrl: `https://picsum.photos/seed/${story.id}/600/400`, imageHint: 'story cover'}}));
    
    return stories.map(story => {
        const relatedPlace = story.placeId ? places.find(p => p.id === story.placeId) : null;
        const placeholder = relatedPlace ? 
                              { imageUrl: relatedPlace.imageUrl, imageHint: relatedPlace.imageHint } :
                              { imageUrl: `https://picsum.photos/seed/${story.id}/600/400`, imageHint: 'story cover' };
        return { ...story, placeholder };
    });
  }, [places]);

  if (placesLoading) {
      return (
          <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="text-center mb-12">
                    <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden h-full">
                          <CardContent className="p-0 flex flex-col h-full">
                              <Skeleton className="h-64 w-full" />
                              <div className="p-6 flex flex-col flex-grow">
                                  <Skeleton className="h-8 w-3/4 mb-4" />
                                  <Skeleton className="h-4 w-full mb-2" />
                                  <Skeleton className="h-4 w-2/3 mb-4" />
                                  <Skeleton className="h-5 w-24 mt-auto" />
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('stories.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('stories.description')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {enrichedStories.map(story => (
            <Link href={`/hikayeler/${story.slug[typedLanguage]}`} key={story.id} className="group">
              <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-64 w-full">
                    <Image
                      src={story.placeholder?.imageUrl || `https://picsum.photos/seed/${story.id}/600/400`}
                      alt={story.title[typedLanguage]}
                      data-ai-hint={story.placeholder?.imageHint || 'story cover'}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                     <div className="absolute bottom-0 p-6 text-white">
                        <h3 className="text-2xl font-bold font-headline mb-2">{story.title[typedLanguage]}</h3>
                        <p className="text-sm opacity-90">{t('stories.by')} {story.author[typedLanguage]}</p>
                      </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-muted-foreground flex-grow text-sm">{story.content[typedLanguage].substring(0, 150)}...</p>
                    <Button variant="link" className="p-0 h-auto mt-4 self-start">
                        {t('actions.readMore')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        )}
      </div>
    </div>
  );
}


export default function HikayelerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HikayelerContent />
        </Suspense>
    )
}
