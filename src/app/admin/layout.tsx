'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { signOut } from '@/firebase/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login page
        router.push('/admin/login');
      } else if (!isAdmin && pathname !== '/admin/unauthorized') {
        // If logged in but not an admin, redirect to an unauthorized page
        // For simplicity, we are just redirecting to home.
        router.push('/');
      }
    }
  }, [user, isAdmin, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    // While redirecting, you might want to show a loader or null
    return null;
  }
  
  const handleSignOut = async () => {
    await signOut();
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
