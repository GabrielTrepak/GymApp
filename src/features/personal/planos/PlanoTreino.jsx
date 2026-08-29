import { useEffect, useState } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { listarClientes, obterPlanoTreino, salvarPlanoTreino } from '../../../api/personal'

function novoExercicio() {
  return { nome: '', series: 3, repeticoes: 10, cargaSugeridaKg: '', descansoSegundos: '', observacoes: '' }
}

function novoDia(numero) {
  return { nomeDia: `Treino ${numero}`, exercicios: [novoExercicio()] }
}

export default function PlanoTreino() {
  const { usuario } = useAuth()

  const [clientes, setClientes] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [nomePlano, setNomePlano] = useState('')
  const [dias, setDias] = useState([novoDia(1)])

  const [carregandoClientes, setCarregandoClientes] = useState(true)
  const [carregandoPlano, setCarregandoPlano] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    listarClientes(usuario.token)
      .then((lista) => {
        setClientes(lista)
        if (lista.length > 0) setClienteId(String(lista[0].id))
      })
      .catch(() => setErro('Não foi possível carregar seus clientes.'))
      .finally(() => setCarregandoClientes(false))
  }, [usuario.token])

  useEffect(() => {
    if (!clienteId) return

    setCarregandoPlano(true)
    setMensagem('')
    setErro('')

    obterPlanoTreino(usuario.token, clienteId)
      .then((plano) => {
        if (plano) {
          setNomePlano(plano.nome)
          setDias(
            plano.dias.map((d) => ({
              nomeDia: d.nomeDia,
              exercicios: d.exercicios.map((e) => ({
                nome: e.nome,
                series: e.series,
                repeticoes: e.repeticoes,
                cargaSugeridaKg: e.cargaSugeridaKg ?? '',
                descansoSegundos: e.descansoSegundos ?? '',
                observacoes: e.observacoes ?? '',
              })),
            }))
          )
        } else {
          setNomePlano('')
          setDias([novoDia(1)])
        }
      })
      .catch(() => setErro('Não foi possível carregar o plano desse cliente.'))
      .finally(() => setCarregandoPlano(false))
  }, [clienteId, usuario.token])

  function adicionarDia() {
    setDias((atual) => [...atual, novoDia(atual.length + 1)])
  }

  function removerDia(indice) {
    setDias((atual) => atual.filter((_, i) => i !== indice))
  }

  function atualizarNomeDia(indice, valor) {
    setDias((atual) => atual.map((d, i) => (i === indice ? { ...d, nomeDia: valor } : d)))
  }

  function adicionarExercicio(diaIndice) {
    setDias((atual) =>
      atual.map((d, i) => (i === diaIndice ? { ...d, exercicios: [...d.exercicios, novoExercicio()] } : d))
    )
  }

  function removerExercicio(diaIndice, exIndice) {
    setDias((atual) =>
      atual.map((d, i) =>
        i === diaIndice ? { ...d, exercicios: d.exercicios.filter((_, j) => j !== exIndice) } : d
      )
    )
  }

  function atualizarExercicio(diaIndice, exIndice, campo, valor) {
    setDias((atual) =>
      atual.map((d, i) =>
        i === diaIndice
          ? {
              ...d,
              exercicios: d.exercicios.map((e, j) => (j === exIndice ? { ...e, [campo]: valor } : e)),
            }
          : d
      )
    )
  }

  async function handleSalvar() {
    setSalvando(true)
    setMensagem('')
    setErro('')

    const payload = {
      nome: nomePlano || 'Plano de treino',
      dias: dias.map((d) => ({
        nomeDia: d.nomeDia,
        exercicios: d.exercicios.map((e) => ({
          nome: e.nome,
          series: Number(e.series) || 0,
          repeticoes: Number(e.repeticoes) || 0,
          cargaSugeridaKg: e.cargaSugeridaKg === '' ? null : Number(e.cargaSugeridaKg),
          descansoSegundos: e.descansoSegundos === '' ? null : Number(e.descansoSegundos),
          observacoes: e.observacoes || null,
        })),
      })),
    }

    try {
      await salvarPlanoTreino(usuario.token, clienteId, payload)
      setMensagem('Plano salvo com sucesso.')
    } catch {
      setErro('Não foi possível salvar o plano.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <span className="font-data text-xs uppercase tracking-wider text-muted">Personal</span>
      <h1 className="mb-6 mt-1.5 text-2xl">Planos de treino</h1>

      {carregandoClientes && <p className="text-muted">Carregando clientes...</p>}

      {!carregandoClientes && clientes.length === 0 && (
        <p className="text-muted">Você ainda não tem clientes cadastrados.</p>
      )}

      {!carregandoClientes && clientes.length > 0 && (
        <>
          <label className="mb-4 flex max-w-[360px] flex-col gap-1.5 text-[13px] text-muted">
            Cliente
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="rounded border border-border bg-surface px-3 py-2.5 text-[15px] text-ink"
            >
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          {carregandoPlano && <p className="text-muted">Carregando plano...</p>}

          {!carregandoPlano && (
            <>
              <label className="mb-4 flex max-w-[360px] flex-col gap-1.5 text-[13px] text-muted">
                Nome do plano
                <input
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                  placeholder="ex: Hipertrofia - fase 1"
                  className="rounded border border-border px-2.5 py-2.5 text-sm text-ink"
                />
              </label>

              {dias.map((dia, diaIndice) => (
                <div key={diaIndice} className="mb-4 max-w-[720px] rounded border border-border bg-surface p-5">
                  <div className="mb-3.5 flex items-center justify-between">
                    <input
                      value={dia.nomeDia}
                      onChange={(e) => atualizarNomeDia(diaIndice, e.target.value)}
                      className="border-0 border-b-2 border-accent bg-transparent py-1 font-display text-base font-bold text-ink"
                    />
                    {dias.length > 1 && (
                      <button
                        onClick={() => removerDia(diaIndice)}
                        className="text-xs text-muted underline"
                      >
                        Remover dia
                      </button>
                    )}
                  </div>

                  {dia.exercicios.map((ex, exIndice) => (
                    <div key={exIndice} className="mb-2 flex items-center gap-2">
                      <input
                        placeholder="Nome do exercício"
                        value={ex.nome}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'nome', e.target.value)}
                        className="flex-[2] rounded border border-border px-2.5 py-2 text-sm text-ink"
                      />
                      <input
                        type="number"
                        placeholder="Séries"
                        value={ex.series}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'series', e.target.value)}
                        className="flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={ex.repeticoes}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'repeticoes', e.target.value)}
                        className="flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
                      />
                      <input
                        type="number"
                        placeholder="Carga (kg)"
                        value={ex.cargaSugeridaKg}
                        onChange={(e) =>
                          atualizarExercicio(diaIndice, exIndice, 'cargaSugeridaKg', e.target.value)
                        }
                        className="flex-1 rounded border border-border px-2.5 py-2 text-sm text-ink"
                      />
                      <button
                        onClick={() => removerExercicio(diaIndice, exIndice)}
                        title="Remover exercício"
                        className="h-[34px] w-7 rounded border border-border bg-bg text-base leading-none text-muted"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => adicionarExercicio(diaIndice)}
                    className="py-1.5 text-[13px] font-semibold text-accent"
                  >
                    + Adicionar exercício
                  </button>
                </div>
              ))}

              <button
                onClick={adicionarDia}
                className="mb-6 w-full max-w-[720px] rounded border border-dashed border-border px-4 py-2.5 text-sm text-muted"
              >
                + Adicionar dia de treino
              </button>

              <div className="flex items-center gap-4">
                {mensagem && <span className="text-sm text-gain">{mensagem}</span>}
                {erro && <span className="text-sm text-accent">{erro}</span>}
                <button
                  onClick={handleSalvar}
                  disabled={salvando}
                  className="rounded bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {salvando ? 'Salvando...' : 'Salvar plano'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
