'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin, ExternalLink, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Place } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';

export default function LezzetlerPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch all places to filter dynamically
  const placesQuery = useMemo(() => query(collection(firestore, 'places')), [firestore]);
  const { data: allPlaces, loading } = useCollection<Place>(placesQuery);

  const foodPlaces = useMemo(() => {
    if (!allPlaces) return [];
    return allPlaces
      .filter(p => p.category === 'food')
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }, [allPlaces]);

  // Odun Köfte usually has ID '3' in seed data
  const featuredPlace = useMemo(() => {
    if (!allPlaces) return null;
    return allPlaces.find(p => p.id === '3' || p.name.tr.includes('Odun Köfte')) || null;
  }, [allPlaces]);

  const otherFoodPlaces = useMemo(() => {
    return foodPlaces.filter(p => p.id !== featuredPlace?.id);
  }, [foodPlaces, featuredPlace]);

  const handleOpenRestaurants = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Restoranlar ve Lokantalar");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6">
                <Utensils className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-slate-900 mb-4">{t('cuisine.title')}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium">{t('cuisine.description')}</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-20">
            {/* ÖNE ÇIKAN: SALİHLİ ODUN KÖFTE */}
            {loading ? (
                <Skeleton className="h-[450px] w-full rounded-[2.5rem]" />
            ) : featuredPlace ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <Utensils className="text-orange-600 h-6 w-6" />
                        <h2 className="text-2xl font-black font-headline">Coğrafi İşaretli Lezzet</h2>
                    </div>
                    <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white ring-1 ring-black/5">
                        <div className="flex flex-col md:flex-row">
                            <div className="relative h-64 md:h-auto md:w-1/2 shrink-0 overflow-hidden">
                                <Image 
                                src={featuredPlace.imageUrl || "https://i.imgur.com/IT6VuDV.jpeg"} 
                                alt={featuredPlace.name[typedLanguage]} 
                                fill 
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                data-ai-hint="delicious grilled meatballs"
                                sizes="600px"
                                />
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border-none shadow-lg">
                                        Meşhur Lezzet
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center flex-1 bg-orange-50/30">
                                <h2 className="text-3xl md:text-5xl font-headline font-black text-slate-900 mb-6 leading-tight">
                                    {featuredPlace.name[typedLanguage]}
                                </h2>
                                <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium line-clamp-5">
                                    {featuredPlace.description[typedLanguage]}
                                </p>
                                <div className="mt-auto">
                                    <Button asChild size="lg" className="rounded-2xl h-14 px-10 font-black text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/20 transition-all hover:scale-[1.02]">
                                        <Link href={`/yerler/${featuredPlace.slug[typedLanguage]}`}>
                                            {t('actions.seeDetails')}
                                            <ChevronRight className="ml-2 h-5 w-5"/>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : null}

            {/* DİĞER LEZZET DURAKLARI */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-3xl font-black font-headline text-slate-800">
                        {featuredPlace ? 'Lezzet Durakları' : 'Tüm Lezzetler'}
                    </h2>
                    {loading ? <Skeleton className="h-6 w-20" /> : <Badge variant="secondary" className="font-black text-sm uppercase px-4 py-1">{otherFoodPlaces.length} Mekan</Badge>}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
                    </div>
                ) : otherFoodPlaces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {otherFoodPlaces.map((food) => (
                            <Link href={`/yerler/${food.slug[typedLanguage]}`} key={food.id} className="group">
                                <Card className="flex gap-6 p-6 items-center hover:shadow-2xl transition-all duration-500 rounded-[2rem] border-none ring-1 ring-black/5 bg-white group-hover:-translate-y-1">
                                    <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-muted">
                                        <Image
                                            src={food.imageUrl || `https://picsum.photos/seed/${food.id}/200/200`}
                                            alt={food.name[typedLanguage]}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="150px"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-xl truncate text-slate-800 group-hover:text-orange-600 transition-colors mb-1">{food.name[typedLanguage]}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed mb-4">{food.description[typedLanguage]}</p>
                                        <div className="text-xs font-black text-orange-600 uppercase tracking-widest flex items-center">
                                            İncele <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    !loading && !featuredPlace && (
                        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-orange-200">
                            <Utensils className="h-12 w-12 text-orange-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold text-lg">Henüz lezzet durağı eklenmemiş.</p>
                            <p className="text-slate-400 text-sm mt-2">Admin panelinden 'Lezzet' kategorisinde yeni yerler ekleyebilirsiniz.</p>
                        </div>
                    )
                )}
            </div>

            {/* HARİTA BUTONU */}
            <Card className="hover:shadow-2xl transition-all duration-500 bg-orange-600 rounded-[3rem] overflow-hidden group border-none text-white shadow-xl shadow-orange-600/20">
                <CardHeader className="text-center pt-16">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-xl transition-transform duration-500 group-hover:scale-110 shadow-2xl">
                        <MapPin className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-4xl font-headline font-black tracking-tight">{t('cuisine.allRestaurantsTitle')}</CardTitle>
                    <CardDescription className="mt-4 text-xl max-w-lg mx-auto font-medium text-orange-100 leading-relaxed">
                        Salihli genelindeki tüm tescilli restoranları ve yerel lezzet noktalarını harita üzerinde görüntüleyin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-16 pt-8">
                    <Button 
                        size="lg" 
                        className="w-full sm:w-auto px-20 gap-4 h-20 text-2xl font-black rounded-3xl shadow-2xl hover:scale-105 transition-all bg-white text-orange-600 hover:bg-orange-50 border-none" 
                        onClick={handleOpenRestaurants}
                    >
                        {t('cuisine.viewOnMap')}
                        <ExternalLink className="h-6 w-6 opacity-70" />
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
