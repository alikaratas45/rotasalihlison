'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Navigation, ChevronRight } from 'lucide-react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Place, Route } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function RouteDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Skeleton className="h-6 w-40 mb-8" />
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-6" />
                <Skeleton className="h-12 w-56 mx-auto" />
            </div>
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="flex flex-col md:flex-row overflow-hidden">
                        <Skeleton className="h-48 w-full md:w-1/3" />
                        <CardContent className="p-6 flex-1">
                            <Skeleton className="h-8 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function RouteDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Fetch current route from Firestore based on slug
  const routesQuery = useMemo(() => {
    if (!slug) return null;
    // Firestore does not support querying nested objects directly in a platform-agnostic way.
    // So we fetch all and filter on the client. For larger datasets, this should be optimized.
    return query(collection(firestore, 'routes'));
  }, [firestore, slug]);
  const { data: routes, loading: routesLoading } = useCollection<Route>(routesQuery);
  const route = useMemo(() => routes?.find(r => Object.values(r.slug).includes(slug as string)), [routes, slug]);

  // Fetch all places from Firestore
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: allPlaces, loading: placesLoading } = useCollection<Place>(placesQuery);

  // Filter places to get only the ones in the current route
  const routePlaces = useMemo(() => {
    if (!route || !allPlaces) return [];
    return route.stops.map(stopId => allPlaces.find(p => p.id === stopId)).filter(Boolean) as Place[];
  }, [route, allPlaces]);

  const handleStartRoute = () => {
    if (!routePlaces || routePlaces.length === 0) return;
    setIsMapLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const origin = `${latitude},${longitude}`;
        const destination = routePlaces[routePlaces.length - 1];
        const destinationCoords = `${destination.coordinates.lat},${destination.coordinates.lng}`;
        const waypoints = routePlaces.slice(0, -1).map(p => `${p.coordinates.lat},${p.coordinates.lng}`).join('|');
        let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}`;
        if (waypoints) mapsUrl += `&waypoints=${waypoints}`;
        window.open(mapsUrl, '_blank');
        setIsMapLoading(false);
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Konum Alınamadı',
          description: 'Harita rotası oluşturmak için konum izninize ihtiyacımız var.',
        });
        setIsMapLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };
  
  const isLoading = routesLoading || placesLoading;
  if (isLoading) {
    return <RouteDetailSkeleton />;
  }

  if (!route) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold">Rota Bulunamadı</h1>
        <p className="text-muted-foreground mt-4">Aradığınız rota mevcut değil.</p>
        <Button asChild className="mt-8" href="/rotalar"><Link href="/rotalar">Tüm Rotaları Gör</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8"><Button asChild variant="outline"><Link href="/rotalar" className="gap-2"><ArrowLeft />Tüm Rotalar</Link></Button></div>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{route.name[typedLanguage]}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{route.description[typedLanguage]}</p>
            <Button size="lg" className="mt-6" onClick={handleStartRoute} disabled={isMapLoading}>
                {isMapLoading ? <Loader2 className="mr-2 animate-spin" /> : <Navigation className="mr-2" />}
                {t('actions.startRouteOnMap')}
            </Button>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline text-center">{t('home.stops', {count: 2})}</h2>
            {routePlaces.map((place) => (
                <Link key={place.id} href={`/yerler/${place.slug[typedLanguage]}`} className="block group">
                    <Card className="flex flex-col md:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                        <div className="relative h-48 w-full md:w-1/3 flex-shrink-0">
                            <Image
                                src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                                alt={place.name[typedLanguage]} data-ai-hint={place.imageHint || 'landmark'} fill className="object-cover"
                            />
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">{place.name[typedLanguage]}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3">{place.description[typedLanguage]}</p>
                            <div className="mt-4 text-sm font-semibold text-primary flex items-center">
                                {t('actions.seeDetails')}
                                <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"/>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}
