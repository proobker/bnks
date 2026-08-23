'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

// Base protected route (requires login)
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, pathname, router]);

  return children;
}

// User-only route (requires user role)
export function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== 'user' && user.role !== 'admin') {
      router.replace('/access-denied');
    }
  }, [user, pathname, router]);

  return children;
}

// Admin-only route (requires admin role)
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/access-denied');
    }
  }, [user, pathname, router]);

  return children;
}