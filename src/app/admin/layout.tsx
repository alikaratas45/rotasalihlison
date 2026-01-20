'use client';

import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useUser } from '@/firebase';
import { AdminLayout } from '@/components/admin/layout';
import { notFound, usePathname } from 'next/navigation';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Do not apply protection to the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useAuthRedirect({ to: '/admin/login', condition: (user) => !user });
  
  const { profile, loading } = useUser();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-lg">Loading Admin Panel...</div>
        </div>
    );
  }

  // After loading, if there's no profile or the user is not an admin, show not found.
  if (!profile?.isAdmin) {
    return notFound();
  }

  return <AdminLayout>{children}</AdminLayout>;
}
