'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { stories } from '@/lib/data/stories';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { Language } from '@/context/language-context';

export default function StoryDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;

  const story = stories.find(s => Object.values(s.slug).includes(slug as string));
  const relatedPlace = story && story.placeId ? places.find(p => p.id === story.placeId) : null;
  const placeholder = relatedPlace ? Placeholders.find(p => p.id === relatedPlace.slug.en) : null;

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
  const author = story.author[typedLanguage];
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
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-center">{title}</h1>
        <p className="text-center text-muted-foreground mb-8">{t('stories.by')} {author}</p>
        
        {relatedPlace && (
          <Card className="mb-8 overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={placeholder?.imageUrl || `https://picsum.photos/seed/${relatedPlace.id}/600/400`}
                  alt={relatedPlace.name[typedLanguage]}
                  data-ai-hint={placeholder?.imageHint || 'landscape'}
                  fill
                  className="object-cover"
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

        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto bg-card p-6 md:p-8 rounded-lg">
          <div className="whitespace-pre-line text-card-foreground">
            {content}
          </div>
        </article>
      </div>
    </div>
  );
}
