"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ExperienceItem } from '@/lib/definitions';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from '@/components/icons/lucide-icon';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Info } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  const { data: experienceItems, loading: experienceLoading } = useCollection<ExperienceItem>(query(collection(firestore, 'experience-items'), orderBy('order')));

  const displayExperienceItems = useMemo(() => {
    if (experienceItems && experienceItems.length > 0) return [...experienceItems].sort((a, b) => a.order - b.order);
    return [...staticExperienceItems].sort((a,b) => a.order - b.order).map((item, index) => ({...item, id: `static-exp-${index}`}));
  }, [experienceItems]);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full text-white">
        <Image src="https://i.imgur.com/2deYxHC.png" alt="Sardes Salihli" data-ai-hint="ancient ruins" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline drop-shadow-lg animate-in fade-in slide-in-from-top-4 duration-1000">{t('home.heroTitle')}</h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-1000">{t('home.heroSubtitle')}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link href="/yerler">{t('home.getStarted')}</Link></Button>
            <Dialog>
              <DialogTrigger asChild><Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"><Info className="mr-2 h-5 w-5" />{t('home.aboutSalihli')}</Button></DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="text-2xl font-headline font-bold text-primary">{t('about.title')}</DialogTitle></DialogHeader>
                <div className="py-4 space-y-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-line text-lg text-justify">{t('about.content')}</p>
                </div>
                <DialogFooter><Button variant="secondary" onClick={() => (document.querySelector('[data-state="open"]') as any)?.click()}>{t('actions.close')}</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-2">{t('home.experienceTitle')}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">{t('home.experienceSubtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {experienceLoading ? Array.from({length: 6}).map((_, i) => (
                <Card key={i} className="p-6 flex flex-col items-center justify-center aspect-square bg-secondary/50 h-full">
                    <Skeleton className="w-12 h-12 rounded-full mb-4" />
                    <Skeleton className="h-5 w-3/4" />
                </Card>
            )) : displayExperienceItems.map((item) => (
              <Link href={item.link} key={item.id} className="group h-full">
                <Card className="p-6 flex flex-col items-center justify-center aspect-square bg-secondary/50 hover:bg-secondary transition-all duration-300 h-full transform hover:scale-105 hover:shadow-md border-primary/10">
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