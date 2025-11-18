'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Utensils } from 'lucide-react';

export default function LezzetlerPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `https://www.google.com/maps/search/?api=1&query=Salihli'deki+restoranlar`;
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <Utensils className="w-16 h-16 text-primary mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold font-headline mb-4">{t('cuisine.title')}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('cuisine.description')}</p>
    </div>
  );
}
