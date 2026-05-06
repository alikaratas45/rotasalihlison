
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Suspense, useMemo } from 'react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { PlacesMap } from '@/components/places-map';

function YerlerPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
            </div>
            <div className="mb-12 h-[60vh] w-full">
                <Skeleton className="w-full h-full rounded-lg" />
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

  const typedLanguage = language as Language;

  const placesQuery = useMemo(() => {
    const coll = collection(firestore, 'places');
    if (category) {
        return query(coll, where('category', '==', category));
    }
    return query(coll);
  }, [firestore, category]);

  const { data: places, loading } = useCollection<Place>(placesQuery);
  
  // Salihli Odun Köftesi'ni (ID: 3) bu listeden çıkarıyoruz çünkü artık Lezzetler sayfasında özel olarak yer alıyor.
  const filteredPlaces = useMemo(() => {
      return (places || []).filter(place => place.id !== '3');
  }, [places]);

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

  const showMapSection = filteredPlaces.length > 0;
  
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

      {/* MAP SECTION */}
      {showMapSection && (
        <div className="mb-12 h-[60vh] w-full rounded-lg overflow-hidden shadow-lg border">
          <PlacesMap places={filteredPlaces} className="w-full h-full" />
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
