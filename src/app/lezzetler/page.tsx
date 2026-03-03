'use client';

import { useLanguage } from '@/hooks/use-language';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Place } from '@/lib/definitions';
import { PlacesMap } from '@/components/places-map';
import { Skeleton } from '@/components/ui/skeleton';

export default function LezzetlerPage() {
  const { t } = useLanguage();
  const firestore = useFirestore();

  // Yemek mekanlarını Firestore'dan çekelim
  const foodQuery = useMemo(() => query(collection(firestore, 'places'), where('category', '==', 'food')), [firestore]);
  const { data: places, loading } = useCollection<Place>(foodQuery);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('cuisine.description')}</p>
      </div>

      <div className="w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden shadow-lg border">
        {loading ? (
            <Skeleton className="w-full h-full" />
        ) : (
            <PlacesMap places={places || []} className="w-full h-full" />
        )}
      </div>
    </div>
  );
}