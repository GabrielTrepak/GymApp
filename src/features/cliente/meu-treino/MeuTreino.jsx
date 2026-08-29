import { useEffect, useState } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { obterPlanoAtivo, registrarExecucao } from '../../../api/cliente'
import ExercicioCard from './ExercicioCard'

export default function MeuTreino() {
  const { usuario } = useAuth()

  const [plano, setPlano] = useState(null)
  const [diaIndice, setDiaIndice] = useState(0)
  const [feitasPorExercicio, setFeitasPorExercicio] = useState({})

  const [carregando, setCarregando] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erroSalvar, setErroSalvar] = useState('')

  useEffect(() => {
    obterPlanoAtivo(usuario.token)
      .then(setPlano)
      .catch((err) => {
        // 404 aqui só significa "ainda não tem plano", não é uma falha de verdade
        if (err.status !== 404) setErroCarregamento('Não foi possível carregar seu treino.')
      })
      .finally(() => setCarregando(false))
  }, [usuario.token])

  function marcarSerie(exercicioId, totalSeries) {
    setFeitasPorExercicio((atual) => {
      const feitasAtuais = atual[exercicioId] ?? 0
      return { ...atual, [exercicioId]: Math.min(feitasAtuais + 1, totalSeries) }
    })
  }

  async function handleRegistrarTreino(dia) {
    setSalvando(true)
    setMensagem('')
    setErroSalvar('')

    const payload = {
      diaDeTreinoId: dia.id,
      concluido: dia.exercicios.every((e) => (feitasPorExercicio[e.id] ?? 0) >= e.series),
      observacoes: null,
      cargas: dia.exercicios.map((e) => ({
        exercicioDoDiaId: e.id,
        seriesFeitas: feitasPorExercicio[e.id] ?? 0,
        repeticoesFeitas: e.repeticoes,
        cargaUtilizadaKg: e.cargaSugeridaKg ?? 0,
      })),
    }

    try {
      await registrarExecucao(usuario.token, payload)
      setMensagem('Treino registrado! Seu personal vai ver essa atualização.')
    } catch {
      setErroSalvar('Não foi possível salvar o registro do treino.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <p style={{ color: 'var(--text-muted)' }}>Carregando treino...</p>
  }

  if (erroCarregamento) {
    return <p style={{ color: 'var(--accent)' }}>{erroCarregamento}</p>
  }

  if (!plano) {
    return (
      <div>
        <span style={styles.eyebrow}>Hoje</span>
        <h1 style={styles.title}>Sem treino por enquanto</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Seu personal ainda não montou um plano de treino pra você.
        </p>
      </div>
    )
  }

  const dia = plano.dias[diaIndice]

  return (
    <div>
      <span style={styles.eyebrow}>{plano.nome}</span>
      <h1 style={styles.title}>{dia.nomeDia}</h1>

      {plano.dias.length > 1 && (
        <div style={styles.tabs}>
          {plano.dias.map((d, i) => (
            <button
              key={d.id}
              style={{ ...styles.tab, ...(i === diaIndice ? styles.tabAtiva : {}) }}
              onClick={() => setDiaIndice(i)}
            >
              {d.nomeDia}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {dia.exercicios.map((ex) => (
          <ExercicioCard
            key={ex.id}
            nome={ex.nome}
            series={ex.series}
            repeticoes={ex.repeticoes}
            cargaSugeridaKg={ex.cargaSugeridaKg}
            feitas={feitasPorExercicio[ex.id] ?? 0}
            onMarcarSerie={() => marcarSerie(ex.id, ex.series)}
          />
        ))}
      </div>

      <div style={styles.rodape}>
        {mensagem && <span style={{ color: 'var(--gain)', fontSize: 14 }}>{mensagem}</span>}
        {erroSalvar && <span style={{ color: 'var(--accent)', fontSize: 14 }}>{erroSalvar}</span>}
      </div>

      <button style={styles.btnSalvar} onClick={() => handleRegistrarTreino(dia)} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Registrar treino de hoje'}
      </button>
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
  tabs: { display: 'flex', gap: 8, marginTop: 16 },
  tab: {
    padding: '6px 14px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 500,
  },
  tabAtiva: {
    background: 'var(--ink)',
    color: '#fff',
    borderColor: 'var(--ink)',
  },
  rodape: { marginTop: 8, marginBottom: 8, minHeight: 20 },
  btnSalvar: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 'var(--radius)',
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
  },
}
