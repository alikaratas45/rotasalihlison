'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Place } from '@/lib/definitions';

export default function LezzetlerPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch food category places from Firestore
  const foodQuery = useMemo(() => 
    query(collection(firestore, 'places'), where('category', '==', 'food')), 
    [firestore]
  );
  const { data: foodPlacesRaw, loading } = useCollection<Place>(foodQuery);

  const foodPlaces = useMemo(() => {
    if (!foodPlacesRaw) return [];
    return [...foodPlacesRaw].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }, [foodPlacesRaw]);

  // Identify the featured place (Odun Kofte has ID '3' in seed data)
  const famousPlace = useMemo(() => {
    return foodPlaces.find(p => p.id === '3') || null;
  }, [foodPlaces]);

  // List of food places excluding the featured one
  const otherFoodPlaces = useMemo(() => {
    return foodPlaces.filter(p => p.id !== '3');
  }, [foodPlaces]);

  const handleOpenRestaurants = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Restaurantlar");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('cuisine.description')}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* DYNAMIC FAMOUS FLAVOR SECTION */}
        {loading ? (
            <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        ) : famousPlace ? (
            <Link href={`/yerler/${famousPlace.slug[typedLanguage]}`} className="block group">
                <Card className="overflow-hidden border-primary/20 bg-card transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.01] rounded-[2.5rem]">
                    <div className="flex flex-col md:flex-row">
                    <div className="relative h-64 md:h-auto md:w-1/2 shrink-0">
                        <Image 
                        src={famousPlace.imageUrl || "https://i.imgur.com/IT6VuDV.jpeg"} 
                        alt={famousPlace.name[typedLanguage]} 
                        fill 
                        className="object-cover"
                        data-ai-hint="grilled meatballs"
                        sizes="500px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                        <div className="flex items-center gap-2 text-primary mb-3">
                        <Utensils className="h-6 w-6" />
                        <span className="text-sm font-bold uppercase tracking-widest">{t('cuisine.famousTitle')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">
                            {famousPlace.name[typedLanguage]}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            {famousPlace.description[typedLanguage].substring(0, 250)}...
                        </p>
                        <div className="mt-auto text-base font-bold text-primary flex items-center">
                        {t('actions.seeDetails')}
                        <ChevronRight className="ml-1 h-5 w-5 transform transition-transform group-hover:translate-x-1"/>
                        </div>
                    </div>
                    </div>
                </Card>
            </Link>
        ) : null}

        {/* DYNAMIC FLAVOR STOPS LIST */}
        <div className="space-y-6 pt-10">
            <h2 className="text-2xl font-black font-headline border-b pb-4">
                {famousPlace ? 'Diğer Lezzet Durakları' : 'Lezzet Durakları'}
            </h2>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
                </div>
            ) : otherFoodPlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {otherFoodPlaces.map((food) => (
                        <Link href={`/yerler/${food.slug[typedLanguage]}`} key={food.id} className="group">
                            <Card className="flex gap-4 p-4 items-center hover:shadow-lg transition-all rounded-2xl border-primary/5 group-hover:border-primary/20 bg-white">
                                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden">
                                    <Image
                                        src={food.imageUrl || `https://picsum.photos/seed/${food.id}/200/200`}
                                        alt={food.name[typedLanguage]}
                                        fill
                                        className="object-cover"
                                        sizes="100px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{food.name[typedLanguage]}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{food.description[typedLanguage]}</p>
                                    <div className="mt-2 text-xs font-black text-primary uppercase tracking-tighter flex items-center">
                                        İncele <ChevronRight className="h-3 w-3 ml-0.5" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                !loading && !famousPlace && (
                    <p className="text-center py-10 text-muted-foreground italic bg-muted/20 rounded-2xl border-2 border-dashed">
                        Henüz lezzet durağı eklenmemiş.
                    </p>
                )
            )}
        </div>

        <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-secondary/5 overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center pt-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">{t('cuisine.allRestaurantsTitle')}</CardTitle>
            <CardDescription className="mt-2 text-base max-w-md mx-auto">
                {t('cuisine.allRestaurantsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-10">
            <Button 
                size="lg" 
                className="w-full sm:w-auto px-12 gap-3 h-14 text-lg font-bold shadow-md hover:scale-105 transition-transform rounded-xl" 
                onClick={handleOpenRestaurants}
            >
                {t('cuisine.viewOnMap')}
                <ExternalLink className="h-4 w-4 opacity-70" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
