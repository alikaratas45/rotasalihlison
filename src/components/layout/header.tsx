
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Logo } from '@/components/icons/logo';
import { TurkishFlagIcon, UKFlagIcon, FrenchFlagIcon, GermanFlagIcon } from '@/components/icons/flags';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import type { Language } from '@/context/language-context';
import React from 'react';

export function Header() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/yerler', label: t('header.places') },
    { href: '/rotalar', label: t('header.routes') },
    { href: '/hikayeler', label: t('header.stories') },
    { href: '/lezzetler', label: t('header.cuisine') },
    { href: '/yakindakiler', label: t('header.nearby') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">Rota Salihli</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <AudioGuideToggle />
          <LanguageSwitcher />
          <ThemeToggle />

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              <div className="flex flex-col h-full">
                <div className="border-b pb-4">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="font-bold font-headline">Rota Salihli</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-4 py-4 text-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-foreground/80 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

const languages: { code: Language; name: string; flag: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { code: 'tr', name: 'Türkçe', flag: TurkishFlagIcon },
    { code: 'en', name: 'English', flag: UKFlagIcon },
    { code: 'fr', name: 'Français', flag: FrenchFlagIcon },
    { code: 'de', name: 'Deutsch', flag: GermanFlagIcon },
];

function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    
    const selectedLanguage = languages.find(lang => lang.code === language);

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {selectedLanguage && <selectedLanguage.flag className="h-5 w-5 rounded-sm" />}
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
                key={lang.code}
                className={cn("gap-2", language === lang.code && 'bg-accent')}
                onClick={() => setLanguage(lang.code)}
            >
                <lang.flag className="h-4 w-4 rounded-sm" />
                <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

function AudioGuideToggle() {
    const { isAudioGuideEnabled, toggleAudioGuide } = useLanguage();
  
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAudioGuide}
        aria-label="Toggle Audio Guide"
      >
        {isAudioGuideEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Audio Guide</span>
      </Button>
    );
  }
