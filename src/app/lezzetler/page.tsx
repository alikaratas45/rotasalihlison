'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LezzetlerPage() {
  const { t } = useLanguage();

  const handleOpenRestaurants = () => {
    // Salihli'deki restoranları arayan Google Haritalar linki
    const searchQuery = encodeURIComponent("Salihli'deki Restaurantlar");
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('cuisine.description')}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow border-primary/20 bg-card overflow-hidden">
          <CardHeader className="text-center pt-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Utensils className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold">Salihli'deki Restaurantlar</CardTitle>
            <CardDescription className="mt-4 text-base max-w-md mx-auto">
                Salihli'nin meşhur lezzet duraklarını ve tüm restoranlarını Google Haritalar üzerinde keşfetmek için aşağıdaki butona tıklayın.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-10">
            <Button 
                size="lg" 
                className="w-full sm:w-auto px-12 gap-3 h-16 text-xl font-bold shadow-xl hover:scale-105 transition-transform" 
                onClick={handleOpenRestaurants}
            >
                <MapPin className="h-6 w-6 text-accent" />
                Haritada Gör
                <ExternalLink className="h-5 w-5 opacity-70" />
            </Button>
          </CardContent>
        </Card>
        
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/20 rounded-lg border border-primary/5 text-center italic text-sm text-muted-foreground">
                "Salihli'nin tescilli Odun Köftesi'ni denemeyi unutmayın."
            </div>
            <div className="p-4 bg-secondary/20 rounded-lg border border-primary/5 text-center italic text-sm text-muted-foreground">
                "Yerel pazarlardaki doğal ürünleri keşfedin."
            </div>
        </div>
      </div>
    </div>
  );
}
