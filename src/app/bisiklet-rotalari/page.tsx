'use client';

import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';
import { PlacesMap } from '@/components/places-map';
import { Bike, Navigation } from 'lucide-react';
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
  
  const routes: BicycleRoute[] = [
    {
      id: 'lidya-yolu-1',
      name: 'Lidya Yolu Bisiklet Rotası',
      distance: '28,50 km',
      description: "Antik Lidya medeniyetinin izlerini takip eden, Sart Antik Kenti'nden başlayıp Bozdağlar'ın eteklerine uzanan tarih ve doğa dolu bir parkur.",
      kmlUrl: '/lidyayolu.kml',
      wikilocId: '40219098'
    }
  ];

  const [selectedRouteId] = useState<string>(routes[0].id);
  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

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
              Mevcut Rotalar
            </h2>
            
            <div className="grid gap-6">
              {routes.map((route, idx) => (
                <div 
                  key={route.id || `route-${idx}`} 
                  className="text-left"
                >
                  <Card className={cn(
                    "overflow-hidden border-none shadow-md transition-all duration-300 ring-2 ring-primary bg-white scale-[1.02]"
                  )}>
                    <CardContent className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold font-headline text-slate-900">
                            {route.name}
                        </h3>
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-wider">
                            Aktif Rota
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4 font-medium">
                        Mesafe: {route.distance}
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        {route.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
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
                <PlacesMap 
                    places={[]} 
                    className="w-full h-full" 
                    kmlUrl={activeRoute.kmlUrl}
                />
            </div>
            <p className="text-xs text-muted-foreground italic text-center">
              * Harita üzerinde koyu mavi çizgi ile gösterilen rota {activeRoute.name}'nı temsil eder.
            </p>
          </div>
        </div>

        {/* Wikiloc Detail Section */}
        <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center gap-3 border-b pb-4">
               <h2 className="text-3xl font-bold font-headline text-slate-900">
                 Wikiloc Rota Detayı
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
                        title={`${activeRoute.name} Wikiloc Detayı`}
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
      </div>
    </div>
  );
}
