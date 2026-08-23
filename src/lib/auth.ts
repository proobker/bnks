export const redirectPathForRole = (role?: string | null): string => {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'teacher') return '/assessment'
  return '/student'
}
