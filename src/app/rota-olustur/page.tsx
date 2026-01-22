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
import { Loader2, Map, Route as RouteIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Language } from '@/context/language-context';
import { cn } from '@/lib/utils';

const MAX_STOPS = 10;

export default function RotaOlusturPage() {
    const { t, language } = useLanguage();
    const typedLanguage = language as Language;
    const firestore = useFirestore();
    const { toast } = useToast();

    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
    const [mapUrl, setMapUrl] = useState<string>('');
    const [isMapLoading, setIsMapLoading] = useState(false);

    const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
    const { data: places, loading: placesLoading } = useCollection<Place>(placesQuery);
    const sortedPlaces = useMemo(() => places?.slice().sort((a, b) => a.name[typedLanguage].localeCompare(b.name[typedLanguage], language)) || [], [places, language, typedLanguage]);

    const handlePlaceSelection = useCallback((place: Place) => {
        setSelectedPlaces(prev => {
            const isSelected = prev.find(p => p.id === place.id);
            if (isSelected) {
                return prev.filter(p => p.id !== place.id);
            } else {
                if (prev.length >= MAX_STOPS) {
                    toast({
                        variant: 'destructive',
                        title: t('routePlanner.maxLimitToastTitle'),
                        description: t('routePlanner.maxLimitToastDescription'),
                    });
                    return prev;
                }
                return [...prev, place];
            }
        });
    }, [toast, t]);

    useEffect(() => {
        if (selectedPlaces.length < 2) {
            setMapUrl('');
            return;
        }

        const saddr = `${selectedPlaces[0].coordinates.lat},${selectedPlaces[0].coordinates.lng}`;
        const daddr = selectedPlaces.slice(1).map(p => `${p.coordinates.lat},${p.coordinates.lng}`).join('+to:');
        const finalEmbedUrl = `https://maps.google.com/maps?saddr=${saddr}&daddr=${daddr}&output=embed&z=10&hl=${language}`;
        setMapUrl(finalEmbedUrl);
    }, [selectedPlaces, language]);
    
    const handleOpenInMaps = useCallback(() => {
        if (selectedPlaces.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Rota Boş',
                description: 'Lütfen haritada açmak için en az bir yer seçin.',
            });
            return;
        }
        setIsMapLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const origin = `${latitude},${longitude}`;
                
                let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}`;
                
                if (selectedPlaces.length === 1) {
                    const destination = `${selectedPlaces[0].coordinates.lat},${selectedPlaces[0].coordinates.lng}`;
                    mapsUrl += `&destination=${destination}`;
                } else {
                    const destination = selectedPlaces[selectedPlaces.length - 1];
                    const destinationCoords = `${destination.coordinates.lat},${destination.coordinates.lng}`;
                    const waypoints = selectedPlaces.slice(0, -1).map(p => `${p.coordinates.lat},${p.coordinates.lng}`).join('|');
                    mapsUrl += `&destination=${destinationCoords}&waypoints=${waypoints}`;
                }

                window.open(mapsUrl, '_blank');
                setIsMapLoading(false);
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
    }, [selectedPlaces, toast]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline mb-4">{t('routePlanner.title')}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('routePlanner.description')}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                     <CardHeader>
                        <CardTitle>{t('routePlanner.selectPlaces')}</CardTitle>
                        <CardDescription>{selectedPlaces.length} / {MAX_STOPS} {t('home.stops_plural')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {placesLoading ? (
                            <div className="flex items-center justify-center h-[70vh]">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <ScrollArea className="h-[70vh] p-4 lg:p-6">
                                <div className="space-y-4">
                                    {sortedPlaces.map(place => {
                                        const isSelected = selectedPlaces.some(p => p.id === place.id);
                                        const isDisabled = !isSelected && selectedPlaces.length >= MAX_STOPS;
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
                                                    onCheckedChange={() => { if(!isDisabled) handlePlaceSelection(place) }}
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
                   <Card>
                        <CardHeader>
                            <CardTitle>{t('routePlanner.selectedPlaces')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedPlaces.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlaces.map((place, index) => (
                                         <Badge key={place.id} variant="secondary" className="flex items-center gap-2 text-base py-1 px-3">
                                            <span>{index + 1}. {place.name[typedLanguage]}</span>
                                            <button onClick={() => handlePlaceSelection(place)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                                <X className="h-3 w-3"/>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            ) : <p className="text-muted-foreground text-sm">{t('routePlanner.startPlanning')}</p>}
                        </CardContent>
                    </Card>
                    <Card className="min-h-[400px]">
                        <CardHeader>
                            <CardTitle>{t('routePlanner.routeMap')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mapUrl ? (
                                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                    <iframe
                                        src={mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={t('routePlanner.routeMap')}
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full aspect-video bg-muted/50 rounded-lg">
                                    <RouteIcon className="h-12 w-12 text-muted-foreground mb-4"/>
                                    <p className="text-muted-foreground text-center">{t('routePlanner.noSelection')}</p>
                                </div>
                            )}
                            {selectedPlaces.length > 0 && (
                                <Button onClick={handleOpenInMaps} disabled={isMapLoading} className="mt-4 w-full" size="lg">
                                    {isMapLoading ? <Loader2 className="mr-2 animate-spin" /> : <Map className="mr-2"/>}
                                    {t('routePlanner.openInMaps')}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
