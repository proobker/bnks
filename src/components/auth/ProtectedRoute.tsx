// src/components/auth/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'teacher' | 'student'; // Optional role-based protection
}

export default function ProtectedRoute({
  children,
  role
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Redirect to appropriate login page based on role
      router.replace(role === 'teacher' ? '/teacher-login' : '/student-login');
      return;
    }

    // Role-based protection (if specified)
    if (role) {
      // For now, we'll determine role by login method or email pattern
      // In production, you'd check user_metadata.role or similar
      const isTeacherLogin = user.email?.includes('@teacher') ||
                            // Add logic to determine if user is teacher
                            false; // Placeholder - would check actual role from DB or metadata
      const isStudentLogin = user.email?.includes('@student') ||
                            // Add logic to determine if user is student
                            false; // Placeholder

      if ((role === 'teacher' && !isTeacherLogin) ||
          (role === 'student' && !isStudentLogin)) {
        // Redirect to appropriate login page
        router.replace(role === 'teacher' ? '/teacher-login' : '/student-login');
        return;
      }
    }
  }, [router, user, isLoading, role]);

  if (isLoading) {
    return <div className="min-h-flex items-center justify-center">Loading...</div>;
  }

  return children;
}