
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Place } from '@/lib/definitions';

export default function LezzetlerPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch food category places from Firestore
  const foodQuery = useMemo(() => 
    query(collection(firestore, 'places'), where('category', '==', 'food'), orderBy('order')), 
    [firestore]
  );
  const { data: foodPlaces, loading } = useCollection<Place>(foodQuery);

  const handleOpenRestaurants = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Restaurantlar");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const odunKofteSlug: Record<string, string> = {
    tr: 'salihli-odun-kofte',
    en: 'salihli-wood-meatballs',
    fr: 'boulettes-de-viande-au-feu-de-bois-de-salihli',
    de: 'salihli-holzfleischballchen',
    ja: 'salihli-wood-meatballs-ja'
  };

  const odunKofteTitle: Record<string, string> = {
    tr: 'Salihli Odun Köftesi',
    en: 'Salihli Wood Meatballs',
    fr: 'Boulettes de Viande au Feu de Bois',
    de: 'Salihli Holz-Meatballs',
    ja: 'サリフリ・ウッドミートボール'
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('cuisine.description')}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* SABİT MEŞHUR LEZZET TANITIMI */}
        <Link href={`/yerler/${odunKofteSlug[typedLanguage] || odunKofteSlug.tr}`} className="block group">
          <Card className="overflow-hidden border-primary/20 bg-card transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-64 md:h-auto md:w-1/2 shrink-0">
                <Image 
                  src="https://i.imgur.com/IT6VuDV.jpeg" 
                  alt="Salihli Odun Köftesi" 
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
                    {odunKofteTitle[typedLanguage] || odunKofteTitle.tr}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t('cuisine.kofteDescription')}
                </p>
                <div className="mt-auto text-base font-bold text-primary flex items-center">
                  {t('actions.seeDetails')}
                  <ChevronRight className="ml-1 h-5 w-5 transform transition-transform group-hover:translate-x-1"/>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* DİNAMİK LEZZET DURAKLARI LİSTESİ */}
        <div className="space-y-6 pt-10">
            <h2 className="text-2xl font-black font-headline border-b pb-4">Diğer Lezzet Durakları</h2>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
                </div>
            ) : foodPlaces && foodPlaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {foodPlaces.filter(f => f.id !== '3').map((food) => (
                        <Link href={`/yerler/${food.slug[typedLanguage]}`} key={food.id} className="group">
                            <Card className="flex gap-4 p-4 items-center hover:shadow-lg transition-all rounded-2xl border-primary/5 group-hover:border-primary/20">
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
            ) : null}
        </div>

        <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-secondary/5 overflow-hidden">
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
                className="w-full sm:w-auto px-12 gap-3 h-14 text-lg font-bold shadow-md hover:scale-105 transition-transform" 
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
