"use client";

import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';
import { useLanguage } from '@/hooks/use-language';
import { useState, useEffect } from 'react';

interface SplashScreenProps {
  isLoading: boolean;
}

export function SplashScreen({ isLoading }: SplashScreenProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#FDFCE6] transition-opacity duration-1000 ease-in-out',
        !isLoading && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-xl">
            <Logo className="w-full h-full" />
        </div>
        <div className="flex flex-col items-center text-center px-4">
            <h1 className="text-3xl font-bold text-primary font-headline tracking-[0.2em] uppercase">
                ROTA SALİHLİ
            </h1>
            <div className="h-0.5 w-16 bg-primary/20 my-3 rounded-full" />
            <p className="text-muted-foreground text-sm font-medium tracking-wide italic">
                {t('splash.slogan')}
            </p>
        </div>
      </div>
    </div>
  );
}
