
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
  // Hydration hatalarını önlemek için 'mounted' kontrolü kullanıyoruz.
  // Sunucunun her zaman layout render etmesini (SEO için), 
  // istemcinin ise açılış ekranına karar vermesini sağlıyoruz.
  const [mounted, setMounted] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const splashShown = sessionStorage.getItem('rota_salihli_splash_shown');
    
    if (!splashShown) {
      setIsFirstVisit(true);
      setIsSplashLoading(true);
      
      const timer = setTimeout(() => {
        setIsSplashLoading(false);
        sessionStorage.setItem('rota_salihli_splash_shown', 'true');
        
        // Geçiş efekti sonrası DOM'dan tamamen kaldır
        setTimeout(() => setIsFirstVisit(false), 1000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Sunucu ve ilk istemci render'ı: Her zaman Layout (SEO dostu ve Hydration uyumlu)
  const showSplash = mounted && isFirstVisit;

  return (
    <>
      {showSplash && <SplashScreen isLoading={isSplashLoading} />}
      {mounted && !isSplashLoading && <AudioProximityAlert />}
      
      <div className={cn(
        "flex flex-col min-h-screen transition-opacity duration-700",
        showSplash && isSplashLoading ? 'opacity-0' : 'opacity-100'
      )}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
      <Toaster />
    </>
  );
}
