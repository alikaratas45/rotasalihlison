
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
  // SSR sırasında true, client'da session kontrolüne göre güncellenir
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Açılış ekranının bu oturumda daha önce gösterilip gösterilmediğini kontrol et
    const splashShown = sessionStorage.getItem('rota_salihli_splash_shown');
    
    if (splashShown) {
      // Eğer daha önce gösterildiyse bekletme yapma, hemen kapat
      setIsLoading(false);
    } else {
      // İlk girişte 2 saniye göster ve flag'i set et
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('rota_salihli_splash_shown', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* isLoading true olsa bile splashShown varsa render etme veya gizli render et */}
      <SplashScreen isLoading={isLoading} />
      {!isLoading && <AudioProximityAlert />}
      <div className={cn("flex flex-col min-h-screen transition-opacity duration-700", isLoading ? 'opacity-0' : 'opacity-100')}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
      <Toaster />
    </>
  );
}
