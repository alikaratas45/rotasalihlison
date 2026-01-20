'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Map,
  Book,
  Utensils,
  Newspaper,
  Image as ImageIcon,
  Users,
  Route,
  SignOut,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { signOutUser } from '@/firebase/auth/auth-service';
import { Logo } from '../icons/logo';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/places', label: 'Yerler', icon: Map },
    { href: '/admin/routes', label: 'Rotalar', icon: Route },
    { href: '/admin/stories', label: 'Hikayeler', icon: Book },
    { href: '/admin/brochures', label: 'Broşürler', icon: Newspaper },
    { href: '/admin/menu', label: 'Menü Yönetimi', icon: MenuIcon },
  ];
  

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span className="">Rota Salihli</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname.startsWith(href) && href !== '/admin' ? 'bg-muted text-primary' : pathname === href ? 'bg-muted text-primary' : ''
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        {user && (
             <Button variant="ghost" className="w-full justify-start" onClick={() => signOutUser(auth)}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        )}
      </div>
    </div>
  );
}
