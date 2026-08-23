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
          className="text-sm font-medium text-gray-500 hover:text-indigo-700"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-md px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
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
          className="text-sm font-medium text-gray-500 hover:text-indigo-700"
        >
          Admin
        </Link>
      )}
      <span className="hidden sm:inline text-sm text-gray-500">{user.email}</span>
      <button
        onClick={() => signOut()}
        className="text-sm font-medium text-gray-500 hover:text-indigo-700 cursor-pointer"
      >
        Sign Out
      </button>
    </div>
  );
}
