import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/auth.jsx'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthed, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles?.length) {
    const ok = roles.includes(user?.role)
    if (!ok) return <Navigate to="/" replace />
  }
  return children
}

