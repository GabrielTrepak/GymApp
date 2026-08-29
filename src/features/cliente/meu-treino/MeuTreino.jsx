import ExercicioCard from './ExercicioCard'

// Dados de exemplo — substituir por GET /api/cliente/plano-treino-ativo
const exerciciosMock = [
  { nome: 'Supino reto', series: 4, repeticoes: 10, cargaSugeridaKg: 40 },
  { nome: 'Puxada frente', series: 3, repeticoes: 12, cargaSugeridaKg: 32 },
  { nome: 'Agachamento livre', series: 4, repeticoes: 8, cargaSugeridaKg: 60 },
]

export default function MeuTreino() {
  return (
    <div>
      <span style={styles.eyebrow}>Hoje · Treino A</span>
      <h1 style={styles.title}>Peito, costas e pernas</h1>

      <div style={{ marginTop: 20 }}>
        {exerciciosMock.map((ex) => (
          <ExercicioCard key={ex.nome} {...ex} />
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
  title: { fontSize: 22, marginTop: 6 },
}
