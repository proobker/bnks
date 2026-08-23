'use client';

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AccessDeniedPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/assessment')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-[14px] shadow-card p-10 text-center max-w-md">
        <svg className="h-12 w-12 text-danger mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-ink tracking-tight mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-primary hover:bg-primary-hover transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  )
}
