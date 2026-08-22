import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-center">
        <svg className="h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  )
}