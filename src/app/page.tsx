
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ExperienceItem } from '@/lib/definitions';
import { useMemo } from 'react';
import { Placeholders } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from '@/components/icons/lucide-icon';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';


export default function Home() {
  const { t, language } = useLanguage();
  const heroImage = Placeholders.find(p => p.id === 'hero-main');
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  // Fetch dynamic data
  const experienceItemsQuery = useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore]);
  const { data: experienceItems, loading: experienceLoading } = useCollection<ExperienceItem>(experienceItemsQuery);

  const displayExperienceItems = useMemo(() => {
    if (experienceItems && experienceItems.length > 0) {
      // Sort items by order, as Firestore might not guarantee it in all edge cases
      return [...experienceItems].sort((a, b) => a.order - b.order);
    }
    // Sort static items as well
    return [...staticExperienceItems].sort((a,b) => a.order - b.order).map((item, index) => ({...item, id: `static-exp-${index}`}));
  }, [experienceItems]);
  

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline drop-shadow-lg">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow-md">
            {t('home.heroSubtitle')}
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/yerler">{t('home.getStarted')}</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-2">{t('home.experienceTitle')}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t('home.experienceSubtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {experienceLoading ? Array.from({length: 5}).map((_, i) => (
                <Card key={i} className="p-6 flex flex-col items-center justify-center aspect-square bg-secondary/50">
                    <Skeleton className="w-12 h-12 rounded-full mb-4" />
                    <Skeleton className="h-5 w-3/4" />
                </Card>
            )) : displayExperienceItems.map((item) => (
              <Link href={item.link} key={item.id} className="group">
                <Card className="p-6 flex flex-col items-center justify-center aspect-square bg-secondary/50 hover:bg-secondary transition-colors duration-300">
                  <LucideIcon name={item.icon} className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-semibold text-center">{item.name[typedLanguage]}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
