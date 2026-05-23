
"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { useLanguage } from '@/hooks/use-language';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { Users } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  const firestore = useFirestore();

  // Listen to the live visitor count from Firestore
  const statsDocRef = useMemo(() => doc(firestore, 'settings', 'stats'), [firestore]);
  const { data: stats } = useDoc<any>(statsDocRef);

  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg font-headline">Rota Salihli</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.about')}
            </p>
            
            {/* Live Visitor Counter */}
            <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 w-fit px-3 py-1.5 rounded-full border border-primary/10">
                <Users className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">{t('footer.totalVisitors')}:</span>
                <span className="text-sm font-mono">{stats?.visitorCount?.toLocaleString() || '...'}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/yerler" className="text-muted-foreground hover:text-primary">{t('header.places')}</Link></li>
              <li><Link href="/rotalar" className="text-muted-foreground hover:text-primary">{t('header.routes')}</Link></li>
              <li><Link href="/hikayeler" className="text-muted-foreground hover:text-primary">{t('header.stories')}</Link></li>
              <li><Link href="/lezzetler" className="text-muted-foreground hover:text-primary">{t('header.cuisine')}</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Salihli Belediyesi</li>
                <li>Mithatpaşa, 25. Sk., 45300 Salihli/Manisa</li>
                <li><a href="tel:02367141065" className="hover:text-primary">0236 714 10 65</a></li>
             </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            <p>&copy; {year} Salihli Belediyesi. {t('footer.copyright')}</p>
            <Link href="/admin/login" className="text-xs text-muted-foreground/50 hover:text-muted-foreground">
                Admin Girişi
            </Link>
          </div>
          <div className="text-[10px] opacity-40 hover:opacity-100 transition-opacity text-right">
             Bu web sitesi Ali Karataş tarafından yapılmıştır.
          </div>
        </div>
      </div>
    </footer>
  );
}
