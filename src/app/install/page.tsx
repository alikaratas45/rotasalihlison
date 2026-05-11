
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export default function InstallPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    // Attempt to trigger the install prompt if it was already captured
    const timer = setTimeout(() => {
      setIsSearching(false);
      // PWA logic usually needs a direct user gesture, so we show a button here.
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="p-6 bg-primary/10 rounded-full mb-6">
        <Smartphone className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-3xl font-bold font-headline mb-4">
        {t('pwa.title', 'Uygulamayı Yükle')}
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {t('pwa.description', 'Rota Salihli\'yi ana ekranınıza ekleyerek çevrimdışı erişim sağlayabilir ve daha hızlı bir deneyim yaşayabilirsiniz.')}
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-bold"
          onClick={() => {
            // This relies on the PwaInstallButton component having captured the event
            // Modern browsers require a button click to show the prompt
            window.dispatchEvent(new Event('trigger-pwa-install'));
            // Fallback: If event dispatcher isn't enough, instructions
            alert(t('pwa.errorDescription', 'Lütfen tarayıcı menüsünü kullanarak "Ana Ekrana Ekle" seçeneğini seçin.'));
          }}
        >
          {isSearching ? <Loader2 className="animate-spin mr-2" /> : <Smartphone className="mr-2" />}
          {t('pwa.installButton', 'Yüklemeyi Başlat')}
        </Button>
        
        <Button variant="ghost" className="w-full" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.close', 'Geri Dön')}
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground bg-muted/30 p-6 rounded-2xl border border-dashed">
        <p className="font-bold mb-2">Nasıl Yüklenir?</p>
        <ul className="text-left space-y-2 list-disc list-inside">
          <li><b>Android/Chrome:</b> Yukarıdaki butona basın veya tarayıcı menüsünden "Uygulamayı Yükle"yi seçin.</li>
          <li><b>iPhone/Safari:</b> Alttaki "Paylaş" ikonuna basın ve "Ana Ekrana Ekle"yi seçin.</li>
        </ul>
      </div>
    </div>
  );
}
