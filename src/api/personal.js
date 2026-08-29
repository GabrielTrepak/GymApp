import { apiFetch } from './http'

export function listarClientes(token) {
  return apiFetch('/personal/clientes', { token })
}
