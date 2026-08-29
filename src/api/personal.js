import { apiFetch } from './http'

export function listarClientes(token) {
  return apiFetch('/personal/clientes', { token })
}

export function obterPlanoTreino(token, clienteId) {
  return apiFetch(`/personal/clientes/${clienteId}/plano-treino`, { token })
}

export function salvarPlanoTreino(token, clienteId, plano) {
  return apiFetch(`/personal/clientes/${clienteId}/plano-treino`, {
    method: 'POST',
    body: plano,
    token,
  })
}
