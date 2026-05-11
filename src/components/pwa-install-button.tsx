'use client';

import { useState, useEffect } from 'react';
import { Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

export function PwaInstallButton() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Mevcut modun kontrolü
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone;
      setIsStandalone(isStandaloneMode);
    }

    // 2. Tarayıcı yükleme sinyalini yakala
    const handleBeforeInstallPrompt = (e: Event) => {
      // Tarayıcının varsayılan penceresini engelle
      e.preventDefault();
      // Olayı state içinde sakla
      setDeferredPrompt(e);
      // Butonu göster
      setIsVisible(true);
      console.log('PWA: Yükleme sinyali yakalandı.');
    };

    // 3. Başarıyla yüklendiğinde butonu gizle
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      toast({
        title: t('pwa.installedTitle', 'Başarılı'),
        description: t('pwa.installedDescription', 'Uygulama cihazınıza eklendi.'),
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast, t]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Bilgi",
        description: "Uygulama şu an yüklenebilir durumda değil veya zaten yüklü.",
      });
      return;
    }

    // Sistemin yükleme penceresini aç
    deferredPrompt.prompt();
    
    // Kullanıcının kararını bekle
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: Kullanıcı seçimi - ${outcome}`);
    
    // İşlem bittiğinde her durumda temizle
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Zaten "App" olarak açılmışsa veya tarayıcı henüz onay vermemişse gösterme
  if (isStandalone || !isVisible) return null;

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-primary/5 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-4 ring-primary/5">
            <Smartphone className="h-7 w-7" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-base leading-tight">
              {t('pwa.title', 'Uygulamayı Yükle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('pwa.description', 'Daha hızlı ve çevrimdışı erişim için.')}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleInstallClick} 
          size="lg"
          className="w-full sm:w-auto font-bold gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md h-12 px-8"
        >
          <Download className="h-5 w-5" />
          {t('pwa.installButton', 'Hemen Yükle')}
        </Button>
      </CardContent>
    </Card>
  );
}
