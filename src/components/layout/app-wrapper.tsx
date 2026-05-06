
"use client";

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SplashScreen } from '@/components/splash-screen';
import { AudioProximityAlert } from '@/components/audio-proximity-alert';
import { cn } from '@/lib/utils';

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('rota_salihli_splash_shown');
    
    if (splashShown) {
      setIsLoading(false);
    } else {
      setIsFirstVisit(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('rota_salihli_splash_shown', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {isFirstVisit && <SplashScreen isLoading={isLoading} />}
      {!isLoading && <AudioProximityAlert />}
      <div className={cn("flex flex-col min-h-screen transition-opacity duration-700", isLoading && isFirstVisit ? 'opacity-0' : 'opacity-100')}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
      <Toaster />
    </>
  );
}
