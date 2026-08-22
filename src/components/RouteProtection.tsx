import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Base protected route (requires login)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// User-only route (requires user role)
function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'user' && user.role !== 'admin') {
    // Redirect to appropriate dashboard or show access denied
    return <Navigate to="/access-denied" replace />
  }

  return children
}

// Admin-only route (requires admin role)
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user.role !== 'admin') {
    // Redirect to user dashboard or show access denied
    return <Navigate to="/access-denied" replace />
  }

  return children
}

export { ProtectedRoute, UserProtectedRoute, AdminProtectedRoute }