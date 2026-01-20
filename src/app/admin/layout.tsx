'use client';

import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useUser } from '@/firebase';
import { AdminLayout } from '@/components/admin/layout';
import { notFound } from 'next/navigation';

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthRedirect({ to: '/admin/login', condition: (user) => !user });
  
  const { profile, loading } = useUser();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-lg">Loading Admin Panel...</div>
        </div>
    );
  }

  if (!profile?.isAdmin) {
    return notFound();
  }

  return <AdminLayout>{children}</AdminLayout>;
}
