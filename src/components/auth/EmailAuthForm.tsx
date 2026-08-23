// src/components/auth/EmailAuthForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  signUpWithEmailPassword,
  getCurrentUserRole,
} from '@/lib/supabase';
import { redirectPathForRole } from '@/lib/auth';

interface EmailAuthFormProps {
  role: 'teacher' | 'student';
  mode: 'login' | 'signup';
}

const copy = {
  teacher: {
    loginTitle: 'Teacher Login',
    loginSubtitle: 'Sign in to access school assessment tools',
    signupTitle: 'Teacher Sign Up',
    signupSubtitle: 'Create an account to run school assessments',
  },
  student: {
    loginTitle: 'Student Login',
    loginSubtitle: 'Sign in to take the student survey',
    signupTitle: 'Student Sign Up',
    signupSubtitle: 'Create an account to complete the student survey',
  },
};

export default function EmailAuthForm({ role, mode }: EmailAuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const t = copy[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await signIn.withEmailPassword(email, password);
        const currentRole = await getCurrentUserRole();
        router.replace(redirectPathForRole(currentRole));
      } else {
        const { needsEmailConfirmation } = await signUpWithEmailPassword(
          email,
          password,
          role
        );
        if (needsEmailConfirmation) {
          setConfirmationSent(true);
        } else {
          router.replace(redirectPathForRole(role));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Confirm your email
        </h2>
        <p className="text-gray-600 text-center">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then sign in.
        </p>
        <div className="mt-6 text-center">
          <Link
            href={`/${role}-login`}
            className="text-indigo-600 hover:underline font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {mode === 'login' ? t.loginTitle : t.signupTitle}
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        {mode === 'login' ? t.loginSubtitle : t.signupSubtitle}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isLoading}
            placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading
            ? 'Please wait...'
            : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 mt-4">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href={`/${role}-signup`} className="text-indigo-600 hover:underline font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href={`/${role}-login`} className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
