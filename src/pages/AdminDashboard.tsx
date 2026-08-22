import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers()
    } else {
      navigate('/dashboard', { replace: true })
    }
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, website, role, updated_at')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      await fetchUsers() // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to update user role')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      {error && (
        <p className="mb-4 p-3 bg-red-50 text-red-600 rounded w-full max-w-xs">
          {error}
        </p>
      )}
      {!user ? (
        <p className="text-gray-600">You are not logged in.</p>
      ) : (
        <div className="w-full max-w-4xl space-y-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>

            {users.length === 0 ? (
              <p className="text-gray-600">No users found.</p>
            ) : (
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id} className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{user.username || 'Unnamed'}</h3>
                        <p className="text-sm text-gray-500">{user.id}</p>
                      </div>
                      <div className="space-x-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                          className="border rounded px-3 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:underline font-medium"
            >
              Back to User Dashboard
            </button>
          </p>
        </div>
      )}
    </div>
  )
}