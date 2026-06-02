'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Placeholders } from '@/lib/placeholder-images';
import { MapPinned, Bike, Footprints, ChevronRight } from 'lucide-react';
import { Suspense, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Route } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { routes as staticRoutes } from '@/lib/data/routes';
import { Button } from '@/components/ui/button';

function RotalarContent() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  const routesQuery = useMemo(() => query(collection(firestore, 'routes')), [firestore]);
  const { data: dbRoutes, loading } = useCollection<Route>(routesQuery);

  const thematicRoutes = useMemo(() => {
    // Hem veritabanındaki hem de kod içindeki tematik rotaları birleştir
    const allRoutes = [...(dbRoutes || []), ...staticRoutes];
    
    // Tekilleştir (ID'ye göre) ve sadece 'thematic' olanları al
    const uniqueThematic = Array.from(new Map(allRoutes.map(item => [item.id, item])).values())
      .filter(r => r.category === 'thematic');
      
    return uniqueThematic;
  }, [dbRoutes]);

  if (loading) {
      return (
          <div className="container mx-auto px-4 py-8 md:py-12">
              <div className="text-center mb-12">
                  <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden h-full">
                          <CardContent className="p-0 flex flex-col h-full">
                              <Skeleton className="h-64 w-full" />
                              <div className="p-6 flex flex-col flex-grow">
                                  <Skeleton className="h-8 w-3/4 mb-2" />
                                  <Skeleton className="h-4 w-full mb-4" />
                                  <Skeleton className="h-5 w-20 mt-auto" />
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('header.routes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('home.thematicRoutesSubtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* KATEGORİ KARTI: BİSİKLET ROTALARI */}
        <Link href="/bisiklet-rotalari" className="group">
          <Card className="overflow-hidden h-full transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl border-none ring-1 ring-orange-100 bg-white">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative h-64 w-full bg-orange-50">
                <Image
                  src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop"
                  alt="Bicycle Routes"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-3">
                    <Bike className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline">{t('bicycleRoutes.title')}</h3>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  Salihli ve çevresindeki en keyifli bisiklet parkurlarını keşfedin. GPS kayıtları ve eğim grafikleriyle pedallamaya hemen başlayın.
                </p>
                <div className="flex items-center text-orange-600 font-black text-xs uppercase tracking-widest mt-6">
                  Tüm Bisiklet Rotalarını Gör <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* KATEGORİ KARTI: YÜRÜYÜŞ ROTALARI */}
        <Link href="/yuruyus-rotalari" className="group">
          <Card className="overflow-hidden h-full transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl border-none ring-1 ring-primary/10 bg-white">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative h-64 w-full bg-primary/5">
                <Image
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop"
                  alt="Walking Routes"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-3">
                    <Footprints className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-headline">{t('hikingRoutes.title')}</h3>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  Kanyonlardan yaylalara uzanan muazzam yürüyüş yolları. Doğanın kalbine yapacağınız yolculuklar için size özel rotalar.
                </p>
                <div className="flex items-center text-primary font-black text-xs uppercase tracking-widest mt-6">
                  Tüm Yürüyüş Rotalarını Gör <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* TEMATİK ROTALAR LİSTESİ */}
        {thematicRoutes.map(route => {
            let imageId = '';
            const enSlug = route.slug.en || '';
            if (enSlug.includes('lydian')) imageId = 'gymnasium';
            else if (enSlug.includes('nature')) imageId = 'adala-volcanic-canyon';
            else imageId = route.id;

            const placeholder = Placeholders.find(p => p.id === imageId);
            return (
                <Link href={`/rotalar/${route.slug[typedLanguage] || route.slug.tr}`} key={route.id} className="group">
                <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl border-none ring-1 ring-slate-100 bg-white">
                    <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-64 w-full">
                        <Image
                        src={placeholder?.imageUrl || `https://picsum.photos/seed/${route.id}/600/400`}
                        alt={route.name[typedLanguage] || route.name.tr}
                        data-ai-hint={placeholder?.imageHint || 'route map'}
                        fill
                        className="object-cover"
                        sizes="400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                            <h3 className="text-2xl font-bold font-headline">{route.name[typedLanguage] || route.name.tr}</h3>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <p className="text-slate-500 line-clamp-3 text-sm leading-relaxed mb-6">{route.description[typedLanguage] || route.description.tr}</p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center text-xs text-primary font-black uppercase tracking-widest">
                                <MapPinned className="w-4 h-4 mr-2"/>
                                <span>{route.stops?.length || 0} Durak</span>
                            </div>
                            <Button variant="link" className="p-0 h-auto font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
                                Keşfet <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </Link>
        )})}
      </div>
    </div>
  );
}


export default function RotalarPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RotalarContent />
        </Suspense>
    )
}