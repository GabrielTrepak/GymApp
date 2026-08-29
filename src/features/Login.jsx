import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const usuario = await login(email, senha)
      navigate(usuario.role === 'Personal' ? '/personal' : '/app')
    } catch {
      setErro('E-mail ou senha inválidos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded border border-border bg-surface p-8"
      >
        <span className="font-data text-xs uppercase tracking-wider text-muted">
          Acompanhamento de treino
        </span>
        <h1 className="text-3xl">Entrar</h1>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            required
            className="rounded border border-border px-3 py-2.5 text-base text-ink"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-muted">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            required
            className="rounded border border-border px-3 py-2.5 text-base text-ink"
          />
        </label>

        {erro && <p className="m-0 text-sm text-accent">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="mt-2 rounded bg-accent py-3 text-base font-semibold text-white disabled:opacity-70"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
