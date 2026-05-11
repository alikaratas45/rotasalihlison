'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import { calculateDistance } from '@/lib/geo-utils';
import { PlacesMap } from '@/components/places-map';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, Navigation, LocateFixed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Language } from '@/context/language-context';

export default function AroundMePage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationDenied] = useState(false);
  const [isSearching, setIsSearching] = useState(true);

  // Fetch all places from Firestore
  const { data: allPlaces, loading: placesLoading } = useCollection<Place>(
    useMemo(() => query(collection(firestore, 'places')), [firestore])
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsSearching(false);
        },
        (error) => {
          console.error("Location access error:", error);
          setLocationDenied(true);
          setIsSearching(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsSearching(false);
    }
  }, []);

  const nearbyPlaces = useMemo(() => {
    if (!allPlaces || !userLocation) return [];

    return allPlaces
      .map(place => ({
        ...place,
        distanceInKm: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          place.coordinates.lat,
          place.coordinates.lng
        ) / 1000
      }))
      .filter(place => place.distanceInKm <= 15)
      .sort((a, b) => a.distanceInKm - b.distanceInKm);
  }, [allPlaces, userLocation]);

  const categoryLabels: Record<string, string> = useMemo(() => ({ 
    history: t('history.title'), 
    nature: t('nature.title'), 
    food: t('header.cuisine'), 
    shopping: t('shopping.title'), 
    poi: 'POI' 
  }), [t]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="p-3 bg-primary rounded-full text-white shadow-lg w-fit">
            <LocateFixed className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-900">
              {t('aroundMe.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('aroundMe.description')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <PlacesMap 
                    places={nearbyPlaces} 
                    className="w-full h-full" 
                    startLocation={userLocation || undefined}
                />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold font-headline text-slate-800">
                    {t('aroundMe.title')}
                </h2>
                <Badge variant="secondary" className="font-bold">
                    {nearbyPlaces.length} {t('home.stops_plural')}
                </Badge>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {(isSearching || placesLoading) ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={`skeleton-${i}`} className="overflow-hidden border-none shadow-sm">
                            <div className="flex gap-4 p-4">
                                <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-3/4" />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : locationError ? (
                    <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 p-6">
                        <MapPin className="h-10 w-10 text-red-400 mx-auto mb-3" />
                        <p className="text-red-700 font-medium text-sm">
                            {t('aroundMe.locationDenied')}
                        </p>
                    </div>
                ) : nearbyPlaces.length > 0 ? (
                    nearbyPlaces.map((place) => (
                        <Link href={`/yerler/${place.slug[typedLanguage]}`} key={place.id}>
                            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md border-none bg-white mb-4">
                                <div className="flex gap-4 p-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <Image
                                            src={place.imageUrl || `https://picsum.photos/seed/${place.id}/200/200`}
                                            alt={place.name[typedLanguage]}
                                            data-ai-hint={place.imageHint || 'landmark'}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-primary uppercase">
                                                {categoryLabels[place.category]}
                                            </span>
                                            <span className="text-[10px] text-slate-400">•</span>
                                            <span className="text-[10px] font-bold text-slate-500">
                                                {t('aroundMe.distance', place.distanceInKm.toFixed(1))}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold font-headline truncate text-slate-900 group-hover:text-primary transition-colors">
                                            {place.name[typedLanguage]}
                                        </h3>
                                        <p className="text-slate-500 text-xs line-clamp-1 mt-1">
                                            {place.description[typedLanguage]}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                        <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">{t('aroundMe.noPlaces')}</p>
                    </div>
                )}
            </div>
          </div>
        </div>

        {!isSearching && nearbyPlaces.length > 0 && (
            <div className="mt-20">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold font-headline text-slate-900">{t('aroundMe.title')}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {nearbyPlaces.map((place) => (
                        <Card key={`featured-${place.id}`} className="group overflow-hidden transition-all duration-300 hover:shadow-2xl border-none bg-white">
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                                    alt={place.name[typedLanguage]}
                                    data-ai-hint={place.imageHint || 'landmark'}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-primary hover:bg-white font-bold backdrop-blur-sm border-none shadow-sm">
                                        {categoryLabels[place.category]}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Badge className="bg-primary/90 text-white font-bold backdrop-blur-sm border-none shadow-md">
                                        {t('aroundMe.distance', place.distanceInKm.toFixed(1))}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold font-headline mb-3 text-slate-900 group-hover:text-primary transition-colors">
                                    {place.name[typedLanguage]}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                                    {place.description[typedLanguage]}
                                </p>
                                <div className="flex gap-2">
                                    <Button asChild className="flex-1 font-bold h-11" variant="outline">
                                        <Link href={`/yerler/${place.slug[typedLanguage]}`}>
                                            <Info className="mr-2 h-4 w-4" />
                                            {t('actions.seeDetails')}
                                        </Link>
                                    </Button>
                                    <Button 
                                        className="font-bold h-11 px-4" 
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`, '_blank')}
                                    >
                                        <Navigation className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
