'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import type { Place } from '@/lib/definitions';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Map, Route as RouteIcon, X, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Language } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { PlacesMap } from '@/components/places-map';

const MAX_STOPS = 10;

// Helper to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function RotaOlusturPage() {
    const { t, language } = useLanguage();
    const typedLanguage = language as Language;
    const firestore = useFirestore();
    const { toast } = useToast();

    const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(false);

    // Get user location on mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.warn("Location access denied or unavailable", error),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
    const { data: allPlaces, loading: placesLoading } = useCollection<Place>(placesQuery);
    
    const sortedPlacesForList = useMemo(() => 
        allPlaces?.slice().sort((a, b) => a.name[typedLanguage].localeCompare(b.name[typedLanguage], language)) || []
    , [allPlaces, language, typedLanguage]);

    // Core Logic: Sort selected places by distance from user location
    const orderedSelectedPlaces = useMemo(() => {
        if (!allPlaces) return [];
        const selected = allPlaces.filter(p => selectedPlaceIds.includes(p.id));
        
        if (!userLocation) return selected;

        return [...selected].sort((a, b) => {
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
            return distA - distB;
        });
    }, [allPlaces, selectedPlaceIds, userLocation]);

    const handlePlaceToggle = useCallback((placeId: string) => {
        setSelectedPlaceIds(prev => {
            const isSelected = prev.includes(placeId);
            if (isSelected) {
                return prev.filter(id => id !== placeId);
            } else {
                if (prev.length >= MAX_STOPS) {
                    toast({
                        variant: 'destructive',
                        title: t('routePlanner.maxLimitToastTitle'),
                        description: t('routePlanner.maxLimitToastDescription'),
                    });
                    return prev;
                }
                return [...prev, placeId];
            }
        });
    }, [toast, t]);
    
    const handleOpenInMaps = useCallback(() => {
        if (orderedSelectedPlaces.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Rota Boş',
                description: 'Lütfen haritada açmak için en az bir yer seçin.',
            });
            return;
        }
        setIsMapLoading(true);

        const triggerMaps = (lat: number, lng: number) => {
            const origin = `${lat},${lng}`;
            let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}`;
            
            if (orderedSelectedPlaces.length === 1) {
                const destinationCoords = `${orderedSelectedPlaces[0].coordinates.lat},${orderedSelectedPlaces[0].coordinates.lng}`;
                mapsUrl += `&destination=${destinationCoords}`;
            } else {
                const destination = orderedSelectedPlaces[orderedSelectedPlaces.length - 1];
                const destinationCoords = `${destination.coordinates.lat},${destination.coordinates.lng}`;
                const waypoints = orderedSelectedPlaces.slice(0, -1).map(p => `${p.coordinates.lat},${p.coordinates.lng}`).join('|');
                mapsUrl += `&destination=${destinationCoords}&waypoints=${waypoints}`;
            }

            window.open(mapsUrl, '_blank');
            setIsMapLoading(false);
        };

        if (userLocation) {
            triggerMaps(userLocation.lat, userLocation.lng);
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    triggerMaps(latitude, longitude);
                },
                () => {
                    toast({
                        variant: 'destructive',
                        title: 'Konum Alınamadı',
                        description: 'Rota oluşturmak için konum izninize ihtiyacımız var.',
                    });
                    setIsMapLoading(false);
                },
                { enableHighAccuracy: true }
            );
        }
    }, [orderedSelectedPlaces, userLocation, toast]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline mb-4">{t('routePlanner.title')}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('routePlanner.description')}</p>
                {userLocation ? (
                    <Badge variant="outline" className="mt-4 gap-1 py-1 px-3 border-primary/30 text-primary">
                        <Navigation className="h-3 w-3 fill-primary/20" />
                        Konumunuz aktif: Rota size en yakın yerden başlayacak şekilde sıralanır.
                    </Badge>
                ) : (
                    <p className="text-xs text-muted-foreground mt-2 italic">Konum erişimine izin verirseniz rota size en yakın noktadan başlayacak şekilde optimize edilir.</p>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                     <CardHeader>
                        <CardTitle>{t('routePlanner.selectPlaces')}</CardTitle>
                        <CardDescription>{selectedPlaceIds.length} / {MAX_STOPS} {t('home.stops_plural')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {placesLoading ? (
                            <div className="flex items-center justify-center h-[70vh]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <ScrollArea className="h-[70vh] p-4 lg:p-6">
                                <div className="space-y-4">
                                    {sortedPlacesForList.map(place => {
                                        const isSelected = selectedPlaceIds.includes(place.id);
                                        const isDisabled = !isSelected && selectedPlaceIds.length >= MAX_STOPS;
                                        return (
                                            <label
                                                key={place.id}
                                                htmlFor={place.id}
                                                className={cn(
                                                    "flex items-center gap-4 p-3 rounded-lg border transition-colors",
                                                    isSelected ? "bg-secondary ring-2 ring-primary" : "hover:bg-muted",
                                                    isDisabled ? "opacity-50 cursor-not-allowed bg-muted/50" : "cursor-pointer",
                                                )}
                                            >
                                                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                                    <Image
                                                         src={place.imageUrl || `https://picsum.photos/seed/${place.id}/200/200`}
                                                         alt={place.name[typedLanguage]}
                                                         data-ai-hint={place.imageHint || 'landmark'}
                                                         fill
                                                         className="object-cover"
                                                         sizes="64px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm truncate">{place.name[typedLanguage]}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{place.description[typedLanguage]}</p>
                                                </div>
                                                <Checkbox
                                                    id={place.id}
                                                    checked={isSelected}
                                                    onCheckedChange={() => { if(!isDisabled) handlePlaceToggle(place.id) }}
                                                    disabled={isDisabled}
                                                    className="ml-auto h-5 w-5"
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-8">
                    <Card className="min-h-[400px]">
                        <CardHeader>
                            <CardTitle>{t('routePlanner.routeMap')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {orderedSelectedPlaces.length > 0 ? (
                                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                    <PlacesMap 
                                        places={orderedSelectedPlaces} 
                                        className="w-full h-full" 
                                        isRoute={true}
                                        startLocation={userLocation || undefined}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full aspect-video bg-muted/50 rounded-lg">
                                    <RouteIcon className="h-12 w-12 text-muted-foreground mb-4"/>
                                    <p className="text-muted-foreground text-center">{t('routePlanner.noSelection')}</p>
                                </div>
                            )}
                            {orderedSelectedPlaces.length > 0 && (
                                <Button onClick={handleOpenInMaps} disabled={isMapLoading} className="mt-4 w-full" size="lg">
                                    {isMapLoading ? <Loader2 className="mr-2 animate-spin" /> : <Map className="mr-2"/>}
                                    {t('routePlanner.openInMaps')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                   <Card>
                        <CardHeader>
                            <CardTitle>{t('routePlanner.selectedPlaces')}</CardTitle>
                            <CardDescription>Size en yakından en uzağa doğru sıralanmıştır.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orderedSelectedPlaces.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {orderedSelectedPlaces.map((place, index) => (
                                         <Badge key={place.id} variant="secondary" className="flex items-center gap-2 text-base py-1 px-3">
                                            <span className="font-bold text-primary mr-1">{index + 1}.</span>
                                            <span>{place.name[typedLanguage]}</span>
                                            <button onClick={() => handlePlaceToggle(place.id)} className="rounded-full hover:bg-muted-foreground/20 p-0.5 ml-1">
                                                <X className="h-3 w-3"/>
                                            </button>
                                         </Badge>
                                    ))}
                                </div>
                            ) : <p className="text-muted-foreground text-sm">{t('routePlanner.startPlanning')}</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}