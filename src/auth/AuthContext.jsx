import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gymapp_auth'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Ao abrir o app, tenta recuperar a sessão salva (evita ter que logar de novo a cada F5)
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setCarregando(false)
  }, [])

  async function login(email, senha) {
    const resposta = await loginApi(email, senha)
    const dadosUsuario = { token: resposta.token, nome: resposta.nome, role: resposta.role, email }
    setUsuario(dadosUsuario)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosUsuario))
    return dadosUsuario
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
