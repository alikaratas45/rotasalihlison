"use client";

import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';
import { useTranslation } from '@/hooks/use-translation';

interface SplashScreenProps {
  isLoading: boolean;
}

export function SplashScreen({ isLoading }: SplashScreenProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-1000 ease-in-out',
        !isLoading && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Logo className="w-24 h-24 text-primary" />
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-primary font-headline tracking-wider">
                ROTA SALİHLİ
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
                {t('splash.slogan')}
            </p>
        </div>
      </div>
    </div>
  );
}
