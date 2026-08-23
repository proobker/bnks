// src/components/auth/StudentGoogleButton.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function StudentGoogleButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signIn.withGoogle();
      // The OAuth redirect will handle navigation to callback page
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Student Login
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Sign in with your Google account to access the student survey
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 border border-gray-300
            rounded-md shadow-sm text-sm font-medium text-gray-700
            bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-indigo-500
            ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-1.38-.26-2.72-.7-3.99h-3.41c.05.36.08.73.08 1.11 0 2.67-.77 4.8-2.05 6.29v3.16h3.57c2.08-1.92 3.28-4.74 3.28-7.9zm-9.56-4.5a5.01 5.01 0 00-4.99 4.99h-3.11v3.11h3.11c1.66 0 3.14-.61 4.22-1.64l3.65 3.65c1.34-1.34 2.08-3.04 2.08-4.86 0-2.66-.88-5.04-2.34-6.8l-3.65-3.65zm-5.12 7.5v-3.11H4.03V12h4.41c-.81 1.61-1.8 3.13-2.94 4.29l3.65 3.65c.95-.78 1.67-1.89 2.14-3.2z"></path>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Using your school Google account
      </p>
    </div>
  );
}