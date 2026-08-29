import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" replace />
  if (role && usuario.role !== role) {
    // logado, mas com o papel errado -> manda pra área dele
    return <Navigate to={usuario.role === 'Personal' ? '/personal' : '/app'} replace />
  }
  return children
}
