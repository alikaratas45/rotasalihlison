
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
import { Loader2, Route as RouteIcon, X, Navigation, MapPin } from 'lucide-react';
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
        <div className="container mx-auto px-4 py-8 md:py-12 space-y-10">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-black font-headline mb-4 text-primary tracking-tight">{t('routePlanner.title')}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium">{t('routePlanner.description')}</p>
                {userLocation ? (
                    <Badge variant="outline" className="mt-4 gap-2 py-1.5 px-4 border-primary/30 text-primary bg-primary/5 rounded-full font-bold">
                        <Navigation className="h-3.5 w-3.5 fill-primary/20" />
                        {t('routePlanner.locationActive')}
                    </Badge>
                ) : (
                    <p className="text-xs text-muted-foreground mt-3 italic opacity-70">{t('routePlanner.locationInactive')}</p>
                )}
            </div>

            {/* 1. MAP AT THE TOP */}
            <Card className="rounded-[2rem] overflow-hidden shadow-2xl border-none ring-1 ring-black/5">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                    <CardTitle className="flex items-center gap-2 font-headline font-black text-primary">
                        <RouteIcon className="h-5 w-5" />
                        {t('routePlanner.routeMap')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="aspect-[21/9] min-h-[350px] md:min-h-[500px] w-full relative">
                        {orderedSelectedPlaces.length > 0 ? (
                            <PlacesMap 
                                places={orderedSelectedPlaces} 
                                className="w-full h-full" 
                                isRoute={true}
                                startLocation={userLocation || undefined}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full bg-muted/20">
                                <div className="p-6 bg-white rounded-full shadow-xl mb-4 text-muted-foreground/30">
                                    <RouteIcon className="h-12 w-12" />
                                </div>
                                <p className="text-muted-foreground font-bold">{t('routePlanner.noSelection')}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 2. SELECTED SUMMARY & ACTION */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-[2rem] shadow-xl border-none bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-black font-headline text-slate-800">{t('routePlanner.selectedPlaces')}</CardTitle>
                        <CardDescription className="font-medium">Size en yakından en uzağa doğru sıralanmıştır.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orderedSelectedPlaces.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {orderedSelectedPlaces.map((place, index) => (
                                     <Badge key={place.id} variant="secondary" className="flex items-center gap-2 text-sm md:text-base py-2 px-4 rounded-xl bg-secondary/50 hover:bg-secondary border-none transition-all animate-in zoom-in-95">
                                        <span className="font-black text-primary bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">{index + 1}</span>
                                        <span className="font-bold text-slate-700">{place.name[typedLanguage]}</span>
                                        <button onClick={() => handlePlaceToggle(place.id)} className="rounded-full hover:bg-destructive/10 p-1 ml-1 text-destructive transition-colors">
                                            <X className="h-4 w-4"/>
                                        </button>
                                     </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-muted-foreground italic bg-muted/10 p-4 rounded-xl border border-dashed">
                                <MapPin className="h-4 w-4" />
                                <span>{t('routePlanner.startPlanning')}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 rounded-[2rem] shadow-xl border-none bg-primary text-primary-foreground flex flex-col justify-center">
                    <CardContent className="p-8 space-y-6">
                        <div className="text-center">
                            <span className="text-4xl font-black">{selectedPlaceIds.length}</span>
                            <span className="text-xl opacity-80"> / {MAX_STOPS}</span>
                            <p className="text-xs uppercase tracking-[0.2em] font-black mt-2 opacity-70">Durak Seçildi</p>
                        </div>
                        <Button 
                            onClick={handleOpenInMaps} 
                            disabled={isMapLoading || orderedSelectedPlaces.length === 0} 
                            className="w-full h-16 rounded-2xl font-black text-lg bg-white text-primary hover:bg-white/90 shadow-2xl transition-all hover:scale-[1.02]"
                        >
                            {isMapLoading ? <Loader2 className="mr-2 animate-spin h-6 w-6" /> : <Navigation className="mr-2 h-6 w-6 fill-primary/20" />}
                            {t('routePlanner.openInMaps')}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* 3. SELECTION LIST - LARGE GRID */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-primary/10 pb-4">
                    <h2 className="text-3xl font-black font-headline text-primary uppercase tracking-tight">{t('routePlanner.selectPlaces')}</h2>
                    <Badge variant="secondary" className="font-black text-sm uppercase px-4 py-1">{sortedPlacesForList.length} Toplam Mekan</Badge>
                </div>

                {placesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="font-bold text-muted-foreground">Yerler Yükleniyor...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedPlacesForList.map(place => {
                            const isSelected = selectedPlaceIds.includes(place.id);
                            const isDisabled = !isSelected && selectedPlaceIds.length >= MAX_STOPS;
                            return (
                                <label
                                    key={place.id}
                                    htmlFor={place.id}
                                    className={cn(
                                        "group relative flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl",
                                        isSelected 
                                            ? "bg-primary/5 border-primary ring-4 ring-primary/10" 
                                            : "bg-white border-transparent hover:border-primary/20",
                                        isDisabled && "opacity-40 cursor-not-allowed grayscale"
                                    )}
                                >
                                    <div className="relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden shadow-inner">
                                        <Image
                                             src={place.imageUrl || `https://picsum.photos/seed/${place.id}/300/300`}
                                             alt={place.name[typedLanguage]}
                                             data-ai-hint={place.imageHint || 'landmark'}
                                             fill
                                             className="object-cover transition-transform duration-700 group-hover:scale-110"
                                             sizes="96px"
                                        />
                                        <div className={cn(
                                            "absolute inset-0 bg-primary/20 transition-opacity duration-500",
                                            isSelected ? "opacity-100" : "opacity-0"
                                        )} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className={cn(
                                            "font-black text-lg truncate mb-1",
                                            isSelected ? "text-primary" : "text-slate-800"
                                        )}>
                                            {place.name[typedLanguage]}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                            {place.description[typedLanguage]}
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <Checkbox
                                            id={place.id}
                                            checked={isSelected}
                                            onCheckedChange={() => { if(!isDisabled) handlePlaceToggle(place.id) }}
                                            disabled={isDisabled}
                                            className="h-7 w-7 rounded-lg border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
