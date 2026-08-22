// src/components/auth/TeacherLoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function TeacherLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn.withEmailPassword(email, password);
      // Redirect will be handled by AuthContext or callback
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Teacher Login
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Sign in to access school assessment tools
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isLoading ? 'opacity-50' : ''}`}
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent
            rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-indigo-500 disabled:opacity-50`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 mt-4">
        Don't have an account? Contact administrator to get access.
      </div>
    </div>
  );
}