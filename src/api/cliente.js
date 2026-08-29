import { apiFetch } from './http'

export function obterPlanoAtivo(token) {
  return apiFetch('/cliente/plano-treino-ativo', { token })
}

export function registrarExecucao(token, payload) {
  return apiFetch('/cliente/registro-execucao', { method: 'POST', body: payload, token })
}

export function registrarProgresso(token, payload) {
  return apiFetch('/cliente/registro-progresso', { method: 'POST', body: payload, token })
}
