import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, MoreVertical,
  Users, Calendar, TrendingUp,
  ChevronDown, BookOpen,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

const setores = [
  'Todos os setores',
  'Gestão e Suprimentos',
  'Administrativo',
  'Segurança do Trabalho',
  'Obras e Infraestrutura',
  'Equipamentos',
  'Tecnologia da Informação',
]

interface SubTurma {
  id: number
  nome: string
  curso: string
  alunos: number
  inicio: string
  fim: string
  status: 'Em andamento' | 'Não iniciada' | 'Encerrada'
  progresso: number
}

interface Turma {
  id: number
  cargo: string
  setor: string
  icone: string
  cor: string
  corBg: string
  totalAlunos: number
  cursosAtivos: number
  turmasAbertas: number
  progresso: number
  responsavel: string
  turmas: SubTurma[]
}

const turmasMock: Turma[] = [
  {
    id: 1,
    cargo: 'Coordenação de Suprimentos',
    setor: 'Gestão e Suprimentos',
    icone: '📦',
    cor: '#059669',
    corBg: 'rgba(5,150,105,0.10)',
    totalAlunos: 12,
    cursosAtivos: 3,
    turmasAbertas: 2,
    progresso: 45,
    responsavel: 'Antônio Carlos',
    turmas: [
      { id:1, nome:'Coord. Suprimentos — Turma A', curso:'Coordenação de Suprimentos', alunos:8, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:45 },
      { id:2, nome:'Coord. Suprimentos — Turma B', curso:'Gestão de Almoxarifado PGI-CSU-002', alunos:4, inicio:'01/05/2026', fim:'31/07/2026', status:'Não iniciada', progresso:0 },
    ],
  },
  {
    id: 2,
    cargo: 'Recursos Humanos',
    setor: 'Administrativo',
    icone: '👥',
    cor: '#db2777',
    corBg: 'rgba(219,39,119,0.10)',
    totalAlunos: 8,
    cursosAtivos: 2,
    turmasAbertas: 1,
    progresso: 62,
    responsavel: 'Ana Paula Rodrigues',
    turmas: [
      { id:3, nome:'RH — Turma Única', curso:'Gestão de Pessoas e Liderança', alunos:8, inicio:'15/03/2026', fim:'15/06/2026', status:'Em andamento', progresso:62 },
    ],
  },
  {
    id: 3,
    cargo: 'Segurança do Trabalho',
    setor: 'Segurança do Trabalho',
    icone: '🛡️',
    cor: '#dc2626',
    corBg: 'rgba(220,38,38,0.10)',
    totalAlunos: 18,
    cursosAtivos: 5,
    turmasAbertas: 3,
    progresso: 78,
    responsavel: 'Juliana Ferreira Costa',
    turmas: [
      { id:4, nome:'SESMT — Turma A', curso:'NR-35 — Trabalho em Altura', alunos:8, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:78 },
      { id:5, nome:'SESMT — Turma B', curso:'SIPAT — Segurança no Canteiro de Obras', alunos:6, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:55 },
      { id:6, nome:'SESMT — Turma C', curso:'NR-10 — Segurança em Instalações Elétricas', alunos:4, inicio:'01/05/2026', fim:'31/07/2026', status:'Não iniciada', progresso:0 },
    ],
  },
  {
    id: 4,
    cargo: 'Serviços Gerais',
    setor: 'Obras e Infraestrutura',
    icone: '🏗️',
    cor: '#0891b2',
    corBg: 'rgba(8,145,178,0.10)',
    totalAlunos: 22,
    cursosAtivos: 3,
    turmasAbertas: 2,
    progresso: 38,
    responsavel: 'Roberto Silva Pereira',
    turmas: [
      { id:7, nome:'Serviços Gerais — Turma A', curso:'Segurança no Canteiro de Obras', alunos:14, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:38 },
      { id:8, nome:'Serviços Gerais — Turma B', curso:'Primeiros Socorros no Trabalho', alunos:8, inicio:'15/05/2026', fim:'15/08/2026', status:'Não iniciada', progresso:0 },
    ],
  },
  {
    id: 5,
    cargo: 'Comunicação',
    setor: 'Administrativo',
    icone: '📢',
    cor: '#7c3aed',
    corBg: 'rgba(124,58,237,0.10)',
    totalAlunos: 6,
    cursosAtivos: 2,
    turmasAbertas: 1,
    progresso: 54,
    responsavel: 'Camila Souza Barbosa',
    turmas: [
      { id:9, nome:'Comunicação — Turma Única', curso:'Comunicação Corporativa e Marketing Digital', alunos:6, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:54 },
    ],
  },
  {
    id: 6,
    cargo: 'Engenharia',
    setor: 'Obras e Infraestrutura',
    icone: '📐',
    cor: '#1a56ff',
    corBg: 'rgba(26,86,255,0.10)',
    totalAlunos: 16,
    cursosAtivos: 4,
    turmasAbertas: 3,
    progresso: 71,
    responsavel: 'Eng. Carlos Mendes',
    turmas: [
      { id:10, nome:'Engenharia — Turma A', curso:'Leitura e Interpretação de Projetos', alunos:6, inicio:'01/03/2026', fim:'31/05/2026', status:'Em andamento', progresso:88 },
      { id:11, nome:'Engenharia — Turma B', curso:'Gestão da Qualidade ISO 9001', alunos:6, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:42 },
      { id:12, nome:'Engenharia — Turma C', curso:'Topografia Aplicada à Construção Civil', alunos:4, inicio:'01/05/2026', fim:'31/07/2026', status:'Não iniciada', progresso:0 },
    ],
  },
  {
    id: 7,
    cargo: 'Manutenções - Oficina',
    setor: 'Equipamentos',
    icone: '⚙️',
    cor: '#f59e0b',
    corBg: 'rgba(245,158,11,0.10)',
    totalAlunos: 14,
    cursosAtivos: 4,
    turmasAbertas: 2,
    progresso: 49,
    responsavel: 'André Santos Machado',
    turmas: [
      { id:13, nome:'Oficina — Turma Elétrica', curso:'NR-10 — Segurança em Instalações Elétricas', alunos:8, inicio:'01/04/2026', fim:'30/06/2026', status:'Em andamento', progresso:58 },
      { id:14, nome:'Oficina — Turma Mecânica', curso:'NR-12 — Segurança em Máquinas e Equipamentos', alunos:6, inicio:'15/04/2026', fim:'15/07/2026', status:'Em andamento', progresso:35 },
    ],
  },
  {
    id: 8,
    cargo: 'Tecnologia da Informação',
    setor: 'Administrativo',
    icone: '💻',
    cor: '#0891b2',
    corBg: 'rgba(8,145,178,0.10)',
    totalAlunos: 6,
    cursosAtivos: 2,
    turmasAbertas: 2,
    progresso: 33,
    responsavel: 'Pablo Henrique Sousa',
    turmas: [
      { id:15, nome:'TI — Turma Suporte',        curso:'Segurança da Informação e LGPD',         alunos:3, inicio:'01/05/2026', fim:'31/07/2026', status:'Em andamento', progresso:33 },
      { id:16, nome:'TI — Turma Desenvolvimento', curso:'Gestão de Projetos e Metodologias Ágeis', alunos:3, inicio:'15/05/2026', fim:'15/08/2026', status:'Não iniciada', progresso:0  },
    ],
  },
]

export function TurmasAdmin({ onNavigate, onLogout }: {
  onNavigate: (p: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')
  const [setorFiltro, setSetorFiltro] = useState('Todos os setores')
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null)
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid')
  const [expandido, setExpandido] = useState<number | null>(null)

  const [modalNovaTurma, setModalNovaTurma] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [novoCargo, setNovoCargo] = useState('')
  const [novoSetor, setNovoSetor] = useState('')
  const [novoResponsavel, setNovoResponsavel] = useState('')
  const [novoCurso, setNovoCurso] = useState('')
  const [novoInicio, setNovoInicio] = useState('')
  const [novoFim, setNovoFim] = useState('')
  const [novoAlunos, setNovoAlunos] = useState('')
  const [novoIcone, setNovoIcone] = useState('🏷️')
  const [novaCor, setNovaCor] = useState('#1a56ff')
  const [erroForm, setErroForm] = useState('')

  const [modalEditarTurma, setModalEditarTurma] = useState(false)
  const [turmaEditando, setTurmaEditando] = useState<Turma | null>(null)

  const [editNome, setEditNome] = useState('')
  const [editCargo, setEditCargo] = useState('')
  const [editSetor, setEditSetor] = useState('')
  const [editResponsavel, setEditResponsavel] = useState('')
  const [editCurso, setEditCurso] = useState('')
  const [editInicio, setEditInicio] = useState('')
  const [editFim, setEditFim] = useState('')
  const [editAlunos, setEditAlunos] = useState('')
  const [editIcone, setEditIcone] = useState('🏷️')
  const [editCor, setEditCor] = useState('#1a56ff')
  const [erroFormEdicao, setErroFormEdicao] = useState('')

  const iconesDisponiveis = ['🏗️','📦','👥','🛡️','📢','📐','⚙️','💻','📋','🏥','⚡','🚜','🛣️','♻️','📊']
  const coresDisponiveis  = ['#1a56ff','#dc2626','#059669','#d97706','#7c3aed','#db2777','#0891b2','#f59e0b','#16a34a','#0284c7']

  const salvarNovaTurma = () => {
    if (!novoCargo.trim() || !novoResponsavel.trim() || !novoSetor || !novoCurso.trim() || !novoInicio || !novoFim) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }
    const novaEntrada: Turma = {
      id: turmasMock.length + Date.now(),
      cargo: novoCargo,
      setor: novoSetor,
      icone: novoIcone,
      cor: novaCor,
      corBg: `${novaCor}18`,
      totalAlunos: parseInt(novoAlunos) || 0,
      cursosAtivos: 1,
      turmasAbertas: 1,
      progresso: 0,
      responsavel: novoResponsavel,
      turmas: [{
        id: Date.now(),
        nome: novoNome || `${novoCargo} — Turma A`,
        curso: novoCurso,
        alunos: parseInt(novoAlunos) || 0,
        inicio: novoInicio.split('-').reverse().join('/'),
        fim: novoFim.split('-').reverse().join('/'),
        status: 'Não iniciada',
        progresso: 0,
      }],
    }
    setNovoNome(''); setNovoCargo(''); setNovoSetor(''); setNovoResponsavel('')
    setNovoCurso(''); setNovoInicio(''); setNovoFim(''); setNovoAlunos('')
    setNovoIcone('🏷️'); setNovaCor('#1a56ff'); setErroForm('')
    setModalNovaTurma(false)
    alert(`Turma "${novaEntrada.cargo}" criada com sucesso! (Será salva no banco quando o backend estiver ativo)`)
  }

  const abrirEdicao = (grupo: Turma) => {
    setTurmaEditando(grupo)
    setEditCargo(grupo.cargo)
    setEditSetor(grupo.setor)
    setEditResponsavel(grupo.responsavel)
    setEditIcone(grupo.icone)
    setEditCor(grupo.cor)
    setEditAlunos(grupo.totalAlunos.toString())
    const primeiraTurma = grupo.turmas[0]
    setEditNome(primeiraTurma?.nome ?? '')
    setEditCurso(primeiraTurma?.curso ?? '')
    const converterData = (data: string) => {
      if (!data || !data.includes('/')) return ''
      const [d, m, y] = data.split('/')
      return `${y}-${m}-${d}`
    }
    setEditInicio(converterData(primeiraTurma?.inicio ?? ''))
    setEditFim(converterData(primeiraTurma?.fim ?? ''))
    setErroFormEdicao('')
    setMenuAbertoId(null)
    setModalEditarTurma(true)
  }

  const salvarEdicao = () => {
    if (!editCargo.trim() || !editResponsavel.trim() || !editSetor) {
      setErroFormEdicao('Preencha todos os campos obrigatórios.')
      return
    }
    setModalEditarTurma(false)
    setTurmaEditando(null)
    setErroFormEdicao('')
    alert(`Turma "${editCargo}" atualizada com sucesso!\n(Será salva no banco quando o backend estiver ativo)`)
  }

  const turmasFiltradas = useMemo(() => {
    return turmasMock.filter(g => {
      const matchBusca = g.cargo.toLowerCase().includes(busca.toLowerCase()) ||
                         g.setor.toLowerCase().includes(busca.toLowerCase()) ||
                         g.responsavel.toLowerCase().includes(busca.toLowerCase())
      const matchSetor = setorFiltro === 'Todos os setores' || g.setor === setorFiltro
      return matchBusca && matchSetor
    })
  }, [busca, setorFiltro])

  const totalAlunos    = turmasMock.reduce((s, g) => s + g.totalAlunos, 0)
  const totalSubTurmas = turmasMock.reduce((s, g) => s + g.turmas.length, 0)
  const turmasAbertas  = turmasMock.reduce((s, g) => s + g.turmasAbertas, 0)

  const corSubStatus = (s: string) => ({
    'Em andamento': { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', border: 'rgba(16,185,129,0.25)'  },
    'Não iniciada': { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.25)' },
    'Encerrada':    { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', border: 'rgba(239,68,68,0.25)'   },
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
              {turmasFiltradas.length} de {turmasMock.length} grupos
            </p>
          </div>
          <button
            onClick={() => setModalNovaTurma(true)}
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
            { label: 'Grupos de Cargo',    valor: turmasMock.length,  icone: BookOpen,   cor: C.blue    },
            { label: 'Turmas Cadastradas', valor: totalSubTurmas,     icone: Calendar,   cor: '#1a56ff' },
            { label: 'Turmas em Aberto',   valor: turmasAbertas,      icone: TrendingUp, cor: '#10b981' },
            { label: 'Total de Alunos',    valor: totalAlunos,        icone: Users,      cor: '#f59e0b' },
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
          <SelectFiltro value={setorFiltro} onChange={setSetorFiltro} options={setores} />
          {setorFiltro !== 'Todos os setores' && (
            <button
              onClick={() => setSetorFiltro('Todos os setores')}
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
            {turmasFiltradas.map(grupo => (
              <div
                key={grupo.id}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 150ms' }}
              >
                <div style={{ height: '4px', background: grupo.cor }} />
                <div style={{ padding: '16px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: grupo.corBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {grupo.icone}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 4px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{grupo.cargo}</p>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: grupo.cor, background: grupo.corBg, border: `0.5px solid ${grupo.cor}60`, borderRadius: '6px', padding: '2px 7px', display: 'inline-block' }}>
                          {grupo.setor}
                        </span>
                      </div>
                    </div>
                    {/* Botão 3 pontos */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setMenuAbertoId(menuAbertoId === grupo.id ? null : grupo.id)
                        }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '4px', color: C.muted, borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <MoreVertical size={16} color={C.muted} />
                      </button>

                      {/* Dropdown menu */}
                      {menuAbertoId === grupo.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%',
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: '10px',
                          minWidth: '160px',
                          zIndex: 100,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          overflow: 'hidden',
                          marginTop: '4px',
                        }}>
                          {[
                            {
                              icon: '✏️',
                              label: 'Editar turma',
                              action: () => abrirEdicao(grupo),
                              danger: false,
                            },
                            {
                              icon: '➕',
                              label: 'Adicionar curso',
                              action: () => setMenuAbertoId(null),
                              danger: false,
                            },
                            {
                              icon: '📋',
                              label: 'Ver relatório',
                              action: () => setMenuAbertoId(null),
                              danger: false,
                            },
                            {
                              icon: '🗑️',
                              label: 'Excluir turma',
                              action: () => {
                                setMenuAbertoId(null)
                                if (window.confirm(`Tem certeza que deseja excluir a turma "${grupo.cargo}"?`)) {
                                  alert('Exclusão registrada. Será processada quando o backend estiver ativo.')
                                }
                              },
                              danger: true,
                            },
                          ].map(item => (
                            <div
                              key={item.label}
                              onClick={e => { e.stopPropagation(); item.action() }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 14px', cursor: 'pointer',
                                fontSize: '13px',
                                color: item.danger ? '#ef4444' : C.text,
                                transition: 'background 100ms',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.08)' : `rgba(26,86,255,0.06)`}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ fontSize: '14px' }}>{item.icon}</span>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Responsável */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: grupo.corBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: grupo.cor, flexShrink: 0 }}>
                      {grupo.responsavel.split(' ')[0][0]}{grupo.responsavel.split(' ').filter(Boolean).slice(-1)[0]?.[0] ?? ''}
                    </div>
                    <span style={{ fontSize: '11px', color: C.muted }}>{grupo.responsavel}</span>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { val: grupo.totalAlunos,   label: 'Alunos'  },
                      { val: grupo.cursosAtivos,  label: 'Cursos'  },
                      { val: grupo.turmasAbertas, label: 'Turmas'  },
                    ].map(s => (
                      <div key={s.label} style={{ background: C.surface2, borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>{s.val}</div>
                        <div style={{ fontSize: '10px', color: C.muted }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Barra de progresso */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: C.muted }}>Progresso médio</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: grupo.cor }}>{grupo.progresso}%</span>
                    </div>
                    <div style={{ background: grupo.corBg, borderRadius: '4px', height: '4px' }}>
                      <div style={{ background: grupo.cor, height: '4px', borderRadius: '4px', width: `${grupo.progresso}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>

                  {/* Botão expandir */}
                  <button
                    onClick={() => setExpandido(expandido === grupo.id ? null : grupo.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', background: 'none', border: 'none', borderTop: `1px solid ${C.border}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: C.blue, padding: '10px 0 0', justifyContent: 'center' }}
                  >
                    <ChevronDown size={14} style={{ transform: expandido === grupo.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }} />
                    {expandido === grupo.id ? 'Ocultar cursos' : `Ver ${grupo.turmas.length} curso${grupo.turmas.length !== 1 ? 's' : ''}`}
                  </button>

                  {/* Sub-turmas expandidas */}
                  {expandido === grupo.id && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {grupo.turmas.map(t => (
                        <div key={t.id} style={{ background: C.surface2, borderRadius: '8px', padding: '10px 12px', borderLeft: `3px solid ${corSubStatus(t.status).color}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: C.text, flex: 1 }}>{t.nome}</span>
                            <span style={{ fontSize: '10px', fontWeight: 700, color: corSubStatus(t.status).color, background: corSubStatus(t.status).bg, border: `0.5px solid ${corSubStatus(t.status).border}`, borderRadius: '4px', padding: '1px 6px', flexShrink: 0 }}>
                              {t.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '11px', color: C.muted, margin: '0 0 6px', lineHeight: 1.4 }}>{t.curso}</p>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: C.muted }}>
                            <span>👥 {t.alunos} alunos</span>
                            <span>📅 {t.inicio} – {t.fim}</span>
                          </div>
                          {t.status === 'Em andamento' && (
                            <div style={{ marginTop: '6px', background: 'rgba(16,185,129,0.12)', borderRadius: '3px', height: '3px' }}>
                              <div style={{ background: '#10b981', height: '3px', borderRadius: '3px', width: `${t.progresso}%` }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Card Nova Turma */}
            <div
              onClick={() => setModalNovaTurma(true)}
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px', gap: '12px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>Cargo</span><span>Setor</span><span>Responsável</span>
              <span style={{ textAlign: 'center' }}>Alunos</span>
              <span style={{ textAlign: 'center' }}>Turmas</span>
              <span style={{ textAlign: 'center' }}>Progresso</span>
            </div>
            {turmasFiltradas.map(grupo => (
              <div
                key={grupo.id}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 80px 80px', gap: '12px', alignItems: 'center', transition: 'background 150ms', cursor: 'pointer', borderLeft: `3px solid ${grupo.cor}` }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = C.surface}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: grupo.corBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{grupo.icone}</div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{grupo.cargo}</p>
                </div>
                <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{grupo.setor}</span>
                <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{grupo.responsavel}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, textAlign: 'center' }}>{grupo.totalAlunos}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, textAlign: 'center' }}>{grupo.turmas.length}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: grupo.cor, textAlign: 'center' }}>{grupo.progresso}%</span>
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
              onClick={() => { setBusca(''); setSetorFiltro('Todos os setores') }}
              style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Fechar menu ao clicar fora */}
      {menuAbertoId !== null && (
        <div
          onClick={() => setMenuAbertoId(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        />
      )}

      {/* Modal Nova Turma */}
      {modalNovaTurma && (
        <div
          onClick={() => setModalNovaTurma(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.60)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: C.surface, borderRadius: '16px', width: '100%', maxWidth: '560px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', border: `1px solid ${C.border}`, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ height: '4px', background: novaCor }} />

            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Nova Turma</h2>
                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Preencha os dados para criar uma nova turma</p>
              </div>
              <button
                onClick={() => setModalNovaTurma(false)}
                style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: C.muted }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {erroForm && (
                <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ef4444' }}>
                  ⚠️ {erroForm}
                </div>
              )}

              {/* Ícone + Cor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ícone</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px' }}>
                    {iconesDisponiveis.map(ic => (
                      <button
                        key={ic}
                        onClick={() => setNovoIcone(ic)}
                        style={{ fontSize: '18px', width: '32px', height: '32px', borderRadius: '6px', border: `2px solid ${novoIcone === ic ? novaCor : 'transparent'}`, background: novoIcone === ic ? `${novaCor}18` : 'none', cursor: 'pointer', transition: 'all 150ms' }}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cor da turma</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px' }}>
                    {coresDisponiveis.map(cor => (
                      <button
                        key={cor}
                        onClick={() => setNovaCor(cor)}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', background: cor, border: `3px solid ${novaCor === cor ? C.text : 'transparent'}`, cursor: 'pointer', outline: 'none', transition: 'all 150ms', boxShadow: novaCor === cor ? `0 0 0 2px ${C.bg}, 0 0 0 4px ${cor}` : 'none' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Nome do grupo / cargo */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Nome do grupo / cargo <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={novoCargo}
                  onChange={e => setNovoCargo(e.target.value)}
                  placeholder="Ex: Tecnologia da Informação"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = novaCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Setor */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Setor <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={novoSetor}
                  onChange={e => setNovoSetor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: novoSetor ? C.text : C.muted, outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">Selecione o setor</option>
                  {setores.filter(s => s !== 'Todos os setores').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Responsável */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Responsável <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={novoResponsavel}
                  onChange={e => setNovoResponsavel(e.target.value)}
                  placeholder="Nome do responsável pela turma"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = novaCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Nome da turma */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome da turma</label>
                <input
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  placeholder={`Ex: ${novoCargo || 'Grupo'} — Turma A`}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = novaCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>Se não informado, será gerado automaticamente</p>
              </div>

              {/* Curso vinculado */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Curso vinculado <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  value={novoCurso}
                  onChange={e => setNovoCurso(e.target.value)}
                  placeholder="Nome do curso desta turma"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = novaCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Período */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Data de início <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={novoInicio}
                    onChange={e => setNovoInicio(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = novaCor}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Data de término <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={novoFim}
                    onChange={e => setNovoFim(e.target.value)}
                    min={novoInicio}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = novaCor}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* Número de alunos */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Número de alunos estimado</label>
                <input
                  type="number"
                  value={novoAlunos}
                  onChange={e => setNovoAlunos(e.target.value)}
                  placeholder="0"
                  min="0"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = novaCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Preview */}
              {novoCargo && (
                <div style={{ background: C.surface2, border: `1px solid ${novaCor}44`, borderRadius: '10px', padding: '14px', borderLeft: `4px solid ${novaCor}` }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview do card</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${novaCor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {novoIcone}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>{novoCargo}</p>
                      <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{novoSetor || 'Setor não selecionado'} · {novoResponsavel || 'Responsável não informado'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, background: C.surface2, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setModalNovaTurma(false); setErroForm('') }}
                style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: C.text, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarNovaTurma}
                style={{ padding: '10px 24px', background: novaCor, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 150ms' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                ✓ Criar turma
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Editar Turma */}
      {modalEditarTurma && turmaEditando && (
        <div
          onClick={() => setModalEditarTurma(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.60)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:C.surface, borderRadius:'16px', width:'100%', maxWidth:'560px', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.4)', border:`1px solid ${C.border}`, maxHeight:'90vh', overflowY:'auto' }}
          >
            {/* Faixa colorida */}
            <div style={{ height:'4px', background:editCor }} />

            {/* Header */}
            <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:`${editCor}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>
                  {editIcone}
                </div>
                <div>
                  <h2 style={{ fontSize:'16px', fontWeight:700, color:C.text, margin:'0 0 2px' }}>
                    Editar Turma
                  </h2>
                  <p style={{ fontSize:'12px', color:C.muted, margin:0 }}>
                    {turmaEditando.cargo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalEditarTurma(false)}
                style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', color:C.muted }}
              >
                ×
              </button>
            </div>

            {/* Formulário */}
            <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'14px' }}>

              {erroFormEdicao && (
                <div style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'#ef4444' }}>
                  ⚠️ {erroFormEdicao}
                </div>
              )}

              {/* Ícone + Cor */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div>
                  <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Ícone</label>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'10px' }}>
                    {iconesDisponiveis.map(ic => (
                      <button key={ic} onClick={() => setEditIcone(ic)}
                        style={{ fontSize:'18px', width:'32px', height:'32px', borderRadius:'6px', border:`2px solid ${editIcone===ic ? editCor : 'transparent'}`, background:editIcone===ic ? `${editCor}18` : 'none', cursor:'pointer', transition:'all 150ms' }}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Cor da turma</label>
                  <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'10px' }}>
                    {coresDisponiveis.map(cor => (
                      <button key={cor} onClick={() => setEditCor(cor)}
                        style={{ width:'28px', height:'28px', borderRadius:'50%', background:cor, border:`3px solid ${editCor===cor ? C.text : 'transparent'}`, cursor:'pointer', outline:'none', transition:'all 150ms', boxShadow:editCor===cor?`0 0 0 2px ${C.bg}, 0 0 0 4px ${cor}`:'none' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Nome do grupo / cargo */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Nome do grupo / cargo <span style={{ color:'#ef4444' }}>*</span>
                </label>
                <input value={editCargo} onChange={e => setEditCargo(e.target.value)}
                  placeholder="Ex: Tecnologia da Informação"
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = editCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Setor */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Setor <span style={{ color:'#ef4444' }}>*</span>
                </label>
                <select value={editSetor} onChange={e => setEditSetor(e.target.value)}
                  style={{ width:'100%', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:editSetor?C.text:C.muted, outline:'none', cursor:'pointer' }}>
                  <option value="">Selecione o setor</option>
                  {setores.filter(s => s !== 'Todos os setores').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Responsável */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Responsável <span style={{ color:'#ef4444' }}>*</span>
                </label>
                <input value={editResponsavel} onChange={e => setEditResponsavel(e.target.value)}
                  placeholder="Nome do responsável"
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = editCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Nome da turma */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Nome da turma principal
                </label>
                <input value={editNome} onChange={e => setEditNome(e.target.value)}
                  placeholder="Nome da turma"
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = editCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Curso vinculado */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Curso vinculado principal
                </label>
                <input value={editCurso} onChange={e => setEditCurso(e.target.value)}
                  placeholder="Nome do curso"
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = editCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Período */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
                <div>
                  <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Data de início</label>
                  <input type="date" value={editInicio} onChange={e => setEditInicio(e.target.value)}
                    style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none', cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor = editCor}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div>
                  <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Data de término</label>
                  <input type="date" value={editFim} onChange={e => setEditFim(e.target.value)} min={editInicio}
                    style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none', cursor:'pointer' }}
                    onFocus={e => e.target.style.borderColor = editCor}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* Alunos */}
              <div>
                <label style={{ fontSize:'11px', fontWeight:700, color:C.muted, display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  Número de alunos
                </label>
                <input type="number" value={editAlunos} onChange={e => setEditAlunos(e.target.value)}
                  placeholder="0" min="0"
                  style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', color:C.text, outline:'none' }}
                  onFocus={e => e.target.style.borderColor = editCor}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Preview */}
              {editCargo && (
                <div style={{ background:C.surface2, border:`1px solid ${editCor}44`, borderRadius:'10px', padding:'14px', borderLeft:`4px solid ${editCor}` }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color:C.muted, margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    Preview do card
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`${editCor}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                      {editIcone}
                    </div>
                    <div>
                      <p style={{ fontSize:'13px', fontWeight:700, color:C.text, margin:'0 0 2px' }}>{editCargo}</p>
                      <p style={{ fontSize:'11px', color:C.muted, margin:0 }}>
                        {editSetor || 'Setor não selecionado'} · {editResponsavel || 'Responsável não informado'}
                        {editAlunos ? ` · ${editAlunos} alunos` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, background:C.surface2, display:'flex', gap:'10px', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontSize:'11px', color:C.muted, margin:0 }}>
                * Campos obrigatórios
              </p>
              <div style={{ display:'flex', gap:'10px' }}>
                <button
                  onClick={() => { setModalEditarTurma(false); setErroFormEdicao('') }}
                  style={{ padding:'10px 20px', background:'none', border:`1.5px solid ${C.border}`, borderRadius:'8px', fontSize:'13px', fontWeight:500, color:C.text, cursor:'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEdicao}
                  style={{ padding:'10px 24px', background:editCor, border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:700, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', transition:'opacity 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  ✓ Salvar alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  )
}
