import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signIn, signInWithGoogle, user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      // After successful login, check role and redirect appropriately
      if (user?.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/dashboard')
      }
    } catch (err: any) {
      // Map Supabase errors to user-friendly messages
      const message = err.message?.includes('invalid login')
        ? 'Invalid email or password'
        : err.message || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // Note: Supabase handles the redirect internally after OAuth
      // The user will be redirected back to the app and then to dashboard via AuthProvider
      // Role-based redirect will be handled in the auth/callback route or AuthProvider
    } catch (err: any) {
      setError('Google sign in failed. Please try again.')
      console.error('Google sign in error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Login to Your Account</h1>
        <p className="text-center text-gray-600 mb-6">Securely access your dashboard</p>

        {error && (
          <div className="mb-4 p-3 flex items-start space-x-3 bg-red-50 text-red-600 rounded-lg">
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 15.75a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5zm0-8.25a.75.75 0 00-.75.75v3c0 .414.336.75 .75.75h3c.414 0 .75-.336.75-.75v-3a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
            </svg>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                // Clear error when user starts typing
                if (error) setError(null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-end">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                autoCorrect="off"
                spellCheck="false"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // Clear error when user starts typing
                  if (error) setError(null)
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.538 7c-1.268.405-2.572.777-3.75 1.067z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A12.022 12.022 0 00-8.625 3.075A18.055 18.055 0 013 15.75V6a18.015 18.015 0 015.25-2.312l2.312-.422a5.25 5.25 0 014.304 2.192zm4.5 0a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </div>

          {/* Forgot password link */}
          <p className="text-sm text-gray-600 text-center">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </p>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {googleLoading ? (
              <>Signing in with Google... </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H18.2V9h-3.5v3.35h-2.9V9H11v3.35H8.1v3.9h2.9v3.35h3.5v-3.35h4.36c.18.92.48 1.76.9 2.5a10.497 10.497 0 002.9 3.75c1.83-.95 3.2-2.39 4.04-4.1z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
          <p className="mt-3 text-xs text-gray-500 text-center">
            or continue with email
          </p>
        </div>
      </div>
    </div>
  )
}