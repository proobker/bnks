// src/app/(auth)/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Determine redirect based on user metadata or other flags
      // For now, we'll check if they have teacher-like email or use a heuristic
      const isTeacher = user.email?.includes('@teacher') ||
                       // Or check if they have a teacher profile in DB
                       false; // Placeholder - would check actual user role/profile

      // Redirect to appropriate dashboard
      if (isTeacher) {
        router.replace('/app/assessment');
      } else {
        router.replace('/app/student');
      }
    }
  }, [router, user]);

  return null; // Redirect happens in useEffect
}