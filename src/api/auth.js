import { apiFetch } from './http'

export function login(email, senha) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, senha } })
}

export function registrar({ nome, email, senha, role, personalTrainerId }) {
  return apiFetch('/auth/registrar', {
    method: 'POST',
    body: { nome, email, senha, role, personalTrainerId: personalTrainerId ?? null },
  })
}
