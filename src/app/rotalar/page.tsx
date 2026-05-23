'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Placeholders } from '@/lib/placeholder-images';
import { MapPinned } from 'lucide-react';
import { Suspense, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Route } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { routes as staticRoutes } from '@/lib/data/routes';


function RotalarContent() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  const routesQuery = useMemo(() => query(collection(firestore, 'routes')), [firestore]);
  const { data: dbRoutes, loading } = useCollection<Route>(routesQuery);

  const displayRoutes = useMemo(() => {
    return (dbRoutes && dbRoutes.length > 0) ? dbRoutes : staticRoutes;
  }, [dbRoutes]);

  if (loading) {
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
                                  <Skeleton className="h-8 w-3/4 mb-2" />
                                  <Skeleton className="h-4 w-full mb-4" />
                                  <Skeleton className="h-5 w-20 mt-auto" />
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
        <h1 className="text-4xl font-bold font-headline mb-4">{t('header.routes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('home.thematicRoutesSubtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayRoutes.map(route => {
            let imageId = '';
            // Match correct placeholder image based on route slug
            const enSlug = route.slug.en || '';
            if (enSlug.includes('lydian')) imageId = 'gymnasium';
            else if (enSlug.includes('nature')) imageId = 'adala-volcanic-canyon';
            else imageId = route.id;

            const placeholder = Placeholders.find(p => p.id === imageId);
            return (
                <Link href={`/rotalar/${route.slug[typedLanguage] || route.slug.tr}`} key={route.id} className="group">
                <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-64 w-full">
                        <Image
                        src={placeholder?.imageUrl || `https://picsum.photos/seed/${route.id}/600/400`}
                        alt={route.name[typedLanguage] || route.name.tr}
                        data-ai-hint={placeholder?.imageHint || 'route map'}
                        fill
                        className="object-cover"
                        sizes="400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold font-headline mb-2">{route.name[typedLanguage] || route.name.tr}</h3>
                        <p className="text-muted-foreground flex-grow text-sm">{route.description[typedLanguage] || route.description.tr}</p>
                        <div className="flex items-center text-sm text-primary font-semibold mt-4">
                            <MapPinned className="w-4 h-4 mr-2"/>
                            <span>{route.stops?.length || 0} {t('home.stops', {count: route.stops?.length || 0})}</span>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </Link>
        )})}
      </div>
    </div>
  );
}


export default function RotalarPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RotalarContent />
        </Suspense>
    )
}
