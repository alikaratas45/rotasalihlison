'use client';

import { useLanguage } from '@/hooks/use-language';
import { BrochureViewer } from '@/components/brochure';
import { brochures } from '@/lib/data/brochures';
import { Suspense } from 'react';

function BrosurlerContent() {
  const { t, language } = useLanguage();
  const currentBrochure = brochures[0];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('brochures.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('brochures.description')}</p>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold font-headline mb-6">{currentBrochure.title[language]}</h2>
        <BrochureViewer brochure={currentBrochure} />
      </div>
    </div>
  );
}

export default function BrosurlerPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrosurlerContent />
        </Suspense>
    )
}
