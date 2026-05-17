import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreVertical,
  BookOpen, Users, Clock, TrendingUp,
  Edit, Trash2, Eye, Copy,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const cargos = [
  'Todos os cargos',
  'Engenheiro de Obras',
  'Técnico de Segurança',
  'Encarregado',
  'Operador de Máquinas',
  'Administrativo',
  'Gestor de Projetos',
]

const trilhas = [
  'Todas as trilhas',
  'Obras e Infraestrutura',
  'Terraplanagem',
  'Pavimentação',
  'Equipamentos',
  'Segurança do Trabalho',
  'Gestão e Suprimentos',
]

const statusOpcoes = ['Todos', 'Ativo', 'Rascunho', 'Arquivado']

interface Curso {
  id: number
  titulo: string
  descricao: string
  carga: string
  aulas: number
  alunos: number
  cargo: string
  trilha: string
  status: 'Ativo' | 'Rascunho' | 'Arquivado'
  conclusao: number
  cor: string
  icone: string
  dataCriacao: string
}

const cursosMock: Curso[] = [
  {
    id: 1,
    titulo: 'NR-35 — Trabalho em Altura',
    descricao: 'Capacitação obrigatória para atividades em altura conforme norma regulamentadora.',
    carga: '8h', aulas: 24, alunos: 342,
    cargo: 'Técnico de Segurança',
    trilha: 'Segurança do Trabalho',
    status: 'Ativo', conclusao: 78,
    cor: '#dc2626', icone: '🪖',
    dataCriacao: '10/01/2025',
  },
  {
    id: 2,
    titulo: 'SIPAT — Segurança no Canteiro de Obras',
    descricao: 'Boas práticas de segurança e prevenção de acidentes no ambiente de obra.',
    carga: '6h', aulas: 18, alunos: 289,
    cargo: 'Encarregado',
    trilha: 'Segurança do Trabalho',
    status: 'Ativo', conclusao: 65,
    cor: '#d97706', icone: '🛡️',
    dataCriacao: '15/01/2025',
  },
  {
    id: 3,
    titulo: 'Gestão da Qualidade ISO 9001',
    descricao: 'Fundamentos do sistema de gestão da qualidade e sua aplicação na construção civil.',
    carga: '12h', aulas: 40, alunos: 156,
    cargo: 'Gestor de Projetos',
    trilha: 'Gestão e Suprimentos',
    status: 'Ativo', conclusao: 42,
    cor: '#7c3aed', icone: '📋',
    dataCriacao: '20/01/2025',
  },
  {
    id: 4,
    titulo: 'Leitura e Interpretação de Projetos',
    descricao: 'Como interpretar plantas topográficas, cortes, perfis e volumes com precisão.',
    carga: '10h', aulas: 32, alunos: 412,
    cargo: 'Engenheiro de Obras',
    trilha: 'Obras e Infraestrutura',
    status: 'Ativo', conclusao: 88,
    cor: '#1a56ff', icone: '📐',
    dataCriacao: '05/02/2025',
  },
  {
    id: 5,
    titulo: 'Operação de Escavadeiras Hidráulicas',
    descricao: 'Treinamento prático para operadores de escavadeiras em obras de terraplanagem.',
    carga: '16h', aulas: 48, alunos: 98,
    cargo: 'Operador de Máquinas',
    trilha: 'Terraplanagem',
    status: 'Ativo', conclusao: 55,
    cor: '#059669', icone: '🏗️',
    dataCriacao: '10/02/2025',
  },
  {
    id: 6,
    titulo: 'Pavimentação Asfáltica — Fundamentos',
    descricao: 'Técnicas e processos de pavimentação asfáltica para equipes de obra.',
    carga: '8h', aulas: 26, alunos: 134,
    cargo: 'Encarregado',
    trilha: 'Pavimentação',
    status: 'Ativo', conclusao: 61,
    cor: '#0891b2', icone: '🛣️',
    dataCriacao: '15/02/2025',
  },
  {
    id: 7,
    titulo: 'Gestão de Resíduos em Obras',
    descricao: 'Práticas sustentáveis e legislação ambiental aplicadas ao canteiro de obras.',
    carga: '6h', aulas: 20, alunos: 67,
    cargo: 'Gestor de Projetos',
    trilha: 'Gestão e Suprimentos',
    status: 'Rascunho', conclusao: 0,
    cor: '#16a34a', icone: '♻️',
    dataCriacao: '01/03/2025',
  },
  {
    id: 8,
    titulo: 'Liderança para Encarregados de Obras',
    descricao: 'Desenvolvimento de habilidades de liderança e gestão de equipes em campo.',
    carga: '10h', aulas: 30, alunos: 201,
    cargo: 'Encarregado',
    trilha: 'Obras e Infraestrutura',
    status: 'Ativo', conclusao: 73,
    cor: '#db2777', icone: '👷',
    dataCriacao: '20/02/2025',
  },
  {
    id: 9,
    titulo: 'Excel para Gestão de Obras',
    descricao: 'Planilhas e ferramentas do Excel aplicadas ao controle de obras e orçamentos.',
    carga: '8h', aulas: 22, alunos: 178,
    cargo: 'Administrativo',
    trilha: 'Gestão e Suprimentos',
    status: 'Ativo', conclusao: 82,
    cor: '#1a56ff', icone: '📊',
    dataCriacao: '01/03/2025',
  },
]

export function CursosAdmin({ onNavigate, onLogout }: {
  onNavigate: (p: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')
  const [cargoFiltro, setCargoFiltro] = useState('Todos os cargos')
  const [trilhaFiltro, setTrilhaFiltro] = useState('Todas as trilhas')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [menuAberto, setMenuAberto] = useState<number | null>(null)
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid')

  const cursosFiltrados = useMemo(() => {
    return cursosMock.filter(c => {
      const matchBusca = c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                         c.descricao.toLowerCase().includes(busca.toLowerCase())
      const matchCargo  = cargoFiltro  === 'Todos os cargos'  || c.cargo  === cargoFiltro
      const matchTrilha = trilhaFiltro === 'Todas as trilhas' || c.trilha === trilhaFiltro
      const matchStatus = statusFiltro === 'Todos'            || c.status === statusFiltro
      return matchBusca && matchCargo && matchTrilha && matchStatus
    })
  }, [busca, cargoFiltro, trilhaFiltro, statusFiltro])

  const totalAtivos    = cursosMock.filter(c => c.status === 'Ativo').length
  const totalAlunos    = cursosMock.reduce((s, c) => s + c.alunos, 0)
  const mediaConclusao = Math.round(
    cursosMock.filter(c => c.status === 'Ativo').reduce((s, c) => s + c.conclusao, 0) /
    cursosMock.filter(c => c.status === 'Ativo').length
  )

  const corStatus = (s: string) => ({
    'Ativo':     { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', border: 'rgba(16,185,129,0.25)' },
    'Rascunho':  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    'Arquivado': { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.25)' },
  }[s] ?? { bg: C.surface2, color: C.muted, border: C.border })

  function SelectFiltro({ value, onChange, options }: {
    value: string; onChange: (v: string) => void; options: string[]
  }) {
    return (
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            appearance: 'none',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            padding: '8px 32px 8px 12px',
            fontSize: '13px',
            color: C.text,
            cursor: 'pointer',
            outline: 'none',
            minWidth: '180px',
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} color={C.muted} style={{
          position: 'absolute', right: '10px', top: '50%',
          transform: 'translateY(-50%)', pointerEvents: 'none',
        }} />
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: "'Inter',sans-serif",
      background: C.bg,
      color: C.text,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>

      {/* Sidebar admin */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: C.blue, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#fff' }}>E</div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: C.text, letterSpacing: '1.5px' }}>EDECONSIL</div>
            <div style={{ fontSize: '9px', color: C.blue, letterSpacing: '1px' }}>UNIVERSIDADE</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 8px', flex: 1 }}>
          <div
            onClick={() => onNavigate('admin')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '1px', transition: 'all 150ms' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: '13px', color: C.muted2 }}>Dashboard</span>
          </div>

          <div style={{ fontSize: '9px', fontWeight: 700, color: C.muted, letterSpacing: '1px', padding: '12px 12px 6px', textTransform: 'uppercase' }}>Gestão</div>
          {[
            { label: 'Cursos',                ativo: true  },
            { label: 'Turmas',                ativo: false },
            { label: 'Alunos',                ativo: false },
            { label: 'Instrutores',           ativo: false },
            { label: 'Certificados',          ativo: false },
            { label: 'Biblioteca',            ativo: false },
            { label: 'Trilhas de Aprendizado', ativo: false },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                background: item.ativo ? 'rgba(26,86,255,0.15)' : 'transparent',
                borderLeft: item.ativo ? `3px solid ${C.blue}` : '3px solid transparent',
                marginBottom: '1px', transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (!item.ativo) e.currentTarget.style.background = 'rgba(26,86,255,0.06)' }}
              onMouseLeave={e => { if (!item.ativo) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '13px', fontWeight: item.ativo ? 700 : 400, color: item.ativo ? C.blue : C.muted2 }}>
                {item.label}
              </span>
            </div>
          ))}

          <div style={{ fontSize: '9px', fontWeight: 700, color: C.muted, letterSpacing: '1px', padding: '12px 12px 6px', textTransform: 'uppercase' }}>Administração</div>
          {['Matrículas','Relatórios','Financeiro','Notificações','Configurações','Permissões'].map(item => (
            <div
              key={item}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '1px', transition: 'all 150ms' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '13px', color: C.muted2 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Suporte + Sair */}
        <div style={{ padding: '8px' }}>
          <div style={{ background: 'rgba(26,86,255,0.08)', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: C.blue }}>Suporte EAD</div>
            <div style={{ fontSize: '10px', color: C.muted }}>Precisa de ajuda? Fale com nosso suporte</div>
          </div>
          <div
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: C.muted, fontSize: '13px', transition: 'all 150ms' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            ↩ Sair
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ height: '56px', flexShrink: 0, background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px' }}>
          <span
            onClick={() => onNavigate('admin')}
            style={{ fontSize: '13px', color: C.muted, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = C.blue}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >
            Dashboard
          </span>
          <span style={{ fontSize: '13px', color: C.muted }}>›</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Cursos</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Busca */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 14px', width: '240px' }}>
              <Search size={13} color={C.muted} />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar cursos..."
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, width: '100%' }}
              />
            </div>
            {/* Toggle visualização */}
            <div style={{ display: 'flex', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden' }}>
              {(['grid', 'lista'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setVisualizacao(v)}
                  style={{ padding: '7px 12px', background: visualizacao === v ? C.blue : 'none', color: visualizacao === v ? '#fff' : C.muted, border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 150ms' }}
                >
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
            {/* Avatar admin */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>A</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: C.text }}>Administrador</div>
                <div style={{ fontSize: '9px', color: C.muted }}>Administrador</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Cabeçalho */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Cursos</h1>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
                {cursosFiltrados.length} de {cursosMock.length} cursos
              </p>
            </div>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={15} /> Novo Curso
            </button>
          </div>

          {/* Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total de Cursos',   valor: cursosMock.length,              icone: BookOpen,   cor: C.blue    },
              { label: 'Cursos Ativos',     valor: totalAtivos,                    icone: TrendingUp, cor: '#10b981' },
              { label: 'Total de Alunos',   valor: totalAlunos.toLocaleString(),   icone: Users,      cor: '#f59e0b' },
              { label: 'Taxa de Conclusão', valor: `${mediaConclusao}%`,           icone: TrendingUp, cor: '#8b5cf6' },
            ].map(m => (
              <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <m.icone size={18} color={m.cor} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{m.valor}</div>
                  <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, flexShrink: 0 }}>
              <Filter size={14} />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Filtros:</span>
            </div>
            <SelectFiltro value={cargoFiltro}  onChange={setCargoFiltro}  options={cargos}       />
            <SelectFiltro value={trilhaFiltro} onChange={setTrilhaFiltro} options={trilhas}      />
            <SelectFiltro value={statusFiltro} onChange={setStatusFiltro} options={statusOpcoes} />
            {(cargoFiltro !== 'Todos os cargos' || trilhaFiltro !== 'Todas as trilhas' || statusFiltro !== 'Todos') && (
              <button
                onClick={() => { setCargoFiltro('Todos os cargos'); setTrilhaFiltro('Todas as trilhas'); setStatusFiltro('Todos') }}
                style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600 }}
              >
                Limpar filtros
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: C.muted }}>
              {cursosFiltrados.length} resultado{cursosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Grid de cards */}
          {visualizacao === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {cursosFiltrados.map(curso => (
                <div
                  key={curso.id}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'transform 150ms, box-shadow 150ms', position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Faixa colorida */}
                  <div style={{ height: '4px', background: curso.cor }} />

                  <div style={{ padding: '16px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${curso.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          {curso.icone}
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: corStatus(curso.status).bg, color: corStatus(curso.status).color, border: `0.5px solid ${corStatus(curso.status).border}`, borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                          {curso.status}
                        </div>
                      </div>
                      {/* Menu 3 pontos */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setMenuAberto(menuAberto === curso.id ? null : curso.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: C.muted, borderRadius: '6px' }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {menuAberto === curso.id && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', minWidth: '140px', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                            {[
                              { icon: Eye,    label: 'Visualizar'             },
                              { icon: Edit,   label: 'Editar'                 },
                              { icon: Copy,   label: 'Duplicar'               },
                              { icon: Trash2, label: 'Excluir', danger: true  },
                            ].map(a => (
                              <div
                                key={a.label}
                                onClick={() => setMenuAberto(null)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', cursor: 'pointer', fontSize: '13px', color: a.danger ? '#ef4444' : C.text, transition: 'background 100ms' }}
                                onMouseEnter={e => e.currentTarget.style.background = a.danger ? 'rgba(239,68,68,0.08)' : 'rgba(26,86,255,0.06)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <a.icon size={13} />
                                {a.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Título e descrição */}
                    <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 6px', lineHeight: 1.4 }}>
                      {curso.titulo}
                    </p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {curso.descricao}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.10)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '6px', padding: '2px 8px' }}>
                        {curso.cargo}
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.10)', border: '0.5px solid rgba(16,185,129,0.20)', borderRadius: '6px', padding: '2px 8px' }}>
                        {curso.trilha}
                      </span>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                      {[
                        { icon: Clock,    val: curso.carga,            label: 'Carga'    },
                        { icon: BookOpen, val: `${curso.aulas} aulas`, label: 'Conteúdo' },
                        { icon: Users,    val: curso.alunos,           label: 'Alunos'   },
                      ].map(s => (
                        <div key={s.label} style={{ background: C.surface2, borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{s.val}</div>
                          <div style={{ fontSize: '10px', color: C.muted }}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Barra conclusão */}
                    {curso.status === 'Ativo' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: C.muted }}>Taxa de conclusão</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: curso.conclusao >= 70 ? '#10b981' : C.blue }}>{curso.conclusao}%</span>
                        </div>
                        <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '4px' }}>
                          <div style={{ background: curso.conclusao >= 70 ? '#10b981' : C.blue, height: '4px', borderRadius: '4px', width: `${curso.conclusao}%`, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Card Novo Curso */}
              <div
                style={{ background: C.surface, border: `2px dashed ${C.border}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '32px', cursor: 'pointer', transition: 'all 150ms', minHeight: '200px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(26,86,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={22} color={C.blue} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: C.blue, margin: '0 0 4px' }}>Criar novo curso</p>
                  <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Clique para adicionar</p>
                </div>
              </div>
            </div>

          ) : (
            /* Visualização em lista */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px', gap: '12px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Curso</span><span>Cargo</span><span>Trilha</span>
                <span style={{ textAlign: 'center' }}>Alunos</span>
                <span style={{ textAlign: 'center' }}>Conclusão</span>
                <span style={{ textAlign: 'center' }}>Status</span>
              </div>
              {cursosFiltrados.map(curso => (
                <div
                  key={curso.id}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px', gap: '12px', alignItems: 'center', transition: 'background 150ms', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${curso.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{curso.icone}</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curso.titulo}</p>
                      <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{curso.carga} · {curso.aulas} aulas</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curso.cargo}</span>
                  <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curso.trilha}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, textAlign: 'center' }}>{curso.alunos}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: curso.conclusao >= 70 ? '#10b981' : C.blue, textAlign: 'center' }}>{curso.conclusao}%</span>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ background: corStatus(curso.status).bg, color: corStatus(curso.status).color, border: `0.5px solid ${corStatus(curso.status).border}`, borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                      {curso.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cursosFiltrados.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '12px' }}>
              <span style={{ fontSize: '40px' }}>🔍</span>
              <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhum curso encontrado</p>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Tente ajustar os filtros de busca</p>
              <button
                onClick={() => { setBusca(''); setCargoFiltro('Todos os cargos'); setTrilhaFiltro('Todas as trilhas'); setStatusFiltro('Todos') }}
                style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
              >
                Limpar filtros
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Fechar menu ao clicar fora */}
      {menuAberto !== null && (
        <div
          onClick={() => setMenuAberto(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        />
      )}
    </div>
  )
}
