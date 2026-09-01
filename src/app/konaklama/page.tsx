
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Bed, MapPin, ExternalLink, ArrowLeft, Thermometer, Navigation, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Place } from '@/lib/definitions';

export default function KonaklamaPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch all places to filter dynamically
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: allPlaces, loading } = useCollection<Place>(placesQuery);

  const hotels = useMemo(() => {
    if (!allPlaces) return [];
    return allPlaces
      .filter(p => p.category === 'accommodation')
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }, [allPlaces]);

  // Featured logic: Pick the first available hotel or one with specific high order
  const featuredHotel = useMemo(() => {
    if (!hotels || hotels.length === 0) return null;
    return hotels[0];
  }, [hotels]);

  const otherHotels = useMemo(() => {
    if (!featuredHotel) return hotels;
    return hotels.filter(h => h.id !== featuredHotel?.id);
  }, [hotels, featuredHotel]);

  const handleOpenMaps = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Oteller ve Konaklama");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mb-8">
            <Button asChild variant="ghost" size="sm">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t('header.home')}
                </Link>
            </Button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Bed className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-slate-900 mb-4">
            {t('accommodation.title', 'Konaklama')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            {t('accommodation.description', 'Salihli seyahatinizde konaklayabileceğiniz konforlu oteller ve tesisler.')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
          
          {/* ÖNE ÇIKAN TESİS */}
          {loading ? (
            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
          ) : featuredHotel ? (
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                    <Thermometer className="text-primary h-6 w-6" />
                    <h2 className="text-2xl font-black font-headline">Öne Çıkan Tesis</h2>
                </div>
                <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-black/5">
                    <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-auto overflow-hidden">
                            <Image 
                            src={featuredHotel.imageUrl || "https://picsum.photos/seed/hotel-featured/800/600"} 
                            alt={featuredHotel.name[typedLanguage]} 
                            fill 
                            className="object-cover transition-transform duration-700 hover:scale-110"
                            data-ai-hint="hotel landscape"
                            sizes="600px"
                            />
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center bg-primary/5">
                            <div className="flex items-center gap-2 text-primary mb-4">
                                <span className="font-black text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-lg">Konaklama & Konfor</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black font-headline text-slate-900 mb-6 leading-tight">
                                {featuredHotel.name[typedLanguage]}
                            </h2>
                            <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 line-clamp-4">
                                {featuredHotel.description[typedLanguage]}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="rounded-2xl h-14 font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] flex-1">
                                    <Link href={`/yerler/${featuredHotel.slug[typedLanguage]}`}>
                                        <Info className="mr-2 h-5 w-5" />
                                        Detayları İncele
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="rounded-2xl h-14 font-black text-base bg-white border-primary/20 text-primary shadow-sm hover:bg-primary/5 flex-1" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${featuredHotel.coordinates.lat},${featuredHotel.coordinates.lng}`, '_blank')}>
                                    <Navigation className="mr-2 h-5 w-5" />
                                    Yol Tarifi Al
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
          ) : null}

          {/* DİĞER KONAKLAMA İŞLETMELERİ */}
          <div className="space-y-8">
             <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-3xl font-black font-headline text-slate-800">
                    {featuredHotel ? 'Diğer İşletmeler' : 'Konaklama İşletmeleri'}
                </h2>
                {loading ? <Skeleton className="h-6 w-20" /> : <Badge variant="secondary" className="font-black text-sm uppercase px-4 py-1">{otherHotels.length} Tesis</Badge>}
             </div>

             {loading ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-[2rem]" />)}
                </div>
             ) : otherHotels.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {otherHotels.map((hotel) => (
                        <Link href={`/yerler/${hotel.slug[typedLanguage]}`} key={hotel.id} className="group">
                            <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl border-none ring-1 ring-black/5 rounded-[2rem] bg-white">
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={hotel.imageUrl || `https://picsum.photos/seed/${hotel.id}/600/400`}
                                        alt={hotel.name[typedLanguage]} 
                                        data-ai-hint="hotel architecture" 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="500px"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-8 right-8">
                                        <h3 className="text-2xl font-black font-headline text-white drop-shadow-md">{hotel.name[typedLanguage]}</h3>
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-8 font-medium">
                                        {hotel.description[typedLanguage]}
                                    </p>
                                    <div className="text-sm font-black text-primary flex items-center uppercase tracking-widest group-hover:gap-2 transition-all">
                                        Detayları İncele
                                        <ChevronRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"/>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
             ) : (
                !loading && !featuredHotel && (
                    <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-primary/10">
                        <Bed className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold text-lg">Henüz konaklama işletmesi eklenmemiş.</p>
                        <p className="text-slate-400 text-sm mt-2">Admin panelinden 'Konaklama' kategorisinde yeni yerler ekleyebilirsiniz.</p>
                    </div>
                )
             )}
          </div>

          {/* HARİTA BUTONU */}
          <Card className="hover:shadow-2xl transition-all duration-500 bg-primary rounded-[3rem] overflow-hidden group border-none text-white shadow-xl shadow-primary/20">
            <CardHeader className="text-center pt-16">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 shadow-2xl">
                  <MapPin className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-headline font-black tracking-tight">Tüm Konaklama Tesisleri</CardTitle>
              <CardDescription className="mt-4 text-xl max-w-lg mx-auto font-medium text-primary-foreground/80 leading-relaxed">
                  Salihli merkezinde ve çevresinde yer alan tüm otel, pansiyon ve misafirhaneleri harita üzerinde keşfedin.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-16 pt-8">
              <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-20 gap-4 h-20 text-2xl font-black rounded-3xl shadow-2xl hover:scale-105 transition-all bg-white text-primary hover:bg-slate-50 border-none" 
                  onClick={handleOpenMaps}
              >
                  Haritada Gör
                  <ExternalLink className="h-6 w-6 opacity-70" />
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
