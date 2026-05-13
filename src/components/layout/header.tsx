"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon, Volume2, VolumeX, Smartphone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Logo } from '@/components/icons/logo';
import { TurkishFlagIcon, UKFlagIcon, FrenchFlagIcon, GermanFlagIcon, JapaneseFlagIcon } from '@/components/icons/flags';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import type { Language } from '@/lib/language-config';
import React from 'react';

export function Header() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/yerler', label: t('header.places') },
    { href: '/rotalar', label: t('header.routes') },
    { href: '/hikayeler', label: t('header.stories') },
    { href: '/lezzetler', label: t('header.cuisine') },
    { href: '/ziyaretci-defteri', label: t('guestbook.title') },
    { href: '/cevremde-ne-var', label: t('header.nearby') },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500",
      scrolled ? "h-20 glass border-b shadow-lg" : "h-24 bg-transparent border-transparent"
    )}>
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/90 p-1.5 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Logo className="h-10 w-10" />
          </div>
          <span className={cn(
            "font-black text-xl md:text-2xl font-headline tracking-tighter uppercase transition-colors",
            scrolled ? "text-primary" : "text-primary md:text-white"
          )}>
            Rota Salihli
          </span>
        </Link>
        
        <nav className="hidden items-center gap-1 text-sm font-bold md:flex">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "px-4 py-2 rounded-xl transition-all duration-300",
                scrolled 
                  ? "text-slate-600 hover:bg-primary/5 hover:text-primary" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <AudioGuideToggle isScrolled={scrolled} />
            <LanguageSwitcher isScrolled={scrolled} />
            <ThemeToggle isScrolled={scrolled} />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className={scrolled ? "text-primary" : "text-white"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-primary/10 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col h-full bg-background">
                  <div className="p-8 border-b bg-primary/5">
                      <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="h-12 w-12" />
                        <span className="font-black font-headline text-2xl tracking-tighter text-primary">ROTA SALİHLİ</span>
                      </Link>
                  </div>
                  <nav className="flex-grow overflow-y-auto py-6 px-4">
                    <div className="space-y-2">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-slate-700 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary" />
                            {link.label}
                        </Link>
                        ))}
                    </div>
                  </nav>
                  <div className="p-8 border-t bg-muted/20 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-500 uppercase">Araçlar</span>
                          <div className="flex gap-2">
                            <ThemeToggle />
                            <LanguageSwitcher />
                          </div>
                      </div>
                      <AudioGuideToggle className="w-full h-12" />
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle({ isScrolled }: { isScrolled?: boolean }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-10" />;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn("rounded-full transition-colors", isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10")} 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

const languagesList: { code: Language; name: string; flag: React.FC<any> }[] = [
    { code: 'tr', name: 'Türkçe', flag: TurkishFlagIcon },
    { code: 'en', name: 'English', flag: UKFlagIcon },
    { code: 'fr', name: 'Français', flag: FrenchFlagIcon },
    { code: 'de', name: 'Deutsch', flag: GermanFlagIcon },
    { code: 'ja', name: '日本語', flag: JapaneseFlagIcon },
];

function LanguageSwitcher({ isScrolled }: { isScrolled?: boolean }) {
    const { language, setLanguage, mounted } = useLanguage();
    
    if (!mounted) return <div className="h-10 w-10" />;

    const selectedLanguage = languagesList.find(lang => lang.code === language);
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("rounded-full overflow-hidden transition-colors", isScrolled ? "text-primary hover:bg-primary/5" : "text-white hover:bg-white/10")}>
            {selectedLanguage && <selectedLanguage.flag className="h-5 w-5 rounded-sm object-cover shadow-sm" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2 rounded-2xl min-w-[160px]">
          {languagesList.map((lang) => (
            <DropdownMenuItem key={lang.code} className={cn("gap-3 p-3 rounded-xl cursor-pointer", language === lang.code ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted')} onClick={() => setLanguage(lang.code)}>
                <lang.flag className="h-4 w-4 rounded-sm" />
                <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

function AudioGuideToggle({ isScrolled, className }: { isScrolled?: boolean, className?: string }) {
    const { isAudioGuideEnabled, toggleAudioGuide, t, mounted } = useLanguage();
    
    if (!mounted) return <div className="h-10 w-24" />;

    return (
      <Button
        variant={isAudioGuideEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleAudioGuide}
        className={cn(
          "rounded-full gap-2 px-4 transition-all duration-500 font-bold uppercase text-[10px] tracking-widest h-10 shadow-sm",
          isAudioGuideEnabled 
            ? "bg-accent border-accent text-accent-foreground ring-4 ring-accent/20" 
            : isScrolled ? "text-slate-600 border-slate-200" : "text-white border-white/30 glass",
          className
        )}
      >
        {isAudioGuideEnabled ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
        <span>{t('header.audioGuide')}</span>
      </Button>
    );
  }