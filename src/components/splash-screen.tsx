"use client";

import { cn } from '@/lib/utils';
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
        <div className="flex flex-col items-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-[0.2em] uppercase">
                ROTA SALİHLİ
            </h1>
            <div className="h-1 w-24 bg-primary/20 my-4 rounded-full" />
            <p className="text-muted-foreground text-base font-medium tracking-wide italic">
                {t('splash.slogan')}
            </p>
        </div>
        
        {/* Zarif bir yükleme animasyonu (Logo yerine) */}
        <div className="mt-8 flex gap-2">
            <div className="h-3 w-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="h-3 w-3 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="h-3 w-3 bg-primary/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
