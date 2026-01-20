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
      return; // Yüklenirken bir şey yapma
    }

    // Giriş yapılmamışsa ve giriş sayfasında değilse, girişe yönlendir
    if (!user && pathname !== '/admin/login') {
      router.push('/admin/login');
      return;
    }

    // Admin olarak giriş yapılmışsa ve giriş sayfasındaysa, admin paneline yönlendir
    if (user && isAdmin && pathname === '/admin/login') {
      router.push('/admin');
      return;
    }
    
    // Giriş yapılmış ama admin değilse, ana sayfaya yönlendir
    if (user && !isAdmin) {
      router.push('/');
      return;
    }
  }, [user, isAdmin, loading, router, pathname]);

  // Kimlik doğrulama durumu belirlenirken genel bir yükleyici göster
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Giriş sayfasındaysa, sadece çocukları (giriş formunu) render et
  // Yukarıdaki useEffect, zaten giriş yapılmışsa yönlendirmeyi halleder.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  // Kullanıcı admin değilse ve giriş sayfasında değilse, yönlendirilirken bir yükleyici göster.
  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Buradaysak, kullanıcı bir admindir ve bir admin sayfasındadır.
  // Tam admin düzenini göster.
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
                <span className="font-bold sm:inline-block font-headline">Rota Salihli - Admin</span>
            </Link>
            <div className="flex flex-1 items-center justify-end gap-2">
                <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2" />
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
