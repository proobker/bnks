// src/app/(auth)/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { redirectPathForRole } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/student-login');
      return;
    }

    router.replace(redirectPathForRole(user.role));
  }, [router, user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Signing you in...</p>
    </div>
  );
}
