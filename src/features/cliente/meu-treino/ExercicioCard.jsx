import { useState } from 'react'

// Elemento assinatura da tela do cliente: em vez de uma barra de progresso
// genérica, cada série concluída "empilha" uma anilha — remete direto ao
// objeto real do treino (peso/anilha) em vez de uma métrica abstrata.

export default function ExercicioCard({ nome, series, repeticoes, cargaSugeridaKg }) {
  const [feitas, setFeitas] = useState(0)

  function marcarSerie() {
    setFeitas((f) => Math.min(f + 1, series))
  }

  return (
    <div style={styles.card}>
      <div style={styles.info}>
        <h3 style={styles.nome}>{nome}</h3>
        <p style={styles.detalhe}>
          <span className="mono" style={styles.mono}>{series}x{repeticoes}</span>
          {' · '}
          <span className="mono" style={styles.mono}>{cargaSugeridaKg}kg</span>
        </p>
        <button style={styles.btn} onClick={marcarSerie} disabled={feitas >= series}>
          {feitas >= series ? 'Concluído' : 'Marcar série'}
        </button>
      </div>

      <div style={styles.stack} aria-label={`${feitas} de ${series} séries feitas`}>
        {Array.from({ length: series }).map((_, i) => {
          const preenchida = i < feitas
          return (
            <div
              key={i}
              style={{
                ...styles.plate,
                background: preenchida ? 'var(--accent)' : 'var(--border)',
                width: 40 - i * 3, // anilhas de baixo pra cima diminuem, como numa barra real
              }}
            />
          )
        }).reverse()}
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 12,
  },
  info: { display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  nome: { fontSize: 16 },
  detalhe: { margin: 0, fontSize: 14, color: 'var(--text-muted)' },
  mono: { fontFamily: 'var(--font-data)', color: 'var(--text)' },
  btn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid var(--ink)',
    background: 'var(--ink)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
  },
  stack: {
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    gap: 3,
    width: 48,
  },
  plate: {
    height: 8,
    borderRadius: 3,
    transition: 'background 0.15s ease',
  },
}
