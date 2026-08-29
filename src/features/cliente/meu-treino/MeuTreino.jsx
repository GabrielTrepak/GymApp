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
    return <p className="text-muted">Carregando treino...</p>
  }

  if (erroCarregamento) {
    return <p className="text-accent">{erroCarregamento}</p>
  }

  if (!plano) {
    return (
      <div>
        <span className="font-data text-xs uppercase tracking-wider text-muted">Hoje</span>
        <h1 className="mt-1.5 text-xl">Sem treino por enquanto</h1>
        <p className="text-muted">Seu personal ainda não montou um plano de treino pra você.</p>
      </div>
    )
  }

  const dia = plano.dias[diaIndice]

  return (
    <div>
      <span className="font-data text-xs uppercase tracking-wider text-muted">{plano.nome}</span>
      <h1 className="mt-1.5 text-xl">{dia.nomeDia}</h1>

      {plano.dias.length > 1 && (
        <div className="mt-4 flex gap-2">
          {plano.dias.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setDiaIndice(i)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                i === diaIndice ? 'border-ink bg-ink text-white' : 'border-border bg-surface text-muted'
              }`}
            >
              {d.nomeDia}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
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

      <div className="my-2 min-h-[20px]">
        {mensagem && <span className="text-sm text-gain">{mensagem}</span>}
        {erroSalvar && <span className="text-sm text-accent">{erroSalvar}</span>}
      </div>

      <button
        onClick={() => handleRegistrarTreino(dia)}
        disabled={salvando}
        className="w-full rounded bg-accent py-3.5 text-[15px] font-bold text-white disabled:opacity-70"
      >
        {salvando ? 'Salvando...' : 'Registrar treino de hoje'}
      </button>
    </div>
  )
}
