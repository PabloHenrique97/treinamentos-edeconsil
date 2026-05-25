import { useState, useMemo } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Users, UserCheck, UserX, TrendingUp, X, UserPlus } from 'lucide-react'
import { CadastroAluno } from './CadastroAluno'

interface Aluno {
  id: number
  nome: string
  email: string
  cr: string
  cargo: string
  status: 'Ativo' | 'Inativo'
  progresso: number
  cursosAtivos: number
  cursosConcluidos: number
}

const mockAlunos: Aluno[] = [
  { id:  1, nome: 'Ana Paula Ferreira',    email: 'ana.ferreira@edeconsil.com.br',   cr: 'CR-001', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 82, cursosAtivos: 3, cursosConcluidos: 7  },
  { id:  2, nome: 'Bruno Costa Lima',      email: 'bruno.lima@edeconsil.com.br',     cr: 'CR-002', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 55, cursosAtivos: 2, cursosConcluidos: 4  },
  { id:  3, nome: 'Carla Mendes Souza',    email: 'carla.souza@edeconsil.com.br',    cr: 'CR-003', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 91, cursosAtivos: 1, cursosConcluidos: 12 },
  { id:  4, nome: 'Diego Rocha Santos',    email: 'diego.santos@edeconsil.com.br',   cr: 'CR-004', cargo: 'Mestre de Obras',      status: 'Inativo', progresso: 40, cursosAtivos: 0, cursosConcluidos: 2  },
  { id:  5, nome: 'Eliane Teixeira Nobre', email: 'eliane.nobre@edeconsil.com.br',   cr: 'CR-005', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 73, cursosAtivos: 4, cursosConcluidos: 9  },
  { id:  6, nome: 'Felipe Alves Cardoso',  email: 'felipe.cardoso@edeconsil.com.br', cr: 'CR-006', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 60, cursosAtivos: 2, cursosConcluidos: 5  },
  { id:  7, nome: 'Gabriela Mota Pires',   email: 'gabriela.pires@edeconsil.com.br', cr: 'CR-007', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 88, cursosAtivos: 2, cursosConcluidos: 8  },
  { id:  8, nome: 'Henrique Batista Cruz', email: 'henrique.cruz@edeconsil.com.br',  cr: 'CR-008', cargo: 'Mestre de Obras',      status: 'Inativo', progresso: 22, cursosAtivos: 0, cursosConcluidos: 1  },
  { id:  9, nome: 'Isabela Duarte Faria',  email: 'isabela.faria@edeconsil.com.br',  cr: 'CR-009', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 95, cursosAtivos: 1, cursosConcluidos: 15 },
  { id: 10, nome: 'Júlio César Martins',   email: 'julio.martins@edeconsil.com.br',  cr: 'CR-010', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 67, cursosAtivos: 3, cursosConcluidos: 6  },
  { id: 11, nome: 'Karina Lopes Vieira',   email: 'karina.vieira@edeconsil.com.br',  cr: 'CR-011', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 78, cursosAtivos: 2, cursosConcluidos: 7  },
  { id: 12, nome: 'Leonardo Gomes Reis',   email: 'leonardo.reis@edeconsil.com.br',  cr: 'CR-012', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 50, cursosAtivos: 1, cursosConcluidos: 3  },
  { id: 13, nome: 'Mariana Campos Luz',    email: 'mariana.luz@edeconsil.com.br',    cr: 'CR-013', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 84, cursosAtivos: 3, cursosConcluidos: 10 },
  { id: 14, nome: 'Nelson Freitas Borba',  email: 'nelson.borba@edeconsil.com.br',   cr: 'CR-014', cargo: 'Técnico em Segurança', status: 'Inativo', progresso: 35, cursosAtivos: 0, cursosConcluidos: 2  },
  { id: 15, nome: 'Olivia Ramos Cerqueira',email: 'olivia.cerqueira@edeconsil.com.br',cr:'CR-015', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 70, cursosAtivos: 2, cursosConcluidos: 6  },
  { id: 16, nome: 'Paulo Eduardo Menezes', email: 'paulo.menezes@edeconsil.com.br',  cr: 'CR-016', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 62, cursosAtivos: 2, cursosConcluidos: 4  },
  { id: 17, nome: 'Queila Barbosa Fonseca',email: 'queila.fonseca@edeconsil.com.br', cr: 'CR-017', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 89, cursosAtivos: 1, cursosConcluidos: 11 },
  { id: 18, nome: 'Ricardo Torres Maia',   email: 'ricardo.maia@edeconsil.com.br',   cr: 'CR-018', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 44, cursosAtivos: 3, cursosConcluidos: 3  },
  { id: 19, nome: 'Sônia Pereira Correia', email: 'sonia.correia@edeconsil.com.br',  cr: 'CR-019', cargo: 'Encarregado de Obra',  status: 'Inativo', progresso: 15, cursosAtivos: 0, cursosConcluidos: 0  },
  { id: 20, nome: 'Thiago Nascimento Val', email: 'thiago.val@edeconsil.com.br',     cr: 'CR-020', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 76, cursosAtivos: 2, cursosConcluidos: 7  },
  { id: 21, nome: 'Ursula Magalhães Brum', email: 'ursula.brum@edeconsil.com.br',    cr: 'CR-021', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 93, cursosAtivos: 2, cursosConcluidos: 14 },
  { id: 22, nome: 'Vinicius Azevedo Paes', email: 'vinicius.paes@edeconsil.com.br',  cr: 'CR-022', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 58, cursosAtivos: 1, cursosConcluidos: 4  },
  { id: 23, nome: 'Wanderley Cunha Porto', email: 'wanderley.porto@edeconsil.com.br',cr: 'CR-023', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 71, cursosAtivos: 3, cursosConcluidos: 5  },
  { id: 24, nome: 'Ximena Oliveira Sales', email: 'ximena.sales@edeconsil.com.br',   cr: 'CR-024', cargo: 'Mestre de Obras',      status: 'Inativo', progresso: 28, cursosAtivos: 0, cursosConcluidos: 1  },
  { id: 25, nome: 'Yasmin Rodrigues Beck', email: 'yasmin.beck@edeconsil.com.br',    cr: 'CR-025', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 87, cursosAtivos: 2, cursosConcluidos: 9  },
  { id: 26, nome: 'Zacarias Moura Fleury', email: 'zacarias.fleury@edeconsil.com.br',cr: 'CR-026', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 64, cursosAtivos: 2, cursosConcluidos: 6  },
  { id: 27, nome: 'Amanda Silveira Luz',   email: 'amanda.luz@edeconsil.com.br',     cr: 'CR-027', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 80, cursosAtivos: 1, cursosConcluidos: 8  },
  { id: 28, nome: 'Bernardo Pinto Leal',   email: 'bernardo.leal@edeconsil.com.br',  cr: 'CR-028', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 47, cursosAtivos: 2, cursosConcluidos: 2  },
  { id: 29, nome: 'Claudia Fernandes Paz', email: 'claudia.paz@edeconsil.com.br',    cr: 'CR-029', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 90, cursosAtivos: 3, cursosConcluidos: 13 },
  { id: 30, nome: 'Danilo Esteves Queiroz',email: 'danilo.queiroz@edeconsil.com.br', cr: 'CR-030', cargo: 'Técnico em Segurança', status: 'Inativo', progresso: 20, cursosAtivos: 0, cursosConcluidos: 1  },
  { id: 31, nome: 'Esther Cavalcante Rios',email: 'esther.rios@edeconsil.com.br',    cr: 'CR-031', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 75, cursosAtivos: 2, cursosConcluidos: 7  },
  { id: 32, nome: 'Fábio Monteiro Salgado',email: 'fabio.salgado@edeconsil.com.br',  cr: 'CR-032', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 53, cursosAtivos: 1, cursosConcluidos: 3  },
  { id: 33, nome: 'Giovana Teles Muniz',   email: 'giovana.muniz@edeconsil.com.br',  cr: 'CR-033', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 86, cursosAtivos: 2, cursosConcluidos: 10 },
  { id: 34, nome: 'Hamilton Souza Braga',  email: 'hamilton.braga@edeconsil.com.br', cr: 'CR-034', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 69, cursosAtivos: 3, cursosConcluidos: 5  },
  { id: 35, nome: 'Ivone Carvalho Dias',   email: 'ivone.dias@edeconsil.com.br',     cr: 'CR-035', cargo: 'Encarregado de Obra',  status: 'Inativo', progresso: 12, cursosAtivos: 0, cursosConcluidos: 0  },
  { id: 36, nome: 'Jonatas Lima Figueira', email: 'jonatas.figueira@edeconsil.com.br',cr:'CR-036', cargo: 'Mestre de Obras',      status: 'Ativo',   progresso: 74, cursosAtivos: 2, cursosConcluidos: 6  },
  { id: 37, nome: 'Keila Andrade Soares',  email: 'keila.soares@edeconsil.com.br',   cr: 'CR-037', cargo: 'Engenheiro Civil',     status: 'Ativo',   progresso: 92, cursosAtivos: 1, cursosConcluidos: 16 },
  { id: 38, nome: 'Luciano Vaz Cordeiro',  email: 'luciano.cordeiro@edeconsil.com.br',cr:'CR-038', cargo: 'Técnico em Segurança', status: 'Ativo',   progresso: 61, cursosAtivos: 2, cursosConcluidos: 4  },
  { id: 39, nome: 'Mônica Araújo Leão',    email: 'monica.leao@edeconsil.com.br',    cr: 'CR-039', cargo: 'Encarregado de Obra',  status: 'Ativo',   progresso: 83, cursosAtivos: 3, cursosConcluidos: 9  },
  { id: 40, nome: 'Nilton Ribeiro Macedo', email: 'nilton.macedo@edeconsil.com.br',  cr: 'CR-040', cargo: 'Mestre de Obras',      status: 'Inativo', progresso: 33, cursosAtivos: 0, cursosConcluidos: 2  },
]

const ITENS_POR_PAGINA = 10
const CORES_AVATAR = ['#1a56ff','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#f97316']
const CARGOS = ['Todos', 'Engenheiro Civil', 'Técnico em Segurança', 'Encarregado de Obra', 'Mestre de Obras']

function getIniciais(nome: string) {
  const partes = nome.trim().split(' ')
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

function corAvatar(id: number) {
  return CORES_AVATAR[id % 8]
}

type CampoOrdem = 'nome' | 'cr' | 'cargo' | 'progresso' | 'cursosAtivos' | 'cursosConcluidos'

interface AlunosAdminProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function AlunosAdmin({ onNavigate, onLogout }: AlunosAdminProps) {
  const { C } = useTheme()

  const [modalCadastro, setModalCadastro] = useState(false)
  const [busca, setBusca] = useState('')
  const [cargoFiltro, setCargoFiltro] = useState('Todos')
  const [crFiltro, setCrFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [ordenacao, setOrdenacao] = useState<CampoOrdem>('nome')
  const [ordemDir, setOrdemDir] = useState<'asc' | 'desc'>('asc')

  function toggleOrdem(campo: CampoOrdem) {
    if (campo === ordenacao) {
      setOrdemDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setOrdenacao(campo)
      setOrdemDir('asc')
    }
    setPaginaAtual(1)
  }

  function limparFiltros() {
    setBusca('')
    setCargoFiltro('Todos')
    setCrFiltro('')
    setStatusFiltro('Todos')
    setPaginaAtual(1)
  }

  const alunosFiltrados = useMemo(() => {
    let lista = mockAlunos.filter(a => {
      const buscaOk = busca === '' ||
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.email.toLowerCase().includes(busca.toLowerCase())
      const crOk = crFiltro === '' || a.cr.toLowerCase().includes(crFiltro.toLowerCase())
      const cargoOk = cargoFiltro === 'Todos' || a.cargo === cargoFiltro
      const statusOk = statusFiltro === 'Todos' || a.status === statusFiltro
      return buscaOk && crOk && cargoOk && statusOk
    })

    lista = [...lista].sort((a, b) => {
      let va: string | number = a[ordenacao]
      let vb: string | number = b[ordenacao]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return ordemDir === 'asc' ? -1 : 1
      if (va > vb) return ordemDir === 'asc' ? 1 : -1
      return 0
    })

    return lista
  }, [busca, cargoFiltro, crFiltro, statusFiltro, ordenacao, ordemDir])

  const totalPaginas = Math.max(1, Math.ceil(alunosFiltrados.length / ITENS_POR_PAGINA))
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const alunosPagina = alunosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const totalAtivos = mockAlunos.filter(a => a.status === 'Ativo').length
  const totalInativos = mockAlunos.filter(a => a.status === 'Inativo').length
  const mediaProgresso = Math.round(mockAlunos.reduce((s, a) => s + a.progresso, 0) / mockAlunos.length)

  const metricas = [
    { label: 'Total de Alunos',    valor: mockAlunos.length, icon: Users,     cor: C.blue    },
    { label: 'Alunos Ativos',      valor: totalAtivos,       icon: UserCheck, cor: '#10b981' },
    { label: 'Alunos Inativos',    valor: totalInativos,     icon: UserX,     cor: '#ef4444' },
    { label: 'Média de Progresso', valor: `${mediaProgresso}%`, icon: TrendingUp, cor: '#f59e0b' },
  ]

  function SortIcon({ campo }: { campo: CampoOrdem }) {
    if (campo !== ordenacao) return <ChevronsUpDown size={12} color={C.muted} />
    return ordemDir === 'asc'
      ? <ChevronUp size={12} color={C.blue} />
      : <ChevronDown size={12} color={C.blue} />
  }

  function renderPaginas() {
    const botoes: (number | '...')[] = []
    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) botoes.push(i)
    } else {
      botoes.push(1)
      if (paginaAtual > 3) botoes.push('...')
      for (let i = Math.max(2, paginaAtual - 1); i <= Math.min(totalPaginas - 1, paginaAtual + 1); i++) botoes.push(i)
      if (paginaAtual < totalPaginas - 2) botoes.push('...')
      botoes.push(totalPaginas)
    }
    return botoes
  }

  const inputStyle: React.CSSProperties = {
    padding: '7px 10px', borderRadius: '8px', fontSize: '13px',
    border: `1px solid ${C.border}`, background: C.surface, color: C.text,
    outline: 'none',
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 12px', fontSize: '11px', fontWeight: 600,
    color: C.muted, textAlign: 'left', cursor: 'pointer', userSelect: 'none',
    whiteSpace: 'nowrap', borderBottom: `1px solid ${C.border}`,
  }

  return (
    <LayoutAdmin
      paginaAtiva="alunosAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Alunos"
      topbarSubtitulo="Gerencie os colaboradores matriculados"
    >
      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {metricas.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '10px',
                background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color={m.cor} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: C.text }}>{m.valor}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{m.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filtros */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Busca nome/email */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
            <Search size={14} color={C.muted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={busca}
              onChange={e => { setBusca(e.target.value); setPaginaAtual(1) }}
              placeholder="Buscar por nome ou e-mail..."
              style={{ ...inputStyle, width: '100%', paddingLeft: '32px', boxSizing: 'border-box' }}
            />
          </div>

          {/* CR */}
          <input
            value={crFiltro}
            onChange={e => { setCrFiltro(e.target.value); setPaginaAtual(1) }}
            placeholder="CR (ex: CR-001)"
            style={{ ...inputStyle, width: '140px' }}
          />

          {/* Cargo */}
          <select
            value={cargoFiltro}
            onChange={e => { setCargoFiltro(e.target.value); setPaginaAtual(1) }}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {CARGOS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status */}
          <select
            value={statusFiltro}
            onChange={e => { setStatusFiltro(e.target.value); setPaginaAtual(1) }}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="Todos">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>

          {/* Limpar */}
          {(busca || crFiltro || cargoFiltro !== 'Todos' || statusFiltro !== 'Todos') && (
            <button
              onClick={limparFiltros}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px', border: `1px solid ${C.border}`,
                background: 'transparent', color: C.muted, fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
              Limpar filtros
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '12px', color: C.muted }}>
            {alunosFiltrados.length} resultado{alunosFiltrados.length !== 1 ? 's' : ''}
          </span>

          <button
            onClick={() => setModalCadastro(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px', border: 'none',
              background: C.blue, color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Inter',sans-serif",
            }}
          >
            <UserPlus size={14} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', overflow: 'hidden', marginBottom: '20px',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <colgroup>
              <col style={{ width: '2fr' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '100px' }} />
            </colgroup>
            <thead>
              <tr style={{ background: C.surface }}>
                <th style={thStyle} onClick={() => toggleOrdem('nome')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Aluno <SortIcon campo="nome" />
                  </span>
                </th>
                <th style={thStyle} onClick={() => toggleOrdem('cr')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    CR <SortIcon campo="cr" />
                  </span>
                </th>
                <th style={thStyle} onClick={() => toggleOrdem('cargo')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Cargo <SortIcon campo="cargo" />
                  </span>
                </th>
                <th style={thStyle} onClick={() => toggleOrdem('progresso')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Progresso Geral <SortIcon campo="progresso" />
                  </span>
                </th>
                <th style={thStyle} onClick={() => toggleOrdem('cursosAtivos')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Em Andamento <SortIcon campo="cursosAtivos" />
                  </span>
                </th>
                <th style={thStyle} onClick={() => toggleOrdem('cursosConcluidos')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Concluídos <SortIcon campo="cursosConcluidos" />
                  </span>
                </th>
                <th style={{ padding: '10px 12px', fontSize: '11px', fontWeight: 600, color: C.muted, textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {alunosPagina.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>
                    Nenhum aluno encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : alunosPagina.map((aluno, idx) => (
                <tr
                  key={aluno.id}
                  style={{
                    borderBottom: idx < alunosPagina.length - 1 ? `1px solid ${C.border}` : 'none',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${C.blue}08`)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Aluno */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: corAvatar(aluno.id),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, color: '#fff',
                      }}>
                        {getIniciais(aluno.nome)}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{aluno.nome}</div>
                        <div style={{ fontSize: '11px', color: C.muted }}>{aluno.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* CR */}
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: '20px',
                      background: `${C.blue}18`, color: C.blue,
                      fontSize: '11px', fontWeight: 600,
                    }}>
                      {aluno.cr}
                    </span>
                  </td>

                  {/* Cargo */}
                  <td style={{ padding: '12px 12px', fontSize: '12px', color: C.muted2 }}>
                    {aluno.cargo}
                  </td>

                  {/* Progresso */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        flex: 1, height: 6, borderRadius: '3px',
                        background: C.border, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: '3px',
                          width: `${aluno.progresso}%`,
                          background: aluno.progresso >= 70 ? '#10b981' : C.blue,
                          transition: 'width 300ms',
                        }} />
                      </div>
                      <span style={{
                        fontSize: '12px', fontWeight: 600, minWidth: '32px', textAlign: 'right',
                        color: aluno.progresso >= 70 ? '#10b981' : C.blue,
                      }}>
                        {aluno.progresso}%
                      </span>
                    </div>
                  </td>

                  {/* Cursos ativos */}
                  <td style={{ padding: '12px 12px', fontSize: '13px', color: C.text, textAlign: 'center' }}>
                    {aluno.cursosAtivos}
                  </td>

                  {/* Cursos concluídos */}
                  <td style={{ padding: '12px 12px', fontSize: '13px', color: C.text, textAlign: 'center' }}>
                    {aluno.cursosConcluidos}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: aluno.status === 'Ativo' ? '#10b98118' : '#ef444418',
                      color: aluno.status === 'Ativo' ? '#10b981' : '#ef4444',
                    }}>
                      {aluno.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: C.muted }}>
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, alunosFiltrados.length)} de {alunosFiltrados.length} alunos
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              style={{
                padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                border: `1px solid ${C.border}`, background: C.surface, color: C.muted2,
                cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', opacity: paginaAtual === 1 ? 0.4 : 1,
              }}
            >
              Anterior
            </button>

            {renderPaginas().map((p, i) =>
              p === '...'
                ? <span key={`el-${i}`} style={{ padding: '6px 4px', color: C.muted, fontSize: '13px' }}>…</span>
                : (
                  <button
                    key={p}
                    onClick={() => setPaginaAtual(p as number)}
                    style={{
                      width: 34, height: 34, borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                      border: `1px solid ${p === paginaAtual ? C.blue : C.border}`,
                      background: p === paginaAtual ? C.blue : C.surface,
                      color: p === paginaAtual ? '#fff' : C.muted2,
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                )
            )}

            <button
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              style={{
                padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                border: `1px solid ${C.border}`, background: C.surface, color: C.muted2,
                cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', opacity: paginaAtual === totalPaginas ? 0.4 : 1,
              }}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
      {/* Modal Cadastro de Aluno */}
      {modalCadastro && (
        <div
          onClick={() => setModalCadastro(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.60)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: C.surface, borderRadius: '16px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${C.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
          >
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Novo Aluno</h2>
                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Cadastrar colaborador na plataforma</p>
              </div>
              <button
                onClick={() => setModalCadastro(false)}
                style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', color: C.muted, fontFamily: "'Inter',sans-serif" }}
              >
                ×
              </button>
            </div>
            <CadastroAluno
              onFechar={() => setModalCadastro(false)}
              onSucesso={(_usuario) => {
                setModalCadastro(false)
              }}
            />
          </div>
        </div>
      )}
    </LayoutAdmin>
  )
}
