'use client';

import { brochures } from '@/lib/data/brochures';
import { BrochureViewer } from '@/components/brochure';
import { useLanguage } from '@/hooks/use-language';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Language } from '@/context/language-context';

export default function BrosurlerPage() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;

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
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-slate-900 mb-4">
            {t('brochures.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('brochures.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-20">
          {brochures.map((brochure) => (
            <div key={brochure.id} className="space-y-8">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary text-center">
                    {brochure.title[typedLanguage]}
                </h2>
                <div className="w-12 h-1 bg-accent rounded-full" />
              </div>
              <BrochureViewer brochure={brochure} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
