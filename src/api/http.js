// Endereço da API .NET. Se você rodar em outra porta, ajuste aqui
// (ou troque por uma variável de ambiente do Vite: import.meta.env.VITE_API_URL).
const API_BASE_URL = 'http://localhost:5000/api'

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const texto = await response.text().catch(() => '')
    const erro = new Error(texto || `Erro ${response.status} ao chamar ${path}`)
    erro.status = response.status
    throw erro
  }

  if (response.status === 204) return null

  // Algumas respostas vêm com status 200 mas corpo vazio (ex: "salvo com sucesso"
  // sem retornar dado nenhum) — tentar fazer .json() direto nelas quebraria.
  const texto = await response.text()
  return texto ? JSON.parse(texto) : null
}
