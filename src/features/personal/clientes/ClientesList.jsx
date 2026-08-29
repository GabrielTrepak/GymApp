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
      <span style={styles.eyebrow}>Visão geral</span>
      <h1 style={styles.title}>Seus clientes</h1>

      {carregando && <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>}
      {erro && <p style={{ color: 'var(--accent)' }}>{erro}</p>}

      {!carregando && !erro && clientes.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>Você ainda não tem clientes cadastrados.</p>
      )}

      {!carregando && !erro && clientes.length > 0 && (
        <div style={styles.table}>
          <div style={{ ...styles.row, ...styles.headRow }}>
            <span>Nome</span>
            <span>Último registro</span>
            <span>Peso atual</span>
            <span>Variação</span>
          </div>
          {clientes.map((c) => (
            <div key={c.id} style={styles.row}>
              <span style={{ fontWeight: 500 }}>{c.nome}</span>
              <span className="mono" style={styles.mono}>{formatarData(c.ultimoRegistro)}</span>
              <span className="mono" style={styles.mono}>
                {c.pesoAtual != null ? `${c.pesoAtual}kg` : '—'}
              </span>
              <span
                className="mono"
                style={{
                  ...styles.mono,
                  color:
                    c.deltaKg == null
                      ? 'var(--text-muted)'
                      : c.deltaKg < 0
                        ? 'var(--gain)'
                        : c.deltaKg > 0
                          ? 'var(--accent)'
                          : 'var(--text-muted)',
                }}
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

const styles = {
  eyebrow: {
    fontFamily: 'var(--font-data)',
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  title: { fontSize: 26, marginTop: 6, marginBottom: 24 },
  table: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    fontSize: 14,
  },
  headRow: {
    background: 'var(--bg)',
    color: 'var(--text-muted)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  mono: { fontFamily: 'var(--font-data)' },
}
