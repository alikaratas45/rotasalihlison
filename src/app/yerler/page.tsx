
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Suspense, useMemo, useState, useEffect } from 'react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

function YerlerPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
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


function YerlerContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const { t, language } = useLanguage();
  const firestore = useFirestore();
  const [mapUrl, setMapUrl] = useState('');

  const typedLanguage = language as Language;

  const placesQuery = useMemo(() => {
    const coll = collection(firestore, 'places');
    if (category) {
        return query(coll, where('category', '==', category));
    }
    return query(coll);
  }, [firestore, category]);

  const { data: places, loading } = useCollection<Place>(placesQuery);

  useEffect(() => {
    // We only want to show the map when viewing all places
    if (places && places.length > 0 && !category) {
        const mapQuery = places.map(p => `"${p.name[typedLanguage]}"@${p.coordinates.lat},${p.coordinates.lng}`).join(' OR ');
        const salihliCoords = "38.48,28.14"; // Salihli center
        const zoomLevel = 11; 
        const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&ll=${salihliCoords}&z=${zoomLevel}&output=embed&hl=${language}`;
        setMapUrl(embedUrl);
    } else {
        setMapUrl('');
    }
  }, [places, category, typedLanguage, language]);

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

  if (loading) {
      return <YerlerPageSkeleton />;
  }

  const filteredPlaces = places || [];

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

      {/* NEW MAP SECTION */}
      {mapUrl && (
        <div className="mb-12">
            <div className="w-full h-[60vh] rounded-lg overflow-hidden shadow-lg border">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t('places.title')}
                ></iframe>
            </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place, index) => {
          return (
            <div key={`${place.id}-${index}`} className="group h-full">
                <Link href={`/yerler/${place.slug[typedLanguage]}`} className="block h-full">
                <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-64 w-full">
                        <Image
                        src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                        alt={place.name[typedLanguage]}
                        data-ai-hint={place.imageHint || 'landmark'}
                        fill
                        className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold font-headline mb-2">{place.name[typedLanguage]}</h3>
                        <p className="text-muted-foreground flex-grow">{place.description[typedLanguage].substring(0, 120)}...</p>
                        <Button variant="link" className="p-0 h-auto mt-4 self-start">
                            {t('actions.seeDetails')}
                        </Button>
                    </div>
                    </CardContent>
                </Card>
                </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
}


export default function YerlerPage() {
    return (
        <Suspense fallback={<YerlerPageSkeleton />}>
            <YerlerContent />
        </Suspense>
    )
}
