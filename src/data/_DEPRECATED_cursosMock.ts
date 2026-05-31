export interface AulaMock {
  id: number
  numero: number
  titulo: string
  descricao: string
  duracao: string
  status: 'Incompleta' | 'Em andamento' | 'Concluída'
  progresso: number
  videoUrl: string | null
  videoDisponivel: boolean
  materiais: {
    nome: string
    tipo: 'pdf' | 'pptx' | 'xlsx' | 'dwg'
    tamanho: string
    url: string
  }[]
}

export interface ModuloMock {
  id: number
  titulo: string
  totalAulas: number
  aulasConcluidas: number
  progresso: number
  aberto: boolean
  aulas: AulaMock[]
}

export interface CursoMock {
  id: string
  slug?: string
  titulo: string
  subtitulo: string
  descricao: string
  categoria: string
  cargo: string
  trilha: string
  cargaHoraria: string
  instrutor: string
  totalAulas: number
  aulasConcluidas: number
  progresso: number
  status: 'Em andamento' | 'Concluído' | 'Não iniciado'
  cor: string
  icone: string
  notaMinimaAprovacao: number
  live?: {
    data: string
    hora: string
    titulo: string
    status: 'Em breve' | 'Ao vivo' | 'Encerrado'
  }
  calendario: {
    inicio: string
    fim: string
  }
  modulos: ModuloMock[]
}

export const cursosMockColaborador: CursoMock[] = [
  {
    id: 'coord-suprimentos',
    slug: 'coord-suprimentos',
    titulo: 'Coordenação de Suprimentos',
    subtitulo: 'Processos e procedimentos da Coordenação de Suprimentos',
    descricao: 'Treinamento completo sobre os processos internos da Coordenação de Suprimentos da Edeconsil, cobrindo aquisição, almoxarifado, controle de fornecedores, notas fiscais e ferramentas.',
    categoria: 'Gestão e Suprimentos',
    cargo: 'Coordenação de Suprimentos',
    trilha: 'Gestão e Suprimentos',
    cargaHoraria: '4h',
    instrutor: 'Equipe Edeconsil',
    totalAulas: 5,
    aulasConcluidas: 0,
    progresso: 0,
    status: 'Em andamento',
    cor: '#0d9488',
    icone: '📦',
    notaMinimaAprovacao: 70,
    calendario: { inicio: '01/05/2025', fim: '31/12/2025' },
    modulos: [
      {
        id: 1,
        titulo: 'MÓDULO 1 - Coordenação de Suprimentos',
        totalAulas: 5,
        aulasConcluidas: 0,
        progresso: 0,
        aberto: true,
        aulas: [
          {
            id: 1, numero: 1,
            titulo: 'Apresentação da Coordenação de Suprimentos',
            descricao: 'Visão geral da coordenação de suprimentos, estrutura organizacional e responsabilidades da área na Edeconsil.',
            duracao: '~48 min', status: 'Incompleta', progresso: 0,
            videoUrl: '/treinamentos-edeconsil/videos/coord-suprimentos/aula-01.mp4',
            videoDisponivel: true,
            materiais: [{ nome: '01 - Apresentação da Coordenação de Suprimentos.pptx', tipo: 'pptx', tamanho: '—', url: '/treinamentos-edeconsil/materiais/coord-suprimentos/01 - Apresentação da Coordenação de Suprimentos.pptx' }],
          },
          {
            id: 2, numero: 2,
            titulo: 'PGI-CSU-002 — Aquisição e Almoxarifado',
            descricao: 'Processos de aquisição de materiais, gestão do almoxarifado e procedimentos internos conforme PGI-CSU-002.',
            duracao: '~48 min', status: 'Incompleta', progresso: 0,
            videoUrl: '/treinamentos-edeconsil/videos/coord-suprimentos/aula-02.mp4',
            videoDisponivel: true,
            materiais: [{ nome: '02 - Aquisição e Almoxarifado PGI-CSU-002.pptx', tipo: 'pptx', tamanho: '—', url: '/treinamentos-edeconsil/materiais/coord-suprimentos/02 - Aquisição e Almoxarifado PGI-CSU-002.pptx' }],
          },
          {
            id: 3, numero: 3,
            titulo: 'PG-CSU-001 — Controle de Produtos e Serviços Fornecidos Externamente',
            descricao: 'Controle e rastreabilidade de produtos e serviços fornecidos externamente conforme PG-CSU-001.',
            duracao: '~48 min', status: 'Incompleta', progresso: 0,
            videoUrl: '/treinamentos-edeconsil/videos/coord-suprimentos/aula-03.mp4',
            videoDisponivel: true,
            materiais: [{ nome: '03 - Controle de Produtos e Serviços fornecidos Externamente PG-CSU-001.pptx', tipo: 'pptx', tamanho: '—', url: '/treinamentos-edeconsil/materiais/coord-suprimentos/03 - Controle de Produtos e Serviços fornecidos Externamente PG-CSU-001.pptx' }],
          },
          {
            id: 4, numero: 4,
            titulo: 'PGI-CSU-001 — Entrada de Notas Fiscais',
            descricao: 'Procedimentos para recebimento, conferência e registro de notas fiscais conforme PGI-CSU-001.',
            duracao: '~48 min', status: 'Incompleta', progresso: 0,
            videoUrl: '/treinamentos-edeconsil/videos/coord-suprimentos/aula-04.mp4',
            videoDisponivel: true,
            materiais: [{ nome: '04 - Recebimento de Notas Fiscais PGI-CSU-001.pptx', tipo: 'pptx', tamanho: '—', url: '/treinamentos-edeconsil/materiais/coord-suprimentos/04 - Recebimento de Notas Fiscais PGI-CSU-001.pptx' }],
          },
          {
            id: 5, numero: 5,
            titulo: 'Entrega e Recebimento de Ferramentas',
            descricao: 'Processos de recebimento, controle e entrega de ferramentas de manutenção mecânica conforme PGI-CSU-003.',
            duracao: '~48 min', status: 'Incompleta', progresso: 0,
            videoUrl: '/treinamentos-edeconsil/videos/coord-suprimentos/aula-05.mp4',
            videoDisponivel: true,
            materiais: [{ nome: '05 - Recebimento e Entrega de ferramentas de manutenção mecanica PGI-CSU-003.pptx', tipo: 'pptx', tamanho: '—', url: '/treinamentos-edeconsil/materiais/coord-suprimentos/05 - Recebimento e Entrega de ferramentas de manutenção mecanica PGI-CSU-003.pptx' }],
          },
        ],
      },
    ],
  }
]
