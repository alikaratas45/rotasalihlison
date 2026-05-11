
'use client';

import { useLanguage } from '@/hooks/use-language';
import { useState, useRef, useMemo } from 'react';
import { PlacesMap } from '@/components/places-map';
import { Bike, Navigation, ChevronRight, MapPinned, Info, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Place } from '@/lib/definitions';
import type { Language } from '@/context/language-context';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BicycleRoute {
  id: string;
  key: string; // Translation key
  distance: string;
  kmlUrl: string;
  wikilocId?: string;
  poiIds: string[]; // Relational data structure: Place IDs
}

export default function BisikletRotalariPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const isMobile = useIsMobile();
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();

  // Fetch all places from Firestore
  const { data: allPlaces, loading: placesLoading } = useCollection<Place>(
    useMemo(() => query(collection(firestore, 'places')), [firestore])
  );
  
  const routes: BicycleRoute[] = [
    {
      id: 'lidya-yolu-1',
      key: 'lidya_yolu',
      distance: '28,50 km',
      kmlUrl: '/lidyayolu.kml',
      wikilocId: '40219098',
      poiIds: ['1', '12', '13'] // Sardes, Gymnasium, Artemis
    },
    {
      id: 'salihli-alasehir-1',
      key: 'salihli_alasehir',
      distance: '35,20 km',
      kmlUrl: '/salihli-alasehir.kml',
      wikilocId: '167004910',
      poiIds: ['11', '1', '3'] // Bintepeler, Sardes, Odun Köfte (Merkez)
    },
    {
      id: 'kursunlu-marmara-1',
      key: 'kursunlu_marmara',
      distance: '45,80 km',
      kmlUrl: '/kursunlu-marmara.kml',
      wikilocId: '35690357',
      poiIds: ['2', '11'] // Kurşunlu, Bintepeler
    },
    {
      id: 'kula-salihli-geopark-1',
      key: 'kula_salihli_geopark',
      distance: '52,40 km',
      kmlUrl: '/kula-salihli-geopark.kml',
      wikilocId: '75216382',
      poiIds: ['7'] // Adala Kanyonu
    }
  ];

  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  // Dynamic POI Filtering
  const routePois = useMemo(() => {
    if (!allPlaces || !activeRoute.poiIds) return [];
    return allPlaces.filter(place => activeRoute.poiIds.includes(place.id));
  }, [allPlaces, activeRoute.poiIds]);

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
    poi: 'POI' 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-500 rounded-full text-white shadow-lg">
            < Bike className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-900">
            {t('bicycleRoutes.title')}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Routes List Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2">
              {t('bicycleRoutes.availableRoutes')}
            </h2>
            
            <div className="grid gap-4">
              {routes.map((route) => (
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
                            {t(`bicycleRoutes.routes.${route.key}.name`)}
                        </h3>
                        {selectedRouteId === route.id && (
                             <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                {t('bicycleRoutes.selectedLabel')}
                            </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs mb-3 font-medium">
                        {t('bicycleRoutes.distanceLabel')} {route.distance}
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {t(`bicycleRoutes.routes.${route.key}.description`)}
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

          {/* Map Section */}
          <div className="space-y-6" ref={mapSectionRef}>
            <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              {t('bicycleRoutes.routeMap')}
            </h2>
            <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <PlacesMap 
                    places={routePois} 
                    className="w-full h-full" 
                    kmlUrl={activeRoute.kmlUrl}
                    key={activeRoute.id} 
                />
            </div>
            <p className="text-xs text-muted-foreground italic text-center">
              {t('bicycleRoutes.legendText', t(`bicycleRoutes.routes.${activeRoute.key}.name`))}
            </p>
          </div>
        </div>

        {/* POI SECTION: Rota Üzerindeki Görülecek Yerler */}
        <div className="mt-20">
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <MapPinned className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold font-headline text-slate-900">{t('bicycleRoutes.poisTitle')}</h2>
            </div>

            {placesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden border-none shadow-md">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full rounded-md" />
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

        {/* Wikiloc Detail Section */}
        {activeRoute.wikilocId && (
            <div className="mt-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-3 border-b pb-4">
                <h2 className="text-3xl font-bold font-headline text-slate-900">
                    {t('hikingRoutes.wikilocDetailTitle', t(`bicycleRoutes.routes.${activeRoute.key}.name`))}
                </h2>
                </div>

                <Card className="overflow-hidden border-none shadow-2xl rounded-2xl bg-white border border-slate-100">
                    <div className="w-full min-h-[500px]">
                        <iframe 
                            src={`https://tr.wikiloc.com/wikiloc/embedv2.do?id=${activeRoute.wikilocId}&elevation=on&images=on&maptype=H`} 
                            width="100%" 
                            height="500" 
                            frameBorder="0" 
                            scrolling="no"
                            title={`${t(`bicycleRoutes.routes.${activeRoute.key}.name`)} Wikiloc Detayı`}
                            className="w-full"
                        ></iframe>
                    </div>
                    <div className="px-6 py-4 bg-slate-50/50 border-t flex justify-between items-center">
                        <div className="text-slate-400 text-[11px] leading-relaxed">
                            Powered by <a href="https://tr.wikiloc.com" target="_blank" rel="noopener noreferrer" className="text-[#4C8C2B] font-bold hover:underline">Wikiloc</a>
                        </div>
                    </div>
                </Card>
            </div>
        )}
      </div>
    </div>
  );
}
