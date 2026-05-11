
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
    // Standalone modunda olup olmadığını kontrol et
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone 
        || document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Tarayıcının varsayılan promptunu engelle
      e.preventDefault();
      // Olayı sakla
      setDeferredPrompt(e);
      // Butonu görünür yap (Eğer standalone değilse)
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

    // Promptu göster
    deferredPrompt.prompt();

    // Kullanıcının seçimini bekle
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Kullanıcı PWA yüklemesini kabul etti');
    } else {
      console.log('Kullanıcı PWA yüklemesini reddetti');
    }

    // Promptu temizle
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="container mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
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
                className="flex-1 md:flex-none h-12 px-8 font-bold shadow-md"
            >
                {t('pwa.installButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
