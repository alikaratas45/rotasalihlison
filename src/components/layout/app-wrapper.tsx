"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AudioProximityAlert } from '@/components/audio-proximity-alert';
import { LegalConsent } from '@/components/legal-consent';
import { useFirestore } from '@/firebase';
import { incrementVisitorCount } from '@/firebase/firestore/stats-service';
import { APIProvider } from '@vis.gl/react-google-maps';
import { googleMapsApiKey } from '@/lib/config';

const GOOGLE_MAPS_LIBRARIES = ['places', 'marker', 'geometry'];

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const firestore = useFirestore();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // PWA Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('PWA Service Worker registered.', reg.scope))
          .catch((err) => console.warn('PWA Service Worker registration failed:', err));
      });
    }

    // Visitor Tracking
    if (!hasTrackedRef.current) {
        const visitorTracked = sessionStorage.getItem('rota_salihli_visitor_tracked');
        if (!visitorTracked) {
          incrementVisitorCount(firestore);
          sessionStorage.setItem('rota_salihli_visitor_tracked', 'true');
        }
        hasTrackedRef.current = true;
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

  return (
    <APIProvider 
      apiKey={googleMapsApiKey} 
      libraries={GOOGLE_MAPS_LIBRARIES}
      onError={(err) => console.warn('Google Maps APIProvider Error:', err)}
    >
      <div 
        onClick={handleInteraction} 
        onTouchStart={handleInteraction}
        className="min-h-dvh flex flex-col overflow-x-hidden"
      >
        {mounted && (
          <>
            <AudioProximityAlert />
            <LegalConsent />
          </>
        )}
        
        <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
        <Toaster />
      </div>
    </APIProvider>
  );
}
