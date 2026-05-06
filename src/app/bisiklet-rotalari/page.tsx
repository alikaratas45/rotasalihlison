
'use client';

import { useLanguage } from '@/hooks/use-language';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import type { Place } from '@/lib/definitions';
import { PlacesMap } from '@/components/places-map';
import { Skeleton } from '@/components/ui/skeleton';
import { Bike, MapPin, Navigation, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BicycleRoute {
  id: string;
  name: string;
  distance: string;
  description: string;
  kmlUrl: string;
  wikilocId?: string;
}

export default function BisikletRotalariPage() {
  const { t } = useLanguage();
  const firestore = useFirestore();
  const [selectedRouteId, setSelectedRouteId] = useState<string>('kursunlu-1');

  const routes: BicycleRoute[] = [
    {
      id: 'kursunlu-1',
      name: 'Kurşunlu Bisiklet Rotası',
      distance: '12,40 km',
      description: "Kurşunlu Kaplıcaları'nın eşsiz doğasında, vadi boyunca uzanan ve şifalı suların serinliğini hissedeceğiniz keyifli bir parkur.",
      kmlUrl: '/kursunlu.kml',
      wikilocId: '18987456' // Örnek ID - Gerçek ID ile güncellenebilir
    },
    {
      id: 'adala-1',
      name: 'Adala Kanyon Parkuru',
      distance: '8,36 km',
      description: "Volkanik kanyonun devasa kayaları arasında, Gediz Nehri'ne eşlik eden heyecan verici bir sürüş deneyimi.",
      kmlUrl: '',
      wikilocId: '21098432' // Örnek ID
    }
  ];

  // Bisiklet rotaları için doğa mekanlarını haritada işaretçi olarak gösterelim
  const natureQuery = useMemo(() => query(collection(firestore, 'places'), where('category', '==', 'nature')), [firestore]);
  const { data: places, loading } = useCollection<Place>(natureQuery);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-red-500 rounded-full text-white shadow-lg">
            <Bike className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-slate-900">
            {t('bicycleRoutes.title')}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Routes List Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2">
              Rotalar
            </h2>
            
            <div className="grid gap-6">
              {routes.map((route) => (
                <button 
                  key={route.id} 
                  onClick={() => setSelectedRouteId(route.id)}
                  className="text-left focus:outline-none transition-transform active:scale-[0.98]"
                >
                  <Card className={cn(
                    "overflow-hidden border-none shadow-sm transition-all duration-300",
                    selectedRouteId === route.id ? "ring-2 ring-primary bg-white shadow-md" : "hover:shadow-md bg-white/80"
                  )}>
                    <CardContent className="p-6 md:p-8">
                      <h3 className="text-2xl font-bold font-headline text-slate-900 mb-1">
                        {route.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 font-medium">
                        {route.distance}
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        {route.description}
                      </p>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline text-slate-800 border-b pb-2 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Rota Haritası
            </h2>
            <div className="w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
              {loading ? (
                  <Skeleton className="w-full h-full" />
              ) : (
                  <PlacesMap 
                    places={places || []} 
                    className="w-full h-full" 
                    kmlUrl={activeRoute.kmlUrl}
                  />
              )}
            </div>
            <p className="text-sm text-muted-foreground italic text-center">
              * Harita üzerinde mavi çizgi ile gösterilen rota {activeRoute.name}'nı temsil eder.
            </p>
          </div>
        </div>

        {/* Wikiloc Detail Section */}
        {activeRoute && (
          <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center gap-3 border-b pb-4">
               <h2 className="text-3xl font-bold font-headline text-slate-900">
                 Wikiloc Rota Detayı
               </h2>
             </div>

             <Card className="overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
                <div className="w-full aspect-video md:aspect-[21/9] min-h-[500px]">
                  {activeRoute.wikilocId ? (
                    <iframe 
                      src={`https://www.wikiloc.com/wikiloc/embed.do?id=${activeRoute.wikilocId}&tile_map=1&map_type=h`} 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no"
                      title={`${activeRoute.name} Wikiloc Detayı`}
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center text-muted-foreground bg-slate-50">
                       <Info className="h-12 w-12 mb-4 opacity-20" />
                       <p className="text-lg italic">Bu rota için Wikiloc entegrasyonu henüz aktif edilmemiştir.</p>
                    </div>
                  )}
                </div>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
