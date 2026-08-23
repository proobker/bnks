// src/components/auth/NavAuth.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NavAuth() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="ml-4 flex items-center space-x-3">
        <Link
          href="/login"
          className="text-sm font-medium text-slate-500 hover:text-primary-hover"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-lg shadow-primary px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="ml-4 flex items-center space-x-4">
      {user.role === 'admin' && (
        <Link
          href="/admin/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-primary-hover"
        >
          Admin
        </Link>
      )}
      <span className="hidden sm:inline text-sm text-slate-500">{user.email}</span>
      <button
        onClick={() => signOut()}
        className="text-sm font-medium text-slate-500 hover:text-primary-hover cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}
