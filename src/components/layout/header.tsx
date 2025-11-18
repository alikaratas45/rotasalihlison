"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon, Languages, Globe, X, Mic } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { Logo } from '@/components/icons/logo';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export function Header() {
  const { t, language, setLanguage } = useTranslation();
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
            <div className="hidden md:flex items-center gap-2 mr-2">
                <Mic className="w-4 h-4 text-muted-foreground"/>
                <Label htmlFor="audio-guide-switch-desktop" className="text-sm text-muted-foreground pr-2">{t('header.audioGuide')}</Label>
                <Switch id="audio-guide-switch-desktop" />
            </div>

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
                 <div className="mt-auto border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Mic className="w-5 h-5 text-muted-foreground"/>
                        <Label htmlFor="audio-guide-switch-mobile" className="text-lg text-muted-foreground pr-2">{t('header.audioGuide')}</Label>
                        <Switch id="audio-guide-switch-mobile" />
                    </div>
                </div>
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

function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className={cn(language === 'tr' && 'bg-accent')}
            onClick={() => setLanguage('tr')}
          >
            Türkçe (TR)
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(language === 'en' && 'bg-accent')}
            onClick={() => setLanguage('en')}
          >
            English (EN)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
