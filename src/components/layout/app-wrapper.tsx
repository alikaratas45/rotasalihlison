
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
