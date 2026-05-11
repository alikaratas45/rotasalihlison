
'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function PwaInstallButton() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone 
        || document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's default install banner
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      // Show the install button (only if not already standalone)
      if (!isStandalone) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      toast({
        title: t('pwa.installedTitle', 'Başarılı'),
        description: t('pwa.installedDescription', 'Uygulama cihazınıza başarıyla eklendi.'),
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, t, toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        variant: 'destructive',
        title: t('pwa.errorTitle', 'Hata'),
        description: t('pwa.errorDescription', 'Yükleme şu an başlatılamıyor. Lütfen tarayıcı menüsünden "Ana Ekrana Ekle" seçeneğini kullanın.'),
      });
      return;
    }

    // Show the native browser install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    } else {
      console.log('User dismissed the PWA install');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Do not render anything if already installed or not supported yet
  if (!isVisible || isStandalone) return null;

  return (
    <div className="container mx-auto px-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
              <Download className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-headline">{t('pwa.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('pwa.description')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsVisible(false)}
                className="hidden md:flex"
            >
                <X className="h-4 w-4 mr-2" />
                {t('actions.close')}
            </Button>
            <Button 
                onClick={handleInstallClick} 
                className="flex-1 md:flex-none h-12 px-8 font-bold shadow-md bg-primary hover:bg-primary/90 text-white"
            >
                {t('pwa.installButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
