
'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
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
    // 1. Standalone mod kontrolü (Uygulama zaten yüklüyse gösterme)
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone 
        || document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    }

    // 2. Tarayıcı yükleme isteğini yakalama
    const handleBeforeInstallPrompt = (e: Event) => {
      // Varsayılan pencereyi engelle
      e.preventDefault();
      // Olayı sakla
      setDeferredPrompt(e);
      // Butonu görünür yap (Sadece olay tetiklendiğinde aktif etme kuralı)
      setIsVisible(true);
    };

    // 3. Yükleme tamamlandığında butonu gizle
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
  }, [t, toast]);

  // 4. Butona tıklayınca yüklemeyi başlat
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        variant: 'destructive',
        title: t('pwa.errorTitle', 'Bilgi'),
        description: t('pwa.errorDescription', 'Yükleme için tarayıcı menüsünü (Ana Ekrana Ekle) kullanabilirsiniz.'),
      });
      return;
    }

    // Yükleme penceresini göster
    deferredPrompt.prompt();
    
    // Kullanıcı seçimini bekle
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: Kullanıcı yükleme tercihi: ${outcome}`);
    
    // Olayı temizle ve butonu gizle
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Eğer uygulama zaten yüklüyse veya tarayıcı hazır değilse (henüz prompt fırlatmadıysa) hiçbir şey gösterme
  if (isStandalone || !isVisible) return null;

  return (
    <Card className="w-full max-w-md mx-auto border-primary/20 bg-primary/5 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Download className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-sm leading-none">{t('pwa.title', 'Uygulamayı Yükle')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('pwa.description', 'Daha hızlı ve çevrimdışı erişim için.')}</p>
          </div>
        </div>
        <Button 
            onClick={handleInstallClick} 
            size="sm"
            className="w-full sm:w-auto font-bold gap-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg h-10 px-6"
        >
            <Download className="h-4 w-4" />
            {t('pwa.installButton', 'Hemen Yükle')}
        </Button>
      </CardContent>
    </Card>
  );
}
