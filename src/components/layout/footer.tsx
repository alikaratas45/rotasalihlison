
"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { useLanguage } from '@/hooks/use-language';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Users, MapPin, Globe } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  const firestore = useFirestore();

  const statsDocRef = useMemo(() => doc(firestore, 'settings', 'stats'), [firestore]);
  const { data: stats } = useDoc<any>(statsDocRef);

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-10 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold text-lg font-headline leading-tight">Rota Salihli</span>
                <span className="text-[10px] uppercase tracking-widest font-black text-primary/60">Salihli Belediyesi</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.about')}
            </p>
            
            <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 w-fit px-3 py-1.5 rounded-full border border-primary/10">
                <div className="p-1 bg-white rounded-full shadow-sm">
                  <Users className="h-3 w-3" />
                </div>
                <span className="text-xs uppercase tracking-wider">{t('footer.totalVisitors')}:</span>
                <span className="text-sm font-mono">{stats?.visitorCount?.toLocaleString() || '...'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">{t('footer.links')}</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link href="/yerler" className="text-muted-foreground hover:text-primary transition-colors">{t('header.places')}</Link></li>
              <li><Link href="/rotalar" className="text-muted-foreground hover:text-primary transition-colors">{t('header.routes')}</Link></li>
              <li><Link href="/hikayeler" className="text-muted-foreground hover:text-primary transition-colors">{t('header.stories')}</Link></li>
              <li><Link href="/lezzetler" className="text-muted-foreground hover:text-primary transition-colors">{t('header.cuisine')}</Link></li>
              <li><Link href="/ziyaretci-defteri" className="text-muted-foreground hover:text-primary transition-colors">{t('header.guestbook')}</Link></li>
            </ul>
          </div>

           <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">{t('footer.contact')}</h4>
             <div className="space-y-3 text-sm text-muted-foreground font-medium">
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/40" />
                    <span>Mithatpaşa Mah. No:1 Salihli/Manisa</span>
                </div>
                <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 shrink-0 text-primary/40" />
                    <a href="https://www.salihli.bel.tr" target="_blank" className="hover:text-primary">salihli.bel.tr</a>
                </div>
                <p className="pt-2 text-xs italic opacity-70">
                    Salihli Belediyesi Dijital Turizm Projesidir.
                </p>
             </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center">
             <div className="relative h-20 w-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <Image 
                    src="/salihli-logo.png" 
                    alt="Salihli Belediyesi Logo" 
                    fill 
                    style={{ objectFit: 'contain' }}
                    onError={(e: any) => e.target.style.display = 'none'}
                />
             </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <div className="text-center md:text-left">
            <p>&copy; {year} {t('footer.copyright')}</p>
            <Link href="/admin/login" className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground mt-2 inline-block">
                Yönetim Paneli Girişi
            </Link>
          </div>
          <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
             Geliştirici: <span className="font-black text-primary">Ali Karataş</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
