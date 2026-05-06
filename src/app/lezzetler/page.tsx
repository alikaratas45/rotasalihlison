'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import type { Language } from '@/context/language-context';

export default function LezzetlerPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;

  const handleOpenRestaurants = () => {
    // Salihli'deki restoranları arayan Google Haritalar linki
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
        {/* Salihli Odun Köftesi Ana Kartı */}
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center flex-1">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Utensils className="h-6 w-6" />
                  <span className="text-sm font-bold uppercase tracking-widest">Meşhur Lezzet</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4 group-hover:text-primary transition-colors">
                    {odunKofteTitle[typedLanguage] || odunKofteTitle.tr}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Salihli denince akla gelen ilk lezzet. Meşe odunu ateşinde pişen bu eşsiz köftenin tadına bakmadan dönmeyin. Detaylı bilgi ve hikayesi için tıklayın.
                </p>
                <div className="mt-auto text-base font-bold text-primary flex items-center">
                  {t('actions.seeDetails')}
                  <ChevronRight className="ml-1 h-5 w-5 transform transition-transform group-hover:translate-x-1"/>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        {/* Diğer Restaurantlar Kartı */}
        <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-secondary/5 overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Salihli'deki Tüm Restaurantlar</CardTitle>
            <CardDescription className="mt-2 text-base max-w-md mx-auto">
                Salihli'deki tüm lezzet duraklarını ve restaurantları Google Haritalar üzerinde keşfetmek için butona tıklayın.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-10">
            <Button 
                size="lg" 
                className="w-full sm:w-auto px-12 gap-3 h-14 text-lg font-bold shadow-md hover:scale-105 transition-transform" 
                onClick={handleOpenRestaurants}
            >
                Haritada Gör
                <ExternalLink className="h-4 w-4 opacity-70" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
