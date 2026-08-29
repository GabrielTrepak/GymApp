import { createContext, useContext, useState } from 'react'

// Contexto de autenticação. Por enquanto o login é mockado (sem chamada real
// de API) — quando o backend estiver pronto, troque `loginMock` por uma
// chamada a /api/auth/login e guarde o token retornado.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null) // { nome, role: 'Personal' | 'Cliente' }

  function loginMock(email, role) {
    setUsuario({ nome: email.split('@')[0], email, role })
  }

  function logout() {
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, loginMock, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
