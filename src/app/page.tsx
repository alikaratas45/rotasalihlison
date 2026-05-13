"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { ExperienceItem } from '@/lib/definitions';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from '@/components/icons/lucide-icon';
import { experienceItems as staticExperienceItems } from '@/lib/data/experience-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Info, MessageSquare, ChevronRight, Compass } from 'lucide-react';
import { FeedbackSystem } from '@/components/feedback-system';
import { PwaInstallButton } from '@/components/pwa-install-button';
import { cn } from '@/lib/utils';

export default function Home() {
  const { t, language } = useLanguage();
  const typedLanguage = language as Language;
  const firestore = useFirestore();

  const { data: experienceItems, loading: experienceLoading } = useCollection<ExperienceItem>(
    useMemo(() => query(collection(firestore, 'experience-items'), orderBy('order')), [firestore])
  );
  const { data: aboutSettings } = useDoc<any>(
    useMemo(() => doc(firestore, 'settings', 'about'), [firestore])
  );

  const aboutTitle = useMemo(() => {
    return aboutSettings?.aboutTitle?.[typedLanguage] || t('about.title');
  }, [aboutSettings, typedLanguage, t]);

  const aboutContent = useMemo(() => {
    return aboutSettings?.aboutContent?.[typedLanguage] || t('about.content');
  }, [aboutSettings, typedLanguage, t]);

  const displayExperienceItems = useMemo(() => {
    const rawItems = (experienceItems && experienceItems.length > 0) 
      ? experienceItems 
      : staticExperienceItems.map((item, index) => ({ ...item, id: `static-exp-${index}` }));

    const uniqueMap = new Map();
    rawItems.forEach(item => {
        if (item.link !== '/install') {
            uniqueMap.set(item.link, item);
        }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
  }, [experienceItems]);

  return (
    <div className="flex flex-col">
      {/* --- HERO SECTION: MORE DRAMATIC --- */}
      <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden">
        <Image 
          src="https://i.imgur.com/2deYxHC.png" 
          alt="Sardes Salihli" 
          data-ai-hint="ancient ruins" 
          fill 
          className="object-cover scale-105 animate-pulse-slow" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12">
          <div className="max-w-4xl space-y-6">
            <span className="inline-block bg-accent/90 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase animate-in fade-in slide-in-from-top-4 duration-700">
                {t('home.heroSubtitle')}
            </span>
            <h1 className="text-5xl md:text-8xl font-black font-headline text-white text-shadow-strong tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md animate-in fade-in duration-1000 delay-300">
              Sardes'in mirası, paranın merkezi olan kadim toprakları bizimle keşfedin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8 animate-in fade-in zoom-in-95 duration-700 delay-500">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-transform bg-primary text-white">
                <Link href="/yerler" className="flex items-center gap-2">
                  <Compass className="h-6 w-6" />
                  {t('home.getStarted')}
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold glass text-white hover:bg-white/20 border-white/40">
                    <Info className="mr-2 h-6 w-6" />
                    {t('home.aboutSalihli')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-headline font-black text-primary border-b pb-4">
                        {aboutTitle}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-6">
                      <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg text-justify italic font-medium">
                        {aboutContent}
                      </p>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" className="rounded-xl px-8" onClick={() => (document.querySelector('[data-state="open"]') as any)?.click()}>
                        {t('actions.close')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE GRID: CLEANER & PREMIUM --- */}
      <section className="py-24 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black font-headline text-primary tracking-tight">
                {t('home.experienceTitle')}
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
                {t('home.experienceSubtitle')}
            </p>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-4" />
          </div>
          
          <div className="mb-16">
            <PwaInstallButton />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {experienceLoading ? Array.from({length: 5}).map((_, i) => (
                <Card key={`skeleton-exp-${i}`} className="p-10 flex flex-col items-center justify-center aspect-square bg-muted/30 rounded-[2rem] border-none">
                    <Skeleton className="w-16 h-16 rounded-full mb-6" />
                    <Skeleton className="h-6 w-full" />
                </Card>
            )) : displayExperienceItems.map((item, index) => (
              <Link href={item.link} key={item.id || `exp-item-${index}`} className="group block">
                <Card className="p-8 md:p-10 flex flex-col items-center justify-center aspect-square bg-white shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] border-none group-hover:-translate-y-2 ring-1 ring-black/5">
                  <div className="p-6 bg-primary/5 rounded-[1.5rem] mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <LucideIcon name={item.icon} className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                  <h3 className="font-bold text-center text-lg md:text-xl group-hover:text-primary transition-colors">
                    {item.name[typedLanguage]}
                  </h3>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-accent font-bold text-xs uppercase tracking-widest">
                    Keşfet <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- GUESTBOOK: THEMATIC BACKGROUND --- */}
      <section className="py-24 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-5 bg-white shadow-xl rounded-[2rem] mb-6 text-primary ring-1 ring-primary/10">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-headline text-slate-900 mb-4 tracking-tight">
                {t('guestbook.diaryTitle')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              {t('guestbook.description')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FeedbackSystem />
          </div>
        </div>
      </section>
    </div>
  );
}