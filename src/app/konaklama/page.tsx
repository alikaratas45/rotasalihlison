'use client';

import { useLanguage } from '@/hooks/use-language';
import { Bed, MapPin, Phone, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function KonaklamaPage() {
  const { t } = useLanguage();

  const handleOpenMaps = () => {
    const searchQuery = encodeURIComponent("Salihli'deki Oteller");
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('accommodation.description', 'Salihli seyahatinizde konaklayabileceğiniz konforlu oteller ve tesisler.')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-primary/10 bg-card overflow-hidden">
            <CardHeader className="text-center pt-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline font-bold">Tüm Konaklama Tesisleri</CardTitle>
              <CardDescription className="mt-2 text-base max-w-md mx-auto">
                  Salihli merkezinde ve termal bölgelerde yer alan tüm otelleri harita üzerinde görüntüleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-10">
              <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-12 gap-3 h-14 text-lg font-bold shadow-md" 
                  onClick={handleOpenMaps}
              >
                  Otelleri Haritada Gör
                  <ExternalLink className="h-4 w-4 opacity-70" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
