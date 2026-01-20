'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import type { User } from 'firebase/auth';

interface UseAuthRedirectProps {
  to: string;
  condition: (user: User | null) => boolean;
}

export const useAuthRedirect = ({ to, condition }: UseAuthRedirectProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && condition(user)) {
      router.push(to);
    }
  }, [user, loading, to, condition, router]);
};
