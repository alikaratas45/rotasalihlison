'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/lib/data/routes';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { Placeholders } from '@/lib/placeholder-images';
import { MapPinned } from 'lucide-react';
import { Suspense } from 'react';

function RotalarContent() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline mb-4">{t('header.routes')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t('home.thematicRoutesSubtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {routes.map(route => {
            const placeholder = Placeholders.find(p => p.id === route.slug.en);
            return (
                <Link href={`/rotalar/${route.slug[typedLanguage]}`} key={route.id} className="group">
                <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-64 w-full">
                        <Image
                        src={placeholder?.imageUrl || `https://picsum.photos/seed/${route.id}/600/400`}
                        alt={route.name[typedLanguage]}
                        data-ai-hint={placeholder?.imageHint || 'route map'}
                        fill
                        className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold font-headline mb-2">{route.name[typedLanguage]}</h3>
                        <p className="text-muted-foreground flex-grow text-sm">{route.description[typedLanguage]}</p>
                        <div className="flex items-center text-sm text-primary font-semibold mt-4">
                            <MapPinned className="w-4 h-4 mr-2"/>
                            <span>{route.stops.length} {t('home.stops', {count: route.stops.length})}</span>
                        </div>
                    </div>
                    </CardContent>
                </Card>
                </Link>
        )})}
      </div>
    </div>
  );
}


export default function RotalarPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RotalarContent />
        </Suspense>
    )
}
