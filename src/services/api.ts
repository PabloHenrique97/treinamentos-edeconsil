const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'https://web-production-1cfeb.up.railway.app/api'

export async function apiRequest<T>(
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
  salvarProgresso: (slug: string, aulaId: number, dados: { percentual: number; concluida: boolean }) =>
    apiRequest(`/cursos/${slug}/aulas/${aulaId}/progresso`, {
      method: 'PATCH',
      body: JSON.stringify(dados),
    }),
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

export const questoesAPI = {
  atualizar: (id: string, dados: {
    enunciado?: string
    alternativas?: { A: string; B: string; C: string; D: string }
    gabarito?: string
    explicacao?: string
  }) =>
    apiRequest(`/questoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  criar: (dados: {
    curso_id: string
    enunciado: string
    alternativas: Record<string, string>
    gabarito: string
    explicacao?: string
    ordem?: number
  }) =>
    apiRequest('/questoes', { method: 'POST', body: JSON.stringify(dados) }),

  excluir: (id: string) =>
    apiRequest(`/questoes/${id}`, { method: 'DELETE' }),
}

export const bibliotecaAPI = {
  listar: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/biblioteca${q}`)
  },

  upload: async (formData: FormData): Promise<any> => {
    const token   = localStorage.getItem('edeconsil_token')
    const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api')
    const resp = await fetch(`${baseUrl}/biblioteca`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    })
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error((err as any).erro ?? 'Erro no upload')
    }
    return resp.json()
  },

  excluir: (id: string) =>
    apiRequest(`/biblioteca/${id}`, { method: 'DELETE' }),

  registrarDownload: (id: string) =>
    apiRequest(`/biblioteca/${id}/download`, { method: 'PATCH' }),
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

export const instrutoresAPI = {
  listar: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/instrutores${q}`)
  },

  buscarPorId: (id: string) =>
    apiRequest(`/instrutores/${id}`),

  criar: (dados: unknown) =>
    apiRequest('/instrutores', {
      method: 'POST',
      body:   JSON.stringify(dados),
    }),

  atualizar: (id: string, dados: unknown) =>
    apiRequest(`/instrutores/${id}`, {
      method: 'PUT',
      body:   JSON.stringify(dados),
    }),

  excluir: (id: string) =>
    apiRequest(`/instrutores/${id}`, { method: 'DELETE' }),
}

export const turmasAPI = {
  listar: () => apiRequest<unknown[]>('/turmas'),
}

export const indicadoresAPI = {
  buscar: () => apiRequest('/admin/indicadores'),
}

export const notificacoesAPI = {
  listar: () =>
    apiRequest<{ notificacoes: unknown[]; naoLidas: number }>('/notificacoes'),

  contador: () =>
    apiRequest<{ notificacoes: number; mensagens: number; total: number }>('/notificacoes/contador'),

  marcarLida: (id: string) =>
    apiRequest(`/notificacoes/${id}/lida`, { method: 'PATCH' }),

  marcarTodasLidas: () =>
    apiRequest('/notificacoes/marcar-todas-lidas', { method: 'PATCH' }),
}

export const conversasAPI = {
  listar: () => apiRequest<any[]>('/conversas'),
  mensagens: (id: string) => apiRequest<any[]>(`/conversas/${id}/mensagens`),
}

export const modulosAPI = {
  criar: (dados: { curso_id: string; titulo: string; ordem?: number }) =>
    apiRequest('/modulos', { method: 'POST', body: JSON.stringify(dados) }),

  atualizar: (id: string, dados: { titulo: string; ordem?: number }) =>
    apiRequest(`/modulos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  excluir: (id: string) =>
    apiRequest(`/modulos/${id}`, { method: 'DELETE' }),
}

export default apiRequest
