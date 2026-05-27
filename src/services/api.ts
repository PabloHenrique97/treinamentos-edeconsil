const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'https://web-production-1cfeb.up.railway.app/api'

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('edeconsil_token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error((data as { erro?: string }).erro ?? `Erro ${response.status}`)
  }

  return data as T
}

export const authAPI = {
  login: (cpf: string, senha: string) =>
    apiRequest<{
      token: string
      usuario: {
        id: string
        nome: string
        email: string
        cpf: string
        perfil: 'admin' | 'instrutor' | 'colaborador'
        matricula: string
        cr: string
        cargo: string
        setor: string
        turma_id: string | null
        foto_url: string | null
      }
      expiraEm: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cpf, senha }),
    }),

  verificar: () =>
    apiRequest<{ usuario: unknown; valido: boolean }>('/auth/verificar'),
}

export const usuariosAPI = {
  listar: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/usuarios${query}`)
  },
  criar: (dados: unknown) =>
    apiRequest('/usuarios', { method: 'POST', body: JSON.stringify(dados) }),
  buscar: (id: string) => apiRequest(`/usuarios/${id}`),
  atualizar: (id: string, dados: unknown) =>
    apiRequest(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
  importarCsv: (alunos: unknown[]) =>
    apiRequest('/usuarios/importar-csv', {
      method: 'POST',
      body: JSON.stringify({ alunos }),
    }),
  deletar: (id: string) =>
    apiRequest(`/usuarios/${id}`, { method: 'DELETE' }),
}

export const cursosAPI = {
  listar: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/cursos${query}`)
  },
  buscarPorSlug: (slug: string) => apiRequest(`/cursos/${slug}`),
  aulas: (slug: string) => apiRequest<unknown[]>(`/cursos/${slug}/aulas`),
  meusCursos: () => apiRequest('/meus-cursos'),
  me: () => apiRequest('/me'),
  criar: (dados: unknown) =>
    apiRequest('/cursos', {
      method: 'POST',
      body:   JSON.stringify(dados),
    }),
  atualizar: (id: string, dados: unknown) =>
    apiRequest(`/cursos/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(dados),
    }),
  atualizarStatus: (id: string, status: string) =>
    apiRequest(`/cursos/${id}/status`, {
      method: 'PATCH',
      body:   JSON.stringify({ status }),
    }),
  excluir: (id: string) =>
    apiRequest(`/cursos/${id}`, { method: 'DELETE' }),
  metricas: () =>
    apiRequest('/admin/metricas'),
}

export const progressoAPI = {
  salvar: (dados: unknown) =>
    apiRequest('/progresso', { method: 'POST', body: JSON.stringify(dados) }),
  buscarPorCurso: (cursoId: string) =>
    apiRequest(`/progresso/${cursoId}`),
}

export const provaAPI = {
  buscar: (slug: string) =>
    apiRequest(`/cursos/${slug}/prova`),

  submeter: (slug: string, respostas: Record<string, string>) =>
    apiRequest(`/cursos/${slug}/prova/submeter`, {
      method: 'POST',
      body: JSON.stringify({ respostas }),
    }),
}

export const bibliotecaAPI = {
  listar: (status?: string) => {
    const query = status ? `?status=${status}` : ''
    return apiRequest(`/biblioteca${query}`)
  },
}

export const certificadosAPI = {
  meusCertificados: () =>
    apiRequest('/meus-certificados'),

  verificar: (codigo: string) =>
    apiRequest(`/certificados/verificar/${codigo}`),

  listarAdmin: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/admin/certificados${q}`)
  },
}

export default apiRequest
