import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard' // New component
import { UserProtectedRoute, AdminProtectedRoute } from './components/RouteProtection'
import AccessDenied from './pages/AccessDenied' // New component

function AuthCallback() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect based on user role after auth callback
  if (user?.role === 'admin') {
    navigate('/admin/dashboard', { replace: true })
  } else {
    navigate('/dashboard', { replace: true })
  }

  return null // Render nothing during redirect
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          /* Access denied page */
          <Route path="/access-denied" element={<AccessDenied />} />

          /* User routes */
          <Route
            path="/dashboard"
            element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            }
          />

          /* Admin routes */
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          /* Catch-all */
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App