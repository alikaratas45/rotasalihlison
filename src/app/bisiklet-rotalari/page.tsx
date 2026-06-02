'use client';

import { useLanguage } from '@/hooks/use-language';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Bike, ChevronRight, MapPinned, Info, Loader2, Map as MapIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Place, Route } from '@/lib/definitions';
import type { Language } from '@/context/language-context';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getKmlPoints, isPointNearRoute } from '@/lib/geo-utils';
import { PlacesMap } from '@/components/places-map';

export default function BisikletRotalariPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const isMobile = useIsMobile();
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();

  const { data: allPlaces, loading: placesLoading } = useCollection<Place>(
    useMemo(() => query(collection(firestore, 'places')), [firestore])
  );
  
  const { data: dbRoutes, loading: routesLoading } = useCollection<Route>(
    useMemo(() => query(collection(firestore, 'routes'), where('category', '==', 'bicycle')), [firestore])
  );

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routePois, setRoutePois] = useState<Place[]>([]);
  const [isProcessingPois, setIsProcessingPois] = useState(false);
  
  const activeRoute = useMemo(() => {
    if (!dbRoutes || dbRoutes.length === 0) return null;
    return dbRoutes.find(r => r.id === selectedRouteId) || dbRoutes[0];
  }, [selectedRouteId, dbRoutes]);

  useEffect(() => {
    if (dbRoutes && dbRoutes.length > 0 && !selectedRouteId) {
        setSelectedRouteId(dbRoutes[0].id);
    }
  }, [dbRoutes, selectedRouteId]);

  useEffect(() => {
    let isMounted = true;
    async function updatePois() {
      if (!allPlaces || !activeRoute) return;
      setIsProcessingPois(true);
      
      try {
        const explicitStops = (activeRoute.stops || [])
          .map(id => allPlaces.find(p => String(p.id) === String(id)))
          .filter(Boolean) as Place[];
        
        if (activeRoute.kmlUrl) {
          const kmlPoints = await getKmlPoints(activeRoute.kmlUrl);
          if (!isMounted) return;

          const nearby = allPlaces.filter(place => {
            if (activeRoute.stops?.includes(place.id)) return false;
            return isPointNearRoute(place.coordinates, kmlPoints, 500);
          });
          
          setRoutePois([...explicitStops, ...nearby]);
        } else {
          setRoutePois(explicitStops);
        }
      } catch (err) {
        console.error("POI filtering error:", err);
      } finally {
        if (isMounted) setIsProcessingPois(false);
      }
    }
    
    updatePois();
    return () => { isMounted = false; };
  }, [activeRoute, allPlaces]);

  const handleRouteClick = (id: string) => {
    setSelectedRouteId(id);
    if (isMobile) {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const categoryLabels: Record<string, string> = { 
    history: t('history.title'), 
    nature: t('nature.title'), 
    food: t('header.cuisine'), 
    shopping: t('shopping.title'), 
    poi: 'POI',
    accommodation: t('accommodation.title')
  };

  if (routesLoading) return (
    <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="font-bold text-muted-foreground">Rotalar Yükleniyor...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-500 rounded-full text-white shadow-lg">
            < Bike className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-900">
            {t('bicycleRoutes.title')}
          </h1>
        </div>

        {dbRoutes && dbRoutes.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-10 mb-12">
            <div className="space-y-8">
                <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2">
                {t('bicycleRoutes.availableRoutes')}
                </h2>
                
                <div className="grid gap-4">
                {dbRoutes.map((route) => (
                    <button 
                    key={route.id} 
                    onClick={() => handleRouteClick(route.id)}
                    className="text-left w-full transition-transform active:scale-95"
                    >
                    <Card className={cn(
                        "overflow-hidden border-2 transition-all duration-300 bg-white",
                        selectedRouteId === route.id 
                        ? "border-primary shadow-lg ring-1 ring-primary/20 bg-primary/5" 
                        : "border-transparent shadow-sm hover:border-slate-200"
                    )}>
                        <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={cn(
                                "text-xl font-bold font-headline",
                                selectedRouteId === route.id ? "text-primary" : "text-slate-900"
                            )}>
                                {route.name[typedLanguage] || route.name.tr}
                            </h3>
                            {selectedRouteId === route.id && (
                                <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                    {t('bicycleRoutes.selectedLabel')}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-xs mb-3 font-medium">
                            {t('bicycleRoutes.distanceLabel')} {route.distance || 'Bilinmiyor'}
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                            {route.description[typedLanguage] || route.description.tr}
                        </p>
                        <div className={cn(
                            "mt-3 flex items-center text-xs font-bold uppercase tracking-widest transition-colors",
                            selectedRouteId === route.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                        )}>
                            {t('bicycleRoutes.viewOnMapLabel')} <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                        </CardContent>
                    </Card>
                    </button>
                ))}
                </div>
            </div>

            <div className="space-y-6" ref={mapSectionRef}>
                <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2 flex items-center gap-2">
                    <MapIcon className="h-5 w-5 text-primary" />
                    {t('bicycleRoutes.routeMap')}
                </h2>
                
                <Card className="overflow-hidden border-none shadow-xl rounded-2xl bg-white border border-slate-100 h-[500px] lg:h-[600px]">
                    <div className="w-full h-full relative">
                        {activeRoute && (
                          activeRoute.kmlUrl ? (
                            <PlacesMap 
                                key={`map-${activeRoute.id}`}
                                places={routePois} 
                                kmlUrl={activeRoute.kmlUrl} 
                                isRoute={true} 
                                className="w-full h-full"
                            />
                          ) : activeRoute.wikilocEmbedHtml ? (
                            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: activeRoute.wikilocEmbedHtml.replace('width="500"', 'width="100%"').replace('height="400"', 'height="100%"') }} />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-slate-50">
                                <MapPinned className="h-12 w-12 text-slate-300 mb-4" />
                                <p className="text-slate-500 font-bold">Harita verisi (KML veya Wikiloc) bulunamadı.</p>
                                <Button className="mt-4" onClick={() => window.open(`https://www.wikiloc.com/wikiloc/find.do?q=${activeRoute.name.tr}`, '_blank')}>
                                    Wikiloc'ta Ara
                                </Button>
                            </div>
                          )
                        )}
                    </div>
                </Card>
            </div>
            </div>
        ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                <Bike className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold">Henüz bisiklet rotası eklenmemiş.</p>
            </div>
        )}

        {activeRoute && (
            <div className="mt-20">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <MapPinned className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold font-headline text-slate-900">{t('bicycleRoutes.poisTitle')}</h2>
                </div>

                {isProcessingPois ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden border-none shadow-md">
                                <Skeleton className="h-48 w-full" />
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : routePois.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {routePois.map((place) => (
                            <Card key={place.id} className="group overflow-hidden transition-all duration-300 hover:shadow-2xl border-none bg-white">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={place.imageUrl || `https://picsum.photos/seed/${place.id}/600/400`}
                                        alt={place.name[typedLanguage] || place.name.tr}
                                        data-ai-hint={place.imageHint || 'landmark'}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="400px"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 text-primary hover:bg-white font-bold backdrop-blur-sm border-none shadow-sm">
                                            {categoryLabels[place.category]}
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
                                    <Button asChild className="w-full font-bold h-11" variant="outline">
                                        <Link href={`/yerler/${place.slug[typedLanguage]}`}>
                                            <Info className="mr-2 h-4 w-4" />
                                            {t('actions.seeDetails')}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <Info className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">{t('bicycleRoutes.noPoisFound')}</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}