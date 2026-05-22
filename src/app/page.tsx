
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Info, MessageSquare, ChevronRight, Compass } from 'lucide-react';
import { FeedbackSystem } from '@/components/feedback-system';
import { PwaInstallButton } from '@/components/pwa-install-button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      {/* --- HERO SECTION --- */}
      <section className="relative h-[75vh] md:h-[80vh] w-full overflow-hidden">
        <Image 
          src="https://i.imgur.com/2deYxHC.png" 
          alt="Sardes Salihli" 
          data-ai-hint="ancient ruins" 
          fill 
          className="object-cover scale-105" 
          sizes="100vw"
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12">
          <div className="max-w-4xl space-y-6 flex flex-col items-center">
            
            {/* BELEDİYE LOGOSU */}
            <div className="relative h-24 w-24 md:h-32 md:w-32 mb-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                <Image 
                  src="/salihli.png" 
                  alt="Salihli Belediyesi" 
                  fill 
                  className="object-contain drop-shadow-2xl"
                  sizes="150px"
                  priority
                />
            </div>

            <span className="inline-block bg-accent/90 text-accent-foreground px-4 py-1.5 rounded-full text-[10px] md:text-sm font-black tracking-[0.2em] uppercase shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
                {t('home.heroSubtitle')}
            </span>
            
            <h1 className="text-4xl md:text-7xl font-black font-headline text-white text-shadow-strong tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {t('home.heroTitle')}
            </h1>
            
            <p className="text-base md:text-xl text-white/95 font-medium max-w-2xl mx-auto drop-shadow-2xl animate-in fade-in duration-1000 delay-300 italic">
              "{t('home.heroDescription')}"
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in zoom-in-95 duration-700 delay-500 pb-10">
              <Button asChild size="lg" className="h-12 px-8 rounded-xl text-sm font-black shadow-2xl hover:scale-105 transition-all bg-primary text-white">
                <Link href="/yerler" className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  {t('home.getStarted')}
                </Link>
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-sm font-black bg-black/50 backdrop-blur-xl text-white hover:bg-black/70 border-white/30 shadow-2xl transition-all">
                    <Info className="mr-2 h-5 w-5 text-accent" />
                    {t('home.aboutSalihli')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl h-[85vh] flex flex-col rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                  <div className="flex flex-col h-full">
                    <DialogHeader className="p-8 md:p-10 pb-4 shrink-0 bg-primary/5">
                      <DialogTitle className="text-3xl font-headline font-black text-primary">
                          {aboutTitle}
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex-1 px-8 md:px-10 pb-8">
                        <div className="prose prose-slate max-w-none py-4">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base text-justify font-medium">
                            {aboutContent}
                            </p>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-8 md:p-10 pt-4 shrink-0 border-t bg-muted/20">
                      <DialogClose asChild>
                        <Button variant="secondary" className="rounded-xl px-8 h-11 font-bold">
                            {t('actions.close')}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE GRID --- */}
      <section className="-mt-16 md:-mt-24 relative z-20 overflow-hidden">
        <div className="bg-background rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.3)]">
          <div className="container mx-auto px-4 sm:px-6 pt-6 pb-6 md:pt-10 md:pb-10">
            <div className="text-center mb-8 md:mb-10 space-y-3">
              <h2 className="text-3xl md:text-5xl font-black font-headline text-primary tracking-tight">
                  {t('home.experienceTitle')}
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium opacity-80">
                  {t('home.experienceSubtitle')}
              </p>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full mt-4" />
            </div>
            
            <div className="mb-10">
              <PwaInstallButton />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4 lg:grid-cols-10 lg:gap-3 auto-rows-[110px] md:auto-rows-[140px]">
              {experienceLoading ? Array.from({length: 10}).map((_, i) => (
                  <div key={`skeleton-exp-${i}`} className="col-span-1 bg-muted/30 rounded-3xl animate-pulse" />
              )) : displayExperienceItems.map((item, index) => (
                <Link 
                  href={item.link} 
                  key={item.id || `exp-item-${index}`} 
                  className="group block h-full w-full col-span-1"
                >
                  <Card className="h-full w-full p-2 sm:p-3 flex flex-col items-center justify-center bg-secondary/80 dark:bg-primary/5 shadow-md hover:shadow-2xl transition-all duration-500 rounded-[1.25rem] md:rounded-[1.5rem] border-none group-hover:-translate-y-1 ring-1 ring-primary/10 dark:ring-white/20 overflow-hidden relative">
                    <div className="p-2 sm:p-3 bg-primary/10 dark:bg-primary/20 rounded-xl md:rounded-[1.25rem] mb-2 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <LucideIcon name={item.icon} className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </div>
                    
                    <h3 className="font-black text-center text-[8px] sm:text-[10px] md:text-[11px] text-foreground group-hover:text-primary transition-colors px-1 leading-tight uppercase tracking-tight">
                      {item.name[typedLanguage]}
                    </h3>
                    
                    <div className="mt-1 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-500 hidden md:flex items-center text-accent font-black text-[7px] uppercase tracking-[0.1em]">
                      Keşfet <ChevronRight className="h-2 w-2 ml-1" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- GUESTBOOK --- */}
      <section className="py-6 md:py-8 bg-primary/5 dark:bg-primary/10 border-y border-primary/10 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-background shadow-xl rounded-[1.5rem] mb-4 text-primary ring-1 ring-primary/10 border-b-4 border-primary/5">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-headline text-foreground mb-4 tracking-tight">
                {t('guestbook.diaryTitle')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
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
