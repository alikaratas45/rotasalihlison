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

  // Farklı boyutlar için sınıf ataması (Mosaic Layout)
  const getGridSizeClasses = (index: number) => {
    const sizes = [
      "lg:col-span-6 lg:row-span-2", // 1. Büyük
      "lg:col-span-3 lg:row-span-2", // 2. Uzun
      "lg:col-span-3 lg:row-span-1", // 3. Küçük
      "lg:col-span-3 lg:row-span-1", // 4. Küçük
      "lg:col-span-4 lg:row-span-2", // 5. Orta
      "lg:col-span-4 lg:row-span-1", // 6. Yatay
      "lg:col-span-4 lg:row-span-1", // 7. Yatay
      "lg:col-span-6 lg:row-span-1", // 8. Alt Geniş
      "lg:col-span-6 lg:row-span-1", // 9. Alt Geniş
    ];
    return sizes[index % sizes.length];
  };

  return (
    <div className="flex flex-col">
      {/* --- HERO SECTION: ENHANCED READABILITY --- */}
      <section className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden">
        <Image 
          src="https://i.imgur.com/2deYxHC.png" 
          alt="Sardes Salihli" 
          data-ai-hint="ancient ruins" 
          fill 
          className="object-cover scale-105 animate-pulse-slow" 
          priority 
        />
        {/* Güçlendirilmiş Gradyan Katmanı */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12">
          <div className="max-w-4xl space-y-8">
            <span className="inline-block bg-accent/90 text-accent-foreground px-5 py-2 rounded-full text-xs md:text-sm font-black tracking-[0.3em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                {t('home.heroSubtitle')}
            </span>
            <h1 className="text-6xl md:text-9xl font-black font-headline text-white text-shadow-strong tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {t('home.heroTitle')}
            </h1>
            <p className="text-xl md:text-3xl text-white/95 font-medium max-w-2xl mx-auto drop-shadow-2xl animate-in fade-in duration-1000 delay-300 italic">
              "Sardes'in mirası, paranın merkezi olan kadim toprakları bizimle keşfedin."
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in zoom-in-95 duration-700 delay-500">
              <Button asChild size="lg" className="h-16 px-12 rounded-[1.25rem] text-lg font-black shadow-2xl hover:scale-105 transition-all bg-primary text-white border-b-4 border-primary/20">
                <Link href="/yerler" className="flex items-center gap-3">
                  <Compass className="h-6 w-6" />
                  {t('home.getStarted')}
                </Link>
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="h-16 px-12 rounded-[1.25rem] text-lg font-black bg-black/40 backdrop-blur-xl text-white hover:bg-black/60 border-white/20 shadow-2xl transition-all">
                    <Info className="mr-3 h-6 w-6 text-accent" />
                    {t('home.aboutSalihli')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                  <div className="p-8 md:p-12">
                    <DialogHeader>
                      <DialogTitle className="text-4xl font-headline font-black text-primary border-b-2 border-primary/10 pb-6 mb-6">
                          {aboutTitle}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg text-justify font-medium">
                          {aboutContent}
                        </p>
                    </div>
                    <DialogFooter className="mt-10">
                      <Button variant="secondary" className="rounded-xl px-10 h-12 font-bold" onClick={() => (document.querySelector('[data-state="open"]') as any)?.click()}>
                          {t('actions.close')}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE GRID: DYNAMIC MOSAIC --- */}
      <section className="py-32 relative bg-background overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black font-headline text-primary tracking-tight">
                {t('home.experienceTitle')}
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium opacity-80">
                {t('home.experienceSubtitle')}
            </p>
            <div className="w-32 h-1.5 bg-accent mx-auto rounded-full mt-6" />
          </div>
          
          <div className="mb-20">
            <PwaInstallButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[220px]">
            {experienceLoading ? Array.from({length: 6}).map((_, i) => (
                <div key={`skeleton-exp-${i}`} className="lg:col-span-4 bg-muted/30 rounded-[2.5rem] animate-pulse" />
            )) : displayExperienceItems.map((item, index) => (
              <Link href={item.link} key={item.id || `exp-item-${index}`} className={cn("group block h-full w-full", getGridSizeClasses(index))}>
                <Card className="h-full w-full p-8 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] border-none group-hover:-translate-y-2 ring-1 ring-black/5 overflow-hidden relative">
                  {/* Subtle Background Pattern */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <LucideIcon name={item.icon} className="w-24 h-24 -rotate-12 translate-x-8 -translate-y-8" />
                  </div>
                  
                  <div className="p-6 bg-primary/5 rounded-[2rem] mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                    <LucideIcon name={item.icon} className="w-12 h-12 md:w-16 md:h-16" />
                  </div>
                  
                  <h3 className="font-black text-center text-xl md:text-2xl group-hover:text-primary transition-colors px-4 leading-tight uppercase tracking-tight">
                    {item.name[typedLanguage]}
                  </h3>
                  
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center text-accent font-black text-xs uppercase tracking-[0.2em]">
                    Hemen Keşfet <ChevronRight className="h-4 w-4 ml-2" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- GUESTBOOK: PREMIUM THEMATIC --- */}
      <section className="py-32 bg-primary/5 border-y border-primary/10 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
            <MessageSquare className="absolute -top-10 -left-10 w-64 h-64 rotate-12" />
            <MessageSquare className="absolute -bottom-10 -right-10 w-64 h-64 -rotate-12" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-6 bg-white shadow-2xl rounded-[2.5rem] mb-8 text-primary ring-1 ring-primary/10 border-b-4 border-primary/5">
              <MessageSquare className="h-12 w-12" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-headline text-slate-900 mb-6 tracking-tight">
                {t('guestbook.diaryTitle')}
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
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
