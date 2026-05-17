import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreVertical,
  Users, Clock, Calendar, TrendingUp,
  Edit, Trash2, Eye, Copy,
  ChevronDown, BookOpen,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

const cargos = [
  'Todos os cargos',
  'Engenheiro de Obras',
  'Técnico de Segurança',
  'Encarregado',
  'Operador de Máquinas',
  'Administrativo',
  'Gestor de Projetos',
]

const statusOpcoes = ['Todos', 'Aberta', 'Em andamento', 'Encerrada']

interface Turma {
  id: number
  nome: string
  curso: string
  cargo: string
  instrutor: string
  inicio: string
  fim: string
  status: 'Aberta' | 'Em andamento' | 'Encerrada'
  vagas: number
  matriculados: number
  cor: string
  icone: string
}

const turmasMock: Turma[] = [
  {
    id: 1,
    nome: 'Turma NR-35 — Maio/2025',
    curso: 'NR-35 — Trabalho em Altura',
    cargo: 'Técnico de Segurança',
    instrutor: 'Eng. Roberto Alves',
    inicio: '05/05/2025', fim: '30/05/2025',
    status: 'Em andamento', vagas: 30, matriculados: 28,
    cor: '#dc2626', icone: '🪖',
  },
  {
    id: 2,
    nome: 'Turma SIPAT — Maio/2025',
    curso: 'SIPAT — Segurança no Canteiro de Obras',
    cargo: 'Encarregado',
    instrutor: 'Tec. Ana Souza',
    inicio: '12/05/2025', fim: '20/05/2025',
    status: 'Em andamento', vagas: 25, matriculados: 22,
    cor: '#d97706', icone: '🛡️',
  },
  {
    id: 3,
    nome: 'Turma Gestão ISO — Junho/2025',
    curso: 'Gestão da Qualidade ISO 9001',
    cargo: 'Gestor de Projetos',
    instrutor: 'Eng. Marcos Lima',
    inicio: '02/06/2025', fim: '30/06/2025',
    status: 'Aberta', vagas: 20, matriculados: 8,
    cor: '#7c3aed', icone: '📋',
  },
  {
    id: 4,
    nome: 'Turma Leitura Projetos — Abril/2025',
    curso: 'Leitura e Interpretação de Projetos',
    cargo: 'Engenheiro de Obras',
    instrutor: 'Eng. Carlos Mota',
    inicio: '07/04/2025', fim: '30/04/2025',
    status: 'Encerrada', vagas: 20, matriculados: 20,
    cor: '#1a56ff', icone: '📐',
  },
  {
    id: 5,
    nome: 'Turma Escavadeiras — Maio/2025',
    curso: 'Operação de Escavadeiras Hidráulicas',
    cargo: 'Operador de Máquinas',
    instrutor: 'Tec. Paulo Vieira',
    inicio: '19/05/2025', fim: '16/06/2025',
    status: 'Aberta', vagas: 15, matriculados: 6,
    cor: '#059669', icone: '🏗️',
  },
  {
    id: 6,
    nome: 'Turma Pavimentação — Maio/2025',
    curso: 'Pavimentação Asfáltica — Fundamentos',
    cargo: 'Encarregado',
    instrutor: 'Eng. Fábio Costa',
    inicio: '26/05/2025', fim: '27/06/2025',
    status: 'Aberta', vagas: 18, matriculados: 11,
    cor: '#0891b2', icone: '🛣️',
  },
  {
    id: 7,
    nome: 'Turma Liderança — Abril/2025',
    curso: 'Liderança para Encarregados de Obras',
    cargo: 'Encarregado',
    instrutor: 'Psic. Juliana Ramos',
    inicio: '14/04/2025', fim: '09/05/2025',
    status: 'Em andamento', vagas: 22, matriculados: 19,
    cor: '#db2777', icone: '👷',
  },
  {
    id: 8,
    nome: 'Turma Excel Obras — Junho/2025',
    curso: 'Excel para Gestão de Obras',
    cargo: 'Administrativo',
    instrutor: 'Tec. Sandra Neves',
    inicio: '09/06/2025', fim: '04/07/2025',
    status: 'Aberta', vagas: 25, matriculados: 3,
    cor: '#1a56ff', icone: '📊',
  },
]

export function TurmasAdmin({ onNavigate, onLogout }: {
  onNavigate: (p: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')
  const [cargoFiltro, setCargoFiltro] = useState('Todos os cargos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [menuAberto, setMenuAberto] = useState<number | null>(null)
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid')

  const turmasFiltradas = useMemo(() => {
    return turmasMock.filter(t => {
      const matchBusca = t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                         t.curso.toLowerCase().includes(busca.toLowerCase()) ||
                         t.instrutor.toLowerCase().includes(busca.toLowerCase())
      const matchCargo  = cargoFiltro  === 'Todos os cargos' || t.cargo  === cargoFiltro
      const matchStatus = statusFiltro === 'Todos'           || t.status === statusFiltro
      return matchBusca && matchCargo && matchStatus
    })
  }, [busca, cargoFiltro, statusFiltro])

  const totalAbertas     = turmasMock.filter(t => t.status === 'Aberta').length
  const totalAndamento   = turmasMock.filter(t => t.status === 'Em andamento').length
  const totalMatriculados = turmasMock.reduce((s, t) => s + t.matriculados, 0)
  const totalVagas       = turmasMock.reduce((s, t) => s + t.vagas, 0)

  const corStatus = (s: string) => ({
    'Aberta':       { bg: 'rgba(26,86,255,0.12)',   color: '#1a56ff', border: 'rgba(26,86,255,0.25)'   },
    'Em andamento': { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', border: 'rgba(16,185,129,0.25)'  },
    'Encerrada':    { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.25)' },
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

  const ocupacao = (t: Turma) => Math.round((t.matriculados / t.vagas) * 100)

  return (
    <LayoutAdmin
      paginaAtiva="turmasAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Gestão de Turmas"
      topbarSubtitulo="Gerencie todas as turmas e matrículas da plataforma."
    >
      {/* Breadcrumb + busca + toggle */}
      <div style={{
        padding: '12px 24px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: C.surface,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '12px', color: C.muted }}>Dashboard</span>
        <span style={{ fontSize: '12px', color: C.muted }}>›</span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>Turmas</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px', width: '220px' }}>
            <Search size={13} color={C.muted} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar turmas..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '12px', color: C.text, flex: 1, width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden' }}>
            {(['grid', 'lista'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVisualizacao(v)}
                style={{ padding: '6px 12px', background: visualizacao === v ? C.blue : 'none', color: visualizacao === v ? '#fff' : C.muted, border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 150ms' }}
              >
                {v === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '24px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Turmas</h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {turmasFiltradas.length} de {turmasMock.length} turmas
            </p>
          </div>
          <button
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={15} /> Nova Turma
          </button>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total de Turmas',    valor: turmasMock.length,                   icone: BookOpen,    cor: C.blue    },
            { label: 'Turmas Abertas',     valor: totalAbertas,                        icone: Calendar,    cor: '#1a56ff' },
            { label: 'Em Andamento',       valor: totalAndamento,                      icone: TrendingUp,  cor: '#10b981' },
            { label: 'Alunos Matriculados',valor: `${totalMatriculados}/${totalVagas}`, icone: Users,       cor: '#f59e0b' },
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
          <SelectFiltro value={statusFiltro} onChange={setStatusFiltro} options={statusOpcoes} />
          {(cargoFiltro !== 'Todos os cargos' || statusFiltro !== 'Todos') && (
            <button
              onClick={() => { setCargoFiltro('Todos os cargos'); setStatusFiltro('Todos') }}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600 }}
            >
              Limpar filtros
            </button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: C.muted }}>
            {turmasFiltradas.length} resultado{turmasFiltradas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid de cards */}
        {visualizacao === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {turmasFiltradas.map(turma => (
              <div
                key={turma.id}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'transform 150ms, box-shadow 150ms', position: 'relative', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ height: '4px', background: turma.cor }} />
                <div style={{ padding: '16px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${turma.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {turma.icone}
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', background: corStatus(turma.status).bg, color: corStatus(turma.status).color, border: `0.5px solid ${corStatus(turma.status).border}`, borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                        {turma.status}
                      </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setMenuAberto(menuAberto === turma.id ? null : turma.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: C.muted, borderRadius: '6px' }}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuAberto === turma.id && (
                        <div style={{ position: 'absolute', right: 0, top: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', minWidth: '140px', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                          {[
                            { icon: Eye,    label: 'Visualizar'            },
                            { icon: Edit,   label: 'Editar'                },
                            { icon: Copy,   label: 'Duplicar'              },
                            { icon: Trash2, label: 'Excluir', danger: true },
                          ].map(a => (
                            <div
                              key={a.label}
                              onClick={e => { e.stopPropagation(); setMenuAberto(null) }}
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

                  {/* Nome e curso */}
                  <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 4px', lineHeight: 1.4 }}>{turma.nome}</p>
                  <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 12px', lineHeight: 1.4 }}>{turma.curso}</p>

                  {/* Tag cargo */}
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.10)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '6px', padding: '2px 8px' }}>
                      {turma.cargo}
                    </span>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    {[
                      { icon: Users,    val: `${turma.matriculados}/${turma.vagas}`, label: 'Alunos'   },
                      { icon: Calendar, val: turma.inicio,                           label: 'Início'   },
                      { icon: Clock,    val: turma.fim,                              label: 'Término'  },
                    ].map(s => (
                      <div key={s.label} style={{ background: C.surface2, borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>{s.val}</div>
                        <div style={{ fontSize: '10px', color: C.muted }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Instrutor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(26,86,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: C.blue, flexShrink: 0 }}>
                      {turma.instrutor.split(' ').slice(-1)[0][0]}
                    </div>
                    <span style={{ fontSize: '11px', color: C.muted }}>{turma.instrutor}</span>
                  </div>

                  {/* Barra de ocupação */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: C.muted }}>Ocupação</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: ocupacao(turma) >= 80 ? '#10b981' : C.blue }}>{ocupacao(turma)}%</span>
                    </div>
                    <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '4px' }}>
                      <div style={{ background: ocupacao(turma) >= 80 ? '#10b981' : C.blue, height: '4px', borderRadius: '4px', width: `${ocupacao(turma)}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Card Nova Turma */}
            <div
              style={{ background: C.surface, border: `2px dashed ${C.border}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '32px', cursor: 'pointer', transition: 'all 150ms', minHeight: '200px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(26,86,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={22} color={C.blue} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: C.blue, margin: '0 0 4px' }}>Criar nova turma</p>
                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Clique para adicionar</p>
              </div>
            </div>
          </div>

        ) : (
          /* Visualização lista */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 90px 90px 90px', gap: '12px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>Turma</span><span>Cargo</span><span>Instrutor</span>
              <span style={{ textAlign: 'center' }}>Alunos</span>
              <span style={{ textAlign: 'center' }}>Ocupação</span>
              <span style={{ textAlign: 'center' }}>Status</span>
            </div>
            {turmasFiltradas.map(turma => (
              <div
                key={turma.id}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 90px 90px 90px', gap: '12px', alignItems: 'center', transition: 'background 150ms', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = C.surface}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${turma.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{turma.icone}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{turma.nome}</p>
                    <p style={{ fontSize: '11px', color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{turma.curso}</p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{turma.cargo}</span>
                <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{turma.instrutor}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, textAlign: 'center' }}>{turma.matriculados}/{turma.vagas}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: ocupacao(turma) >= 80 ? '#10b981' : C.blue, textAlign: 'center' }}>{ocupacao(turma)}%</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{ background: corStatus(turma.status).bg, color: corStatus(turma.status).color, border: `0.5px solid ${corStatus(turma.status).border}`, borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>
                    {turma.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {turmasFiltradas.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>🔍</span>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhuma turma encontrada</p>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Tente ajustar os filtros de busca</p>
            <button
              onClick={() => { setBusca(''); setCargoFiltro('Todos os cargos'); setStatusFiltro('Todos') }}
              style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Fechar menu ao clicar fora */}
      {menuAberto !== null && (
        <div
          onClick={() => setMenuAberto(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        />
      )}
    </LayoutAdmin>
  )
}
