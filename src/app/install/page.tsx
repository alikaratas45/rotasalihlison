'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Loader2, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export default function InstallPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
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
      <p className="text-muted-foreground max-w-md mb-8 text-lg">
        {t('pwa.description', 'Rota Salihli\'yi ana ekranınıza ekleyerek daha hızlı ve çevrimdışı erişim sağlayabilirsiniz.')}
      </p>

      <div className="space-y-4 w-full max-w-xs">
        <Button 
          size="lg" 
          className="w-full h-14 text-lg font-bold gap-2"
          onClick={() => {
            // Ana sayfadaki install prompt olayını tetikle
            window.dispatchEvent(new Event('trigger-pwa-install'));
          }}
        >
          {isSearching ? <Loader2 className="animate-spin" /> : <Download className="h-5 w-5" />}
          {t('pwa.installButton', 'Hemen Yükle')}
        </Button>
        
        <Button variant="ghost" className="w-full" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('actions.close', 'Geri Dön')}
        </Button>
      </div>

      <div className="mt-12 text-sm text-muted-foreground bg-muted/30 p-6 rounded-2xl border border-dashed text-left w-full max-w-md">
        <p className="font-bold mb-3 text-primary uppercase tracking-wider">Yükleme Talimatları</p>
        <ul className="space-y-3">
          <li className="flex gap-2">
            <span className="font-bold text-primary">1.</span>
            <span><b>Android/Chrome:</b> Yukarıdaki butona basın veya tarayıcı menüsünden "Uygulamayı Yükle"yi seçin.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">2.</span>
            <span><b>iPhone/Safari:</b> Alttaki <b>"Paylaş"</b> ikonuna basın ve açılan listeden <b>"Ana Ekrana Ekle"</b>yi seçin.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
