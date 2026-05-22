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
    id: 'nr35',
    slug: 'nr35',
    titulo: 'NR-35 — Trabalho em Altura',
    subtitulo: 'Capacitação obrigatória conforme NR-35',
    descricao: 'Capacitação obrigatória para atividades em altura conforme norma regulamentadora NR-35.',
    categoria: 'Segurança do Trabalho',
    cargo: 'Técnico de Segurança',
    trilha: 'Segurança do Trabalho',
    cargaHoraria: '8h',
    instrutor: 'Carlos Eduardo Mendes',
    totalAulas: 15,
    aulasConcluidas: 10,
    progresso: 68,
    status: 'Em andamento',
    cor: '#dc2626',
    icone: '🪖',
    notaMinimaAprovacao: 70,
    live: {
      data: 'Sexta-feira, 22 de Maio',
      hora: '20:00 BRT',
      titulo: 'Live de Revisão - NR-35 TRABALHO EM ALTURA',
      status: 'Em breve',
    },
    calendario: { inicio: '27/04/2025', fim: '24/05/2025' },
    modulos: [
      {
        id: 1,
        titulo: 'UNIDADE 1 - Fundamentos de Trabalho em Altura',
        totalAulas: 5,
        aulasConcluidas: 5,
        progresso: 100,
        aberto: true,
        aulas: [
          { id: 1,  numero: 1, titulo: 'Introdução ao trabalho em altura',    descricao: 'Conceitos fundamentais sobre trabalho em altura e sua regulamentação.',          duracao: '28 min', status: 'Concluída',    progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 2,  numero: 2, titulo: 'Legislação e normas aplicáveis',      descricao: 'Estudo da NR-35 e demais normas relacionadas ao trabalho em altura.',           duracao: '24 min', status: 'Concluída',    progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 3,  numero: 3, titulo: 'Equipamentos de proteção individual', descricao: 'EPIs obrigatórios para trabalho em altura: cinturões, capacetes e protetores.',  duracao: '30 min', status: 'Concluída',    progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [{ nome: 'Apostila - NR35.pdf', tipo: 'pdf', tamanho: '2.4 MB', url: '' }] },
          { id: 4,  numero: 4, titulo: 'Pontos de ancoragem',                 descricao: 'Tipos de pontos de ancoragem e critérios de seleção e instalação.',              duracao: '22 min', status: 'Concluída',    progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 5,  numero: 5, titulo: 'Sistemas de proteção coletiva',       descricao: 'Redes, plataformas e guarda-corpos como proteção coletiva em altura.',           duracao: '26 min', status: 'Concluída',    progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 2,
        titulo: 'UNIDADE 2 - Equipamentos e Proteções',
        totalAulas: 4,
        aulasConcluidas: 4,
        progresso: 100,
        aberto: false,
        aulas: [
          { id: 6,  numero: 1, titulo: 'Cinturões e talabartes',            descricao: 'Tipos e formas corretas de uso de cinturões e talabartes.', duracao: '24 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 7,  numero: 2, titulo: 'Capacetes e protetores',            descricao: 'Seleção e uso adequado de capacetes e proteção facial.',    duracao: '20 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 8,  numero: 3, titulo: 'Redes e plataformas de proteção',   descricao: 'Instalação e inspeção de redes de segurança.',              duracao: '22 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 9,  numero: 4, titulo: 'Inspeção de equipamentos',          descricao: 'Critérios e periodicidade de inspeção de EPIs e EPCs.',    duracao: '18 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 3,
        titulo: 'UNIDADE 3 - Procedimentos Operacionais',
        totalAulas: 3,
        aulasConcluidas: 1,
        progresso: 33,
        aberto: false,
        aulas: [
          { id: 10, numero: 1, titulo: 'Análise de risco',      descricao: 'Metodologia para análise e controle de riscos em altura.',     duracao: '30 min', status: 'Em andamento', progresso: 60, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 11, numero: 2, titulo: 'Permissão de trabalho', descricao: 'Emissão e controle da Permissão de Trabalho em Altura (PTA).', duracao: '25 min', status: 'Incompleta',   progresso: 0,  videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 12, numero: 3, titulo: 'Resgate em altura',     descricao: 'Procedimentos de resgate de trabalhadores em altura.',         duracao: '28 min', status: 'Incompleta',   progresso: 0,  videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 4,
        titulo: 'UNIDADE 4 - Casos Práticos e Avaliação',
        totalAulas: 3,
        aulasConcluidas: 0,
        progresso: 0,
        aberto: false,
        aulas: [
          { id: 13, numero: 1, titulo: 'Estudos de caso reais', descricao: 'Análise de acidentes reais e lições aprendidas.',        duracao: '35 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 14, numero: 2, titulo: 'Exercícios práticos',   descricao: 'Exercícios de fixação sobre NR-35.',                    duracao: '20 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 15, numero: 3, titulo: 'Simulado final',        descricao: 'Simulado preparatório para a avaliação final do curso.', duracao: '30 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
    ],
  },
  {
    id: 'sipat',
    slug: 'sipat',
    titulo: 'SIPAT — Segurança no Canteiro de Obras',
    subtitulo: 'Semana Interna de Prevenção de Acidentes',
    descricao: 'Boas práticas de segurança e prevenção de acidentes no ambiente de obra.',
    categoria: 'Segurança do Trabalho',
    cargo: 'Encarregado',
    trilha: 'Segurança do Trabalho',
    cargaHoraria: '6h',
    instrutor: 'Juliana Ferreira Costa',
    totalAulas: 12,
    aulasConcluidas: 4,
    progresso: 35,
    status: 'Em andamento',
    cor: '#d97706',
    icone: '🛡️',
    notaMinimaAprovacao: 70,
    calendario: { inicio: '01/05/2025', fim: '30/05/2025' },
    modulos: [
      {
        id: 1,
        titulo: 'UNIDADE 1 - Fundamentos de Segurança',
        totalAulas: 4,
        aulasConcluidas: 4,
        progresso: 100,
        aberto: true,
        aulas: [
          { id: 1, numero: 1, titulo: 'Introdução à segurança do trabalho', descricao: 'Conceitos básicos de segurança do trabalho na construção civil.', duracao: '20 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 2, numero: 2, titulo: 'Normas regulamentadoras',            descricao: 'Panorama das NRs aplicáveis à construção civil.',                 duracao: '25 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 3, numero: 3, titulo: 'Identificação de riscos',            descricao: 'Tipos de riscos no canteiro de obras e como identificá-los.',      duracao: '22 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 4, numero: 4, titulo: 'EPIs obrigatórios na construção',    descricao: 'Equipamentos de proteção individual obrigatórios em obras.',       duracao: '18 min', status: 'Concluída', progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 2,
        titulo: 'UNIDADE 2 - Prevenção de Acidentes',
        totalAulas: 4,
        aulasConcluidas: 0,
        progresso: 0,
        aberto: false,
        aulas: [
          { id: 5, numero: 1, titulo: 'Causas de acidentes',       descricao: 'Análise das principais causas de acidentes em obras.',      duracao: '24 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 6, numero: 2, titulo: 'Investigação de acidentes', descricao: 'Metodologia para investigação e registro de acidentes.',    duracao: '28 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 7, numero: 3, titulo: 'Ordem e limpeza',           descricao: 'Importância da organização do canteiro para segurança.',   duracao: '15 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 8, numero: 4, titulo: 'Sinalização de segurança',  descricao: 'Tipos e uso correto da sinalização em obras.',              duracao: '20 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 3,
        titulo: 'UNIDADE 3 - CIPA e Avaliação',
        totalAulas: 4,
        aulasConcluidas: 0,
        progresso: 0,
        aberto: false,
        aulas: [
          { id: 9,  numero: 1, titulo: 'CIPA — Comissão Interna',   descricao: 'Atribuições e funcionamento da CIPA.',           duracao: '22 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 10, numero: 2, titulo: 'DDS — Diálogo de Segurança', descricao: 'Como conduzir o Diálogo Diário de Segurança.',  duracao: '18 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 11, numero: 3, titulo: 'Exercícios práticos',        descricao: 'Fixação dos conteúdos de segurança.',            duracao: '20 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 12, numero: 4, titulo: 'Simulado final',             descricao: 'Simulado preparatório para avaliação.',          duracao: '25 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
    ],
  },
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
  },
  {
    id: 'iso9001',
    slug: 'iso9001',
    titulo: 'Gestão da Qualidade ISO 9001',
    subtitulo: 'Sistema de Gestão da Qualidade na Construção Civil',
    descricao: 'Fundamentos do sistema de gestão da qualidade e sua aplicação na construção civil.',
    categoria: 'Gestão e Suprimentos',
    cargo: 'Gestor de Projetos',
    trilha: 'Gestão e Suprimentos',
    cargaHoraria: '12h',
    instrutor: 'Carla Beatriz Monteiro',
    totalAulas: 10,
    aulasConcluidas: 1,
    progresso: 12,
    status: 'Em andamento',
    cor: '#7c3aed',
    icone: '📋',
    notaMinimaAprovacao: 70,
    calendario: { inicio: '01/05/2025', fim: '31/07/2025' },
    modulos: [
      {
        id: 1,
        titulo: 'UNIDADE 1 - Fundamentos ISO 9001',
        totalAulas: 5,
        aulasConcluidas: 1,
        progresso: 20,
        aberto: true,
        aulas: [
          { id: 1, numero: 1, titulo: 'Introdução à ISO 9001',       descricao: 'Histórico, estrutura e princípios da norma ISO 9001.', duracao: '30 min', status: 'Concluída',  progresso: 100, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 2, numero: 2, titulo: 'Contexto da organização',     descricao: 'Análise de contexto e partes interessadas.',           duracao: '25 min', status: 'Incompleta', progresso: 0,   videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 3, numero: 3, titulo: 'Liderança e comprometimento', descricao: 'Papel da liderança no SGQ.',                           duracao: '20 min', status: 'Incompleta', progresso: 0,   videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 4, numero: 4, titulo: 'Planejamento do SGQ',         descricao: 'Riscos, oportunidades e objetivos da qualidade.',      duracao: '28 min', status: 'Incompleta', progresso: 0,   videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 5, numero: 5, titulo: 'Suporte e recursos',          descricao: 'Competências, conscientização e comunicação.',         duracao: '22 min', status: 'Incompleta', progresso: 0,   videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
      {
        id: 2,
        titulo: 'UNIDADE 2 - Operação e Avaliação',
        totalAulas: 5,
        aulasConcluidas: 0,
        progresso: 0,
        aberto: false,
        aulas: [
          { id: 6,  numero: 1, titulo: 'Operação e controle',        descricao: 'Controle de processos e não conformidades.',       duracao: '30 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 7,  numero: 2, titulo: 'Avaliação de desempenho',    descricao: 'Monitoramento, medição, análise e avaliação.',     duracao: '25 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 8,  numero: 3, titulo: 'Auditoria interna',          descricao: 'Planejamento e execução de auditorias internas.', duracao: '28 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 9,  numero: 4, titulo: 'Melhoria contínua',          descricao: 'Ações corretivas e melhoria contínua do SGQ.',    duracao: '22 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
          { id: 10, numero: 5, titulo: 'Simulado e avaliação final', descricao: 'Simulado preparatório para a avaliação final.',   duracao: '30 min', status: 'Incompleta', progresso: 0, videoUrl: null, videoDisponivel: false, materiais: [] },
        ],
      },
    ],
  },
]
