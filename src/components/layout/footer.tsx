import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export function Footer() {
  const year = new Date().getFullYear();

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
              Rota Salihli, Salihli'nin tarihi, kültürel ve doğal güzelliklerini keşfetmeniz için hazırlanmış bir dijital rehberdir.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/yerler" className="text-muted-foreground hover:text-primary">Yerler</Link></li>
              <li><Link href="/rotalar" className="text-muted-foreground hover:text-primary">Rotalar</Link></li>
              <li><Link href="/hikayeler" className="text-muted-foreground hover:text-primary">Hikayeler</Link></li>
              <li><Link href="/lezzetler" className="text-muted-foreground hover:text-primary">Lezzetler</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Salihli Belediyesi</li>
                <li>Mithatpaşa, 25. Sk., 45300 Salihli/Manisa</li>
                <li><a href="tel:02367141065" className="hover:text-primary">0236 714 10 65</a></li>
             </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {year} Salihli Belediyesi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
