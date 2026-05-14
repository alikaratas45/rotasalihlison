
'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Navigation, ChevronRight, Map as MapIcon } from 'lucide-react';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place, Route } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlacesMap } from '@/components/places-map';

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
                <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
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
  const routesQuery = useMemo(() => query(collection(firestore, 'routes')), [firestore]);
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
    if (!routePlaces || routePlaces.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Hata',
            description: 'Rotada gidilecek durak bulunamadı.',
        });
        return;
    }
    
    setIsMapLoading(true);

    const triggerMaps = (origin?: string) => {
        const destination = routePlaces[routePlaces.length - 1];
        const destinationCoords = `${destination.coordinates.lat},${destination.coordinates.lng}`;
        
        let mapsUrl = `https://www.google.com/maps/dir/?api=1`;
        if (origin) mapsUrl += `&origin=${origin}`;
        mapsUrl += `&destination=${destinationCoords}`;

        if (routePlaces.length > 1) {
            const waypoints = routePlaces.slice(0, -1).map(p => `${p.coordinates.lat},${p.coordinates.lng}`).join('|');
            mapsUrl += `&waypoints=${waypoints}`;
        }

        window.open(mapsUrl, '_blank');
        setIsMapLoading(false);
    };

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                triggerMaps(`${latitude},${longitude}`);
            },
            () => {
                // Konum izni yoksa rotadaki ilk duraktan başlat
                const firstStop = routePlaces[0];
                triggerMaps(`${firstStop.coordinates.lat},${firstStop.coordinates.lng}`);
                toast({
                    title: 'Konum Alınamadı',
                    description: 'Mevcut konumunuza erişilemediği için rota ilk duraktan başlatıldı.',
                });
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else {
        triggerMaps();
    }
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
        <Button asChild className="mt-8"><Link href="/rotalar">Tüm Rotaları Gör</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-8">
            <Button asChild variant="ghost">
                <Link href="/rotalar" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Tüm Rotalar
                </Link>
            </Button>
        </div>
        
        <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{route.name[typedLanguage]}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{route.description[typedLanguage]}</p>
            <Button size="lg" className="mt-6 h-14 px-10 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform" onClick={handleStartRoute} disabled={isMapLoading}>
                {isMapLoading ? <Loader2 className="mr-2 animate-spin" /> : <Navigation className="mr-2 h-6 w-6" />}
                {t('actions.startRouteOnMap')}
            </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
            {/* MAP SECTION */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <MapIcon className="text-primary h-6 w-6" />
                    <h2 className="text-2xl font-bold font-headline">Rota Haritası</h2>
                </div>
                <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white ring-1 ring-black/5">
                    <PlacesMap 
                        places={routePlaces} 
                        className="w-full h-full" 
                        isRoute={true} 
                    />
                </div>
            </div>

            {/* STOPS LIST */}
            <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl font-bold font-headline">{t('home.stops_plural')}</h2>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-black">
                        {routePlaces.length} Nokta
                    </span>
                </div>
                
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {routePlaces.map((place, index) => (
                        <Link key={place.id} href={`/yerler/${place.slug[typedLanguage]}`}>
                            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-none bg-white mb-4 ring-1 ring-black/5">
                                <div className="flex gap-4 p-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden shadow-inner">
                                        <Image
                                            src={place.imageUrl || `https://picsum.photos/seed/${place.id}/200/200`}
                                            alt={place.name[typedLanguage]}
                                            data-ai-hint={place.imageHint || 'landmark'}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="100px"
                                        />
                                        <div className="absolute top-1 left-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="text-base font-bold font-headline truncate text-slate-900 group-hover:text-primary transition-colors">
                                            {place.name[typedLanguage]}
                                        </h3>
                                        <div className="flex items-center text-primary font-bold text-[10px] mt-1">
                                            {t('actions.seeDetails')}
                                            <ChevronRight className="h-3 w-3 ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold font-headline text-center border-b pb-6">Durak Detayları</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {routePlaces.map((place) => (
                    <Link key={`detail-${place.id}`} href={`/yerler/${place.slug[typedLanguage]}`} className="block group">
                        <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl border-none ring-1 ring-black/5 rounded-[2rem]">
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                                    alt={place.name[typedLanguage]} 
                                    data-ai-hint={place.imageHint || 'landmark'} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="500px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-bold font-headline text-white text-shadow">{place.name[typedLanguage]}</h3>
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-6">
                                    {place.description[typedLanguage]}
                                </p>
                                <div className="text-sm font-black text-primary flex items-center uppercase tracking-wider">
                                    {t('actions.seeDetails')}
                                    <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"/>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
}
