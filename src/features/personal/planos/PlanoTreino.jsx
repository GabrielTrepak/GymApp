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

  // Carrega a lista de clientes uma vez
  useEffect(() => {
    listarClientes(usuario.token)
      .then((lista) => {
        setClientes(lista)
        if (lista.length > 0) setClienteId(String(lista[0].id))
      })
      .catch(() => setErro('Não foi possível carregar seus clientes.'))
      .finally(() => setCarregandoClientes(false))
  }, [usuario.token])

  // Quando troca o cliente selecionado, busca o plano dele (se já tiver um)
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
      <span style={styles.eyebrow}>Personal</span>
      <h1 style={styles.title}>Planos de treino</h1>

      {carregandoClientes && <p style={{ color: 'var(--text-muted)' }}>Carregando clientes...</p>}

      {!carregandoClientes && clientes.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>Você ainda não tem clientes cadastrados.</p>
      )}

      {!carregandoClientes && clientes.length > 0 && (
        <>
          <label style={styles.label}>
            Cliente
            <select style={styles.select} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          {carregandoPlano && <p style={{ color: 'var(--text-muted)' }}>Carregando plano...</p>}

          {!carregandoPlano && (
            <>
              <label style={styles.label}>
                Nome do plano
                <input
                  style={styles.input}
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                  placeholder="ex: Hipertrofia - fase 1"
                />
              </label>

              {dias.map((dia, diaIndice) => (
                <div key={diaIndice} style={styles.diaCard}>
                  <div style={styles.diaHeader}>
                    <input
                      style={styles.inputDia}
                      value={dia.nomeDia}
                      onChange={(e) => atualizarNomeDia(diaIndice, e.target.value)}
                    />
                    {dias.length > 1 && (
                      <button style={styles.btnRemoverDia} onClick={() => removerDia(diaIndice)}>
                        Remover dia
                      </button>
                    )}
                  </div>

                  {dia.exercicios.map((ex, exIndice) => (
                    <div key={exIndice} style={styles.exercicioRow}>
                      <input
                        style={{ ...styles.input, flex: 2 }}
                        placeholder="Nome do exercício"
                        value={ex.nome}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'nome', e.target.value)}
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        type="number"
                        placeholder="Séries"
                        value={ex.series}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'series', e.target.value)}
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        type="number"
                        placeholder="Reps"
                        value={ex.repeticoes}
                        onChange={(e) => atualizarExercicio(diaIndice, exIndice, 'repeticoes', e.target.value)}
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        type="number"
                        placeholder="Carga (kg)"
                        value={ex.cargaSugeridaKg}
                        onChange={(e) =>
                          atualizarExercicio(diaIndice, exIndice, 'cargaSugeridaKg', e.target.value)
                        }
                      />
                      <button
                        style={styles.btnRemoverExercicio}
                        onClick={() => removerExercicio(diaIndice, exIndice)}
                        title="Remover exercício"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button style={styles.btnAdicionarExercicio} onClick={() => adicionarExercicio(diaIndice)}>
                    + Adicionar exercício
                  </button>
                </div>
              ))}

              <button style={styles.btnAdicionarDia} onClick={adicionarDia}>
                + Adicionar dia de treino
              </button>

              <div style={styles.rodape}>
                {mensagem && <span style={{ color: 'var(--gain)', fontSize: 14 }}>{mensagem}</span>}
                {erro && <span style={{ color: 'var(--accent)', fontSize: 14 }}>{erro}</span>}
                <button style={styles.btnSalvar} onClick={handleSalvar} disabled={salvando}>
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

const styles = {
  eyebrow: {
    fontFamily: 'var(--font-data)',
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  title: { fontSize: 26, marginTop: 6, marginBottom: 24 },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 16,
    maxWidth: 360,
  },
  select: {
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    background: 'var(--surface)',
    color: 'var(--text)',
  },
  input: {
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '9px 10px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    color: 'var(--text)',
  },
  inputDia: {
    border: 'none',
    borderBottom: '2px solid var(--accent)',
    padding: '4px 0',
    fontSize: 16,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--text)',
    background: 'transparent',
  },
  diaCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 20,
    marginBottom: 16,
    maxWidth: 720,
  },
  diaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  btnRemoverDia: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: 13,
    textDecoration: 'underline',
  },
  exercicioRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  btnRemoverExercicio: {
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-muted)',
    borderRadius: 6,
    width: 28,
    height: 34,
    fontSize: 16,
    lineHeight: 1,
  },
  btnAdicionarExercicio: {
    border: 'none',
    background: 'transparent',
    color: 'var(--accent)',
    fontSize: 13,
    fontWeight: 600,
    padding: '6px 0',
  },
  btnAdicionarDia: {
    border: `1px dashed var(--border)`,
    background: 'transparent',
    color: 'var(--text-muted)',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontSize: 14,
    maxWidth: 720,
    width: '100%',
    marginBottom: 24,
  },
  rodape: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  btnSalvar: {
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    background: 'var(--ink)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
  },
}
