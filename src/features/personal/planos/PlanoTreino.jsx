import { Fragment, useEffect, useState } from 'react'
import { useAuth } from '../../../auth/AuthContext'
import { listarClientes, obterPlanoTreino, salvarPlanoTreino } from '../../../api/personal'

function novoExercicio() {
  return { nome: '', series: 3, repeticoes: 10, cargaSugeridaKg: '', descansoSegundos: '', observacoes: '' }
}

function novoDia(numero) {
  return { nomeDia: `Treino ${numero}`, exercicios: [novoExercicio()] }
}

// Uma única grade compartilhada por cabeçalho + todas as linhas de exercício,
// pra garantir que as colunas fiquem alinhadas entre si (cada <div grid> seu
// próprio cálculo de largura faria as colunas desalinharem de linha pra linha).
const gridColunas = 'grid grid-cols-[2fr_0.7fr_0.7fr_0.9fr_32px] gap-x-2 gap-y-2 items-center'

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
    <div className="max-w-4xl">
      <span className="font-data text-xs uppercase tracking-wider text-muted">Personal</span>
      <h1 className="mt-1.5 text-2xl">Planos de treino</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Escolha o cliente, dê um nome ao plano e monte os dias de treino com os exercícios.
      </p>

      {carregandoClientes && <p className="text-muted">Carregando clientes...</p>}

      {!carregandoClientes && clientes.length === 0 && (
        <p className="text-muted">Você ainda não tem clientes cadastrados.</p>
      )}

      {!carregandoClientes && clientes.length > 0 && (
        <>
          <div className="mb-5 grid max-w-xl grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
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

            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-muted">
              Nome do plano
              <input
                value={nomePlano}
                onChange={(e) => setNomePlano(e.target.value)}
                placeholder="ex: Hipertrofia - fase 1"
                className="rounded border border-border px-3 py-2.5 text-[15px] text-ink"
              />
            </label>
          </div>

          {carregandoPlano && <p className="text-muted">Carregando plano...</p>}

          {!carregandoPlano && (
            <>
              {dias.map((dia, diaIndice) => (
                <div key={diaIndice} className="mb-4 overflow-hidden rounded border border-border bg-surface p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        Dia de treino
                      </span>
                      <input
                        value={dia.nomeDia}
                        onChange={(e) => atualizarNomeDia(diaIndice, e.target.value)}
                        className="border-0 border-b-2 border-accent bg-transparent py-1 font-display text-lg font-bold text-ink focus:outline-none"
                      />
                    </div>
                    {dias.length > 1 && (
                      <button
                        onClick={() => removerDia(diaIndice)}
                        className="text-xs text-muted underline"
                      >
                        Remover {dia.nomeDia.toLowerCase()}
                      </button>
                    )}
                  </div>

                  {/* Cabeçalho + todas as linhas de exercício são filhos diretos
                      DESTA mesma grade, pra ficarem sempre alinhados entre si */}
                  <div className={gridColunas}>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Exercício</span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Séries</span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Reps</span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">Carga (kg)</span>
                    <span />

                    {dia.exercicios.map((ex, exIndice) => (
                      <Fragment key={exIndice}>
                        <input
                          placeholder="ex: Supino reto"
                          value={ex.nome}
                          onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'nome', e.target.value)}
                          className="w-full min-w-0 rounded border border-border px-2.5 py-2 text-sm text-ink"
                        />
                        <input
                          type="number"
                          min="0"
                          value={ex.series}
                          onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'series', e.target.value)}
                          className="w-full min-w-0 rounded border border-border px-2.5 py-2 text-sm text-ink"
                        />
                        <input
                          type="number"
                          min="0"
                          value={ex.repeticoes}
                          onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'repeticoes', e.target.value)}
                          className="w-full min-w-0 rounded border border-border px-2.5 py-2 text-sm text-ink"
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="opcional"
                          value={ex.cargaSugeridaKg}
                          onChange={(e) =>
                            atualizarExercicio(diaIndice, exIndice, 'cargaSugeridaKg', e.target.value)
                          }
                          className="w-full min-w-0 rounded border border-border px-2.5 py-2 text-sm text-ink placeholder:text-xs"
                        />
                        <button
                          onClick={() => removerExercicio(diaIndice, exIndice)}
                          title="Remover exercício"
                          className="flex h-[34px] w-8 items-center justify-center rounded border border-border bg-bg text-base leading-none text-muted hover:bg-border"
                        >
                          ×
                        </button>
                      </Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => adicionarExercicio(diaIndice)}
                    className="mt-3 py-1.5 text-[13px] font-semibold text-accent"
                  >
                    + Adicionar exercício
                  </button>
                </div>
              ))}

              <button
                onClick={adicionarDia}
                className="mb-6 w-full rounded border border-dashed border-border px-4 py-2.5 text-sm text-muted hover:bg-surface"
              >
                + Adicionar dia de treino
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSalvar}
                  disabled={salvando}
                  className="rounded bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {salvando ? 'Salvando...' : 'Salvar plano'}
                </button>
                {mensagem && <span className="text-sm text-gain">{mensagem}</span>}
                {erro && <span className="text-sm text-accent">{erro}</span>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
