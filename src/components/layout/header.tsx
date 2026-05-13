"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
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
      scrolled 
        ? "h-16 bg-background/95 backdrop-blur-xl border-b shadow-md" 
        : "h-20 bg-background/80 backdrop-blur-md border-b border-primary/10 shadow-sm"
    )}>
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center group shrink-0">
          <div className="bg-white p-1 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-500 border border-primary/5">
            <Logo className="h-8 w-8 md:h-10 md:w-10" />
          </div>
        </Link>
        
        <nav className="hidden items-center gap-1 text-xs font-black md:flex lg:gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="px-3 py-2 rounded-xl transition-all duration-300 text-slate-600 hover:bg-primary/5 hover:text-primary uppercase tracking-tight"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Always visible options: Language & Audio */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <AudioGuideToggle isScrolled={true} />
            <LanguageSwitcher isScrolled={true} />
            <ThemeToggle isScrolled={true} />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary rounded-full hover:bg-primary/5">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-primary/10 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col h-full bg-background">
                  <div className="p-6 border-b bg-primary/5">
                      <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Logo className="h-12 w-12" />
                      </Link>
                  </div>
                  <nav className="flex-grow overflow-y-auto py-6 px-4">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 p-4 rounded-xl text-base font-bold text-slate-700 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                            {link.label}
                        </Link>
                        ))}
                    </div>
                  </nav>
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

  if (!mounted) return <div className="h-8 w-8" />;

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full h-8 w-8 md:h-10 md:w-10 text-primary hover:bg-primary/5" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
    
    if (!mounted) return <div className="h-8 w-8" />;

    const selectedLanguage = languagesList.find(lang => lang.code === language);
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 md:h-10 md:w-10 overflow-hidden text-primary hover:bg-primary/5">
            {selectedLanguage && <selectedLanguage.flag className="h-4 w-4 md:h-5 md:w-5 rounded-sm object-cover shadow-sm" />}
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
    
    if (!mounted) return <div className="h-8 w-8" />;

    return (
      <Button
        variant={isAudioGuideEnabled ? "default" : "outline"}
        size="icon"
        onClick={toggleAudioGuide}
        className={cn(
          "rounded-full h-8 w-8 md:h-10 md:w-10 transition-all duration-500",
          isAudioGuideEnabled 
            ? "bg-accent border-accent text-accent-foreground shadow-sm ring-2 ring-accent/20" 
            : "text-slate-600 border-slate-200 hover:bg-primary/5 hover:text-primary",
          className
        )}
      >
        {isAudioGuideEnabled ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
      </Button>
    );
  }
