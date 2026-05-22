export const TOKEN_KEY   = 'edeconsil_token'
export const USUARIO_KEY = 'edeconsil_usuario'

export function salvarSessao(token: string, usuario: unknown) {
  localStorage.setItem(TOKEN_KEY,   token)
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USUARIO_KEY)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuario<T = unknown>(): T | null {
  const raw = localStorage.getItem(USUARIO_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as T }
  catch { return null }
}

export function sessaoAtiva(): boolean {
  return !!getToken()
}
