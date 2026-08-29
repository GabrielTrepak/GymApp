// Dados de exemplo — substituir por GET /api/personal/clientes
const clientesMock = [
  { id: 1, nome: 'Marina Souza', ultimoRegistro: '28/08', pesoAtual: 62.4, deltaKg: -0.6 },
  { id: 2, nome: 'Rafael Lima', ultimoRegistro: '27/08', pesoAtual: 81.1, deltaKg: 1.2 },
  { id: 3, nome: 'Bianca Alves', ultimoRegistro: '25/08', pesoAtual: 58.0, deltaKg: 0.0 },
]

export default function ClientesList() {
  return (
    <div>
      <span style={styles.eyebrow}>Visão geral</span>
      <h1 style={styles.title}>Seus clientes</h1>

      <div style={styles.table}>
        <div style={{ ...styles.row, ...styles.headRow }}>
          <span>Nome</span>
          <span>Último registro</span>
          <span>Peso atual</span>
          <span>Variação</span>
        </div>
        {clientesMock.map((c) => (
          <div key={c.id} style={styles.row}>
            <span style={{ fontWeight: 500 }}>{c.nome}</span>
            <span className="mono" style={styles.mono}>{c.ultimoRegistro}</span>
            <span className="mono" style={styles.mono}>{c.pesoAtual}kg</span>
            <span
              className="mono"
              style={{
                ...styles.mono,
                color: c.deltaKg < 0 ? 'var(--gain)' : c.deltaKg > 0 ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {c.deltaKg > 0 ? '+' : ''}{c.deltaKg}kg
            </span>
          </div>
        ))}
      </div>
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
