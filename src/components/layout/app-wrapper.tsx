
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SplashScreen } from '@/components/splash-screen';
import { AudioProximityAlert } from '@/components/audio-proximity-alert';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { incrementVisitorCount } from '@/firebase/firestore/stats-service';

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(false);
  const firestore = useFirestore();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // PWA Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        // Service worker kaydı, PWA install prompt için zorunludur
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('PWA: Service Worker başarıyla kaydedildi:', registration.scope);
                })
                .catch((err) => {
                    console.log('PWA: Service Worker kaydı başarısız:', err);
                });
        });
    }

    // Visitor Count Logic (Once per session)
    if (!hasTrackedRef.current) {
        const visitorTracked = sessionStorage.getItem('rota_salihli_visitor_tracked');
        if (!visitorTracked) {
          incrementVisitorCount(firestore);
          sessionStorage.setItem('rota_salihli_visitor_tracked', 'true');
        }
        hasTrackedRef.current = true;
    }

    const splashShown = sessionStorage.getItem('rota_salihli_splash_shown');
    if (!splashShown) {
      setIsFirstVisit(true);
      setIsSplashLoading(true);
      
      const timer = setTimeout(() => {
        setIsSplashLoading(false);
        sessionStorage.setItem('rota_salihli_splash_shown', 'true');
        
        setTimeout(() => setIsFirstVisit(false), 1000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [firestore]);

  const handleInteraction = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && !(window as any)._audioUnlocked) {
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
        (window as any)._audioUnlocked = true;
    }
  }, []);

  const showSplash = mounted && isFirstVisit;

  return (
    <div 
      onClick={handleInteraction} 
      onTouchStart={handleInteraction}
      className="min-h-screen flex flex-col"
    >
      {showSplash && <SplashScreen isLoading={isSplashLoading} />}
      {mounted && !isSplashLoading && <AudioProximityAlert />}
      
      <div className={cn(
        "flex flex-col flex-1 transition-opacity duration-700",
        mounted && showSplash && isSplashLoading ? 'opacity-0' : 'opacity-100'
      )}>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </div>
      <Toaster />
    </div>
  );
}
