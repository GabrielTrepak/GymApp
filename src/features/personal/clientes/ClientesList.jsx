import { useEffect, useState } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { listarClientes } from '../../../api/personal'

function formatarData(iso) {
  if (!iso) return '—'
  const data = new Date(iso)
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function ClientesList() {
  const { usuario } = useAuth()
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarClientes(usuario.token)
      .then(setClientes)
      .catch(() => setErro('Não foi possível carregar os clientes. A API está rodando?'))
      .finally(() => setCarregando(false))
  }, [usuario.token])

  return (
    <div>
      <span className="font-data text-xs uppercase tracking-wider text-muted">Visão geral</span>
      <h1 className="mb-6 mt-1.5 text-2xl">Seus clientes</h1>

      {carregando && <p className="text-muted">Carregando...</p>}
      {erro && <p className="text-accent">{erro}</p>}

      {!carregando && !erro && clientes.length === 0 && (
        <p className="text-muted">Você ainda não tem clientes cadastrados.</p>
      )}

      {!carregando && !erro && clientes.length > 0 && (
        <div className="overflow-hidden rounded border border-border bg-surface">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border bg-bg px-5 py-3.5 text-xs uppercase tracking-wide text-muted">
            <span>Nome</span>
            <span>Último registro</span>
            <span>Peso atual</span>
            <span>Variação</span>
          </div>
          {clientes.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border px-5 py-3.5 text-sm last:border-b-0"
            >
              <span className="font-medium">{c.nome}</span>
              <span className="font-data">{formatarData(c.ultimoRegistro)}</span>
              <span className="font-data">{c.pesoAtual != null ? `${c.pesoAtual}kg` : '—'}</span>
              <span
                className={`font-data ${
                  c.deltaKg == null
                    ? 'text-muted'
                    : c.deltaKg < 0
                      ? 'text-gain'
                      : c.deltaKg > 0
                        ? 'text-accent'
                        : 'text-muted'
                }`}
              >
                {c.deltaKg != null ? `${c.deltaKg > 0 ? '+' : ''}${c.deltaKg}kg` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
