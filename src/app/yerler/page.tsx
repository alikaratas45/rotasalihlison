
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { places } from '@/lib/data/places';
import { Placeholders } from '@/lib/placeholder-images';
import { useTranslation } from '@/hooks/use-translation';
import { Suspense } from 'react';

function YerlerContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { t, language } = useTranslation();

  const filteredPlaces = category ? places.filter(p => p.category === category) : places;

  const pageInfo: { [key: string]: { title: string, description: string } } = {
    history: {
        title: t('history.title'),
        description: t('history.description')
    },
    nature: {
        title: t('nature.title'),
        description: t('nature.description')
    },
    shopping: {
        title: t('shopping.title'),
        description: t('shopping.description')
    }
  };

  const currentInfo = category ? pageInfo[category] : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        {currentInfo && (
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline mb-4">{currentInfo.title}</h1>
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto whitespace-pre-line">{currentInfo.description}</p>
            </div>
        )}

      {!currentInfo && (
         <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline mb-4">{t('places.title')}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('places.description')}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map(place => {
          const placeholder = Placeholders.find(p => p.id === place.slug.en);
          return (
            <Link href={`/yerler/${place.slug[language]}`} key={place.id} className="group">
              <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-64 w-full">
                    <Image
                      src={placeholder?.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                      alt={place.name[language]}
                      data-ai-hint={placeholder?.imageHint || 'landmark'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold font-headline mb-2">{place.name[language]}</h3>
                    <p className="text-muted-foreground flex-grow">{place.description[language].substring(0, 120)}...</p>
                    <Button variant="link" className="text-accent p-0 h-auto mt-4 self-start">
                        {t('actions.seeDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}


export default function YerlerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <YerlerContent />
        </Suspense>
    )
}
