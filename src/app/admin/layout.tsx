
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { useAuth } from '@/firebase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }

    if (user && isAdmin && pathname === '/admin/login') {
      router.push('/admin');
      return;
    }
    
    if (user && !isAdmin && pathname !== '/admin/login') {
      router.push('/');
      return;
    }
  }, [user, isAdmin, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
            <Link href="/admin" className="mr-6 flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <div className="flex flex-col">
                  <span className="font-bold sm:inline-block font-headline uppercase tracking-tight leading-none">Rota Salihli</span>
                  <span className="text-[8px] font-black opacity-50 uppercase tracking-widest">Salihli Belediyesi</span>
                </div>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-xl font-bold">
                    <LogOut className="mr-2 h-4 w-4" />
                    Çıkış Yap
                </Button>
            </div>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
