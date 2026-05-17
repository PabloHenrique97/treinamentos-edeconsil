import { useState, useMemo } from 'react'
import {
  Search, Filter, ChevronDown,
  Eye, Edit, Star, Users,
  TrendingUp, UserCheck,
  Mail, Clock, Download, Plus
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

interface Instrutor {
  id: number
  nome: string
  cargo: string
  especialidade: string
  cr: string
  email: string
  ultimoAcesso: string
  status: 'Ativo' | 'Inativo'
  cursosMinistrados: number
  alunosAtivos: number
  avaliacaoMedia: number
  centroCusto: string
}

const instrutoresMock: Instrutor[] = [
  { id: 1,  nome: 'José R Miranda Júnior',    cargo: 'Instrutor Sênior',   especialidade: 'Liderança e Gestão de Obras',     cr: 'INS-001', email: 'josemiranda@edeconsil.com.br',     ultimoAcesso: 'Hoje, 08:15',   status: 'Ativo',   cursosMinistrados: 8, alunosAtivos: 142, avaliacaoMedia: 4.9, centroCusto: 'Obras e Infraestrutura'   },
  { id: 2,  nome: 'Pablo Henrique Sousa',     cargo: 'Instrutor Pleno',    especialidade: 'Segurança do Trabalho — NR',      cr: 'INS-002', email: 'pablohenrique@edeconsil.com.br',   ultimoAcesso: 'Hoje, 07:30',   status: 'Ativo',   cursosMinistrados: 6, alunosAtivos: 118, avaliacaoMedia: 4.8, centroCusto: 'Segurança do Trabalho'    },
  { id: 3,  nome: 'Ryan Patrick Fernandes',   cargo: 'Instrutor Sênior',   especialidade: 'Topografia e Leitura de Projetos',cr: 'INS-003', email: 'ryanpatrick@edeconsil.com.br',     ultimoAcesso: 'Ontem, 16:45',  status: 'Ativo',   cursosMinistrados: 5, alunosAtivos: 97,  avaliacaoMedia: 4.7, centroCusto: 'Obras e Infraestrutura'   },
  { id: 4,  nome: 'Pablo Alexssander Costa',  cargo: 'Instrutor Pleno',    especialidade: 'Operação de Máquinas Pesadas',    cr: 'INS-004', email: 'pabloalexssander@edeconsil.com.br',ultimoAcesso: 'Ontem, 14:20',  status: 'Ativo',   cursosMinistrados: 4, alunosAtivos: 86,  avaliacaoMedia: 4.6, centroCusto: 'Terraplanagem'            },
  { id: 5,  nome: 'Carla Beatriz Monteiro',   cargo: 'Instrutora Sênior',  especialidade: 'Gestão da Qualidade ISO 9001',    cr: 'INS-005', email: 'carlabeatriz@edeconsil.com.br',    ultimoAcesso: 'Hoje, 09:00',   status: 'Ativo',   cursosMinistrados: 7, alunosAtivos: 134, avaliacaoMedia: 4.9, centroCusto: 'Gestão e Suprimentos'    },
  { id: 6,  nome: 'Marcos Andrade Pinto',     cargo: 'Instrutor Júnior',   especialidade: 'Pavimentação Asfáltica',           cr: 'INS-006', email: 'marcosandrade@edeconsil.com.br',   ultimoAcesso: '15/05/2026',    status: 'Ativo',   cursosMinistrados: 3, alunosAtivos: 54,  avaliacaoMedia: 4.4, centroCusto: 'Pavimentação'             },
  { id: 7,  nome: 'Fernanda Queiroz Lima',    cargo: 'Instrutora Plena',   especialidade: 'Gestão Ambiental e Resíduos',     cr: 'INS-007', email: 'fernandaqueiroz@edeconsil.com.br', ultimoAcesso: '14/05/2026',    status: 'Ativo',   cursosMinistrados: 5, alunosAtivos: 78,  avaliacaoMedia: 4.7, centroCusto: 'Segurança do Trabalho'    },
  { id: 8,  nome: 'Ricardo Tavares Braga',    cargo: 'Instrutor Sênior',   especialidade: 'Manutenção Elétrica e NR-10',     cr: 'INS-008', email: 'ricardotavares@edeconsil.com.br',  ultimoAcesso: '13/05/2026',    status: 'Inativo', cursosMinistrados: 4, alunosAtivos: 0,   avaliacaoMedia: 4.5, centroCusto: 'Manutenção Elétrica'     },
  { id: 9,  nome: 'Luciana Freitas Campos',   cargo: 'Instrutora Júnior',  especialidade: 'Primeiros Socorros e SIPAT',      cr: 'INS-009', email: 'lucianafreitas@edeconsil.com.br',  ultimoAcesso: 'Hoje, 10:30',   status: 'Ativo',   cursosMinistrados: 3, alunosAtivos: 62,  avaliacaoMedia: 4.6, centroCusto: 'Segurança do Trabalho'    },
  { id: 10, nome: 'Sandro Melo Vasconcelos',  cargo: 'Instrutor Pleno',    especialidade: 'Manutenção Mecânica e NR-12',     cr: 'INS-010', email: 'sandromelo@edeconsil.com.br',      ultimoAcesso: 'Ontem, 11:00',  status: 'Ativo',   cursosMinistrados: 4, alunosAtivos: 71,  avaliacaoMedia: 4.5, centroCusto: 'Manutenção Mecânica'     },
]

const niveis = ['Todos os níveis', 'Instrutor Júnior', 'Instrutor Pleno', 'Instrutora Júnior', 'Instrutora Plena', 'Instrutor Sênior', 'Instrutora Sênior']
const statusOpcoes = ['Todos', 'Ativo', 'Inativo']

const coresAvatar = ['#1a56ff','#10b981','#8b5cf6','#f59e0b','#db2777','#059669','#0891b2','#dc2626','#7c3aed','#d97706']

function getIniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function corAvatar(id: number) {
  return coresAvatar[(id - 1) % coresAvatar.length]
}

type CampoOrdem = 'nome' | 'cr' | 'avaliacaoMedia' | 'alunosAtivos'

export function InstrutoresAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')
  const [nivelFiltro, setNivelFiltro] = useState('Todos os níveis')
  const [crFiltro, setCrFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [ordenacao, setOrdenacao] = useState<CampoOrdem>('nome')
  const [ordemDir, setOrdemDir] = useState<'asc' | 'desc'>('asc')

  const instrutoresFiltrados = useMemo(() => {
    let result = instrutoresMock.filter(i => {
      const matchBusca  = i.nome.toLowerCase().includes(busca.toLowerCase()) ||
                          i.email.toLowerCase().includes(busca.toLowerCase()) ||
                          i.especialidade.toLowerCase().includes(busca.toLowerCase())
      const matchNivel  = nivelFiltro === 'Todos os níveis' || i.cargo === nivelFiltro
      const matchCr     = crFiltro === '' || i.cr.toLowerCase().includes(crFiltro.toLowerCase())
      const matchStatus = statusFiltro === 'Todos' || i.status === statusFiltro
      return matchBusca && matchNivel && matchCr && matchStatus
    })

    result = [...result].sort((a, b) => {
      let va: string | number = a[ordenacao]
      let vb: string | number = b[ordenacao]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return ordemDir === 'asc' ? -1 : 1
      if (va > vb) return ordemDir === 'asc' ? 1  : -1
      return 0
    })

    return result
  }, [busca, nivelFiltro, crFiltro, statusFiltro, ordenacao, ordemDir])

  function limparFiltros() {
    setBusca('')
    setNivelFiltro('Todos os níveis')
    setCrFiltro('')
    setStatusFiltro('Todos')
  }

  function toggleOrdem(campo: CampoOrdem) {
    if (ordenacao === campo) setOrdemDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setOrdenacao(campo); setOrdemDir('asc') }
  }

  const totalAtivos    = instrutoresMock.filter(i => i.status === 'Ativo').length
  const totalAlunos    = instrutoresMock.reduce((s, i) => s + i.alunosAtivos, 0)
  const totalCursos    = instrutoresMock.reduce((s, i) => s + i.cursosMinistrados, 0)
  const mediaAvaliacao = (instrutoresMock.reduce((s, i) => s + i.avaliacaoMedia, 0) / instrutoresMock.length).toFixed(1)

  function RenderEstrelas({ nota }: { nota: number }) {
    const cheias = Math.floor(nota)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={11} color={i <= cheias ? '#f59e0b' : C.border} fill={i <= cheias ? '#f59e0b' : 'none'} />
        ))}
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', marginLeft: '4px' }}>
          {nota.toFixed(1)}
        </span>
      </div>
    )
  }

  const temFiltroAtivo = busca || nivelFiltro !== 'Todos os níveis' || crFiltro || statusFiltro !== 'Todos'

  const selectStyle: React.CSSProperties = {
    appearance: 'none', background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px',
    color: C.text, cursor: 'pointer', outline: 'none',
  }

  const cols = '2fr 1.3fr 100px 1.2fr 120px 90px 90px 90px'

  const thLabels: { label: string; campo: CampoOrdem | null }[] = [
    { label: 'Nome',          campo: 'nome'          },
    { label: 'Especialidade', campo: null             },
    { label: 'CR',            campo: 'cr'             },
    { label: 'E-mail',        campo: null             },
    { label: 'Último Acesso', campo: null             },
    { label: 'Alunos',        campo: 'alunosAtivos'  },
    { label: 'Avaliação',     campo: 'avaliacaoMedia' },
    { label: 'Status',        campo: null             },
  ]

  return (
    <LayoutAdmin
      paginaAtiva="instrutoresAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Gestão de Instrutores"
      topbarSubtitulo="Gerencie os instrutores cadastrados na plataforma."
    >
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Instrutores</h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {instrutoresFiltrados.length} de {instrutoresMock.length} instrutores
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: C.surface, color: C.text, border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}>
              <Download size={14} /> Exportar
            </button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: C.blue, color: '#fff', border: 'none',
                borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={14} /> Novo Instrutor
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total de Instrutores', valor: instrutoresMock.length, icon: UserCheck,  cor: C.blue    },
            { label: 'Instrutores Ativos',   valor: totalAtivos,            icon: TrendingUp, cor: '#10b981' },
            { label: 'Alunos Atendidos',     valor: totalAlunos,            icon: Users,      cor: '#f59e0b' },
            { label: 'Cursos Ministrados',   valor: totalCursos,            icon: Star,       cor: '#8b5cf6' },
          ].map(m => (
            <div key={m.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '10px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: `${m.cor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <m.icon size={18} color={m.cor} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{m.valor}</div>
                <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, flexShrink: 0 }}>
            <Filter size={14} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Filtros:</span>
          </div>

          {/* Busca geral */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', padding: '7px 12px', flex: '1 1 200px', minWidth: '200px',
          }}>
            <Search size={13} color={C.muted} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, e-mail ou especialidade..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, minWidth: 0 }}
            />
          </div>

          {/* CR */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', padding: '7px 12px', width: '140px',
          }}>
            <Search size={13} color={C.muted} />
            <input
              value={crFiltro}
              onChange={e => setCrFiltro(e.target.value)}
              placeholder="Buscar INS..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, minWidth: 0 }}
            />
          </div>

          {/* Nível */}
          <div style={{ position: 'relative' }}>
            <select value={nivelFiltro} onChange={e => setNivelFiltro(e.target.value)} style={{ ...selectStyle, minWidth: '170px' }}>
              {niveis.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          {/* Status */}
          <div style={{ position: 'relative' }}>
            <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} style={{ ...selectStyle, minWidth: '130px' }}>
              {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          {temFiltroAtivo && (
            <button
              onClick={limparFiltros}
              style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Tabela */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>

          {/* Cabeçalho da tabela */}
          <div style={{ display: 'grid', gridTemplateColumns: cols, background: C.surface, borderBottom: `1px solid ${C.border}` }}>
            {thLabels.map((col, i) => (
              <div
                key={col.label}
                onClick={() => col.campo && toggleOrdem(col.campo)}
                style={{
                  padding: '12px 14px', fontSize: '11px', fontWeight: 700,
                  color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px',
                  cursor: col.campo ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  borderRight: i < thLabels.length - 1 ? `1px solid ${C.border}` : 'none',
                  userSelect: 'none',
                }}
              >
                {col.label}
                {col.campo && ordenacao === col.campo && (
                  <span style={{ fontSize: '10px', color: C.blue }}>{ordemDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            ))}
          </div>

          {/* Linhas */}
          {instrutoresFiltrados.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhum instrutor encontrado</p>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Tente ajustar os filtros</p>
              <button
                onClick={limparFiltros}
                style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            instrutoresFiltrados.map((inst, idx) => (
              <div
                key={inst.id}
                style={{
                  display: 'grid', gridTemplateColumns: cols,
                  borderBottom: idx < instrutoresFiltrados.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${C.blue}05`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Nome + cargo */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', borderRight: `1px solid ${C.border}` }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: `${corAvatar(inst.id)}22`,
                    border: `1.5px solid ${corAvatar(inst.id)}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: corAvatar(inst.id),
                  }}>
                    {getIniciais(inst.nome)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inst.nome}
                    </div>
                    <div style={{ fontSize: '10px', color: C.muted }}>{inst.cargo}</div>
                  </div>
                </div>

                {/* Especialidade */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted2, lineHeight: 1.4 }}>{inst.especialidade}</span>
                </div>

                {/* CR — verde */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: '#10b981',
                    background: 'rgba(16,185,129,0.10)', border: '0.5px solid rgba(16,185,129,0.25)',
                    borderRadius: '6px', padding: '3px 8px',
                  }}>
                    {inst.cr}
                  </span>
                </div>

                {/* E-mail */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '5px', borderRight: `1px solid ${C.border}`, minWidth: 0 }}>
                  <Mail size={11} color={C.muted} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {inst.email}
                  </span>
                </div>

                {/* Último acesso */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '5px', borderRight: `1px solid ${C.border}` }}>
                  <Clock size={11} color={C.muted} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: C.muted2 }}>{inst.ultimoAcesso}</span>
                </div>

                {/* Alunos */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderRight: `1px solid ${C.border}` }}>
                  <Users size={12} color={C.muted} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{inst.alunosAtivos}</span>
                </div>

                {/* Avaliação */}
                <div style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
                  <RenderEstrelas nota={inst.avaliacaoMedia} />
                </div>

                {/* Status + ações */}
                <div style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700,
                    color: inst.status === 'Ativo' ? '#10b981' : '#ef4444',
                    background: inst.status === 'Ativo' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                    border: `0.5px solid ${inst.status === 'Ativo' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    borderRadius: '6px', padding: '2px 8px',
                  }}>
                    {inst.status}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {([Eye, Edit] as const).map((Icon, i) => (
                      <button
                        key={i}
                        style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.10)'; e.currentTarget.style.borderColor = C.blue }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                      >
                        <Icon size={11} color={C.muted} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: C.muted }}>
            Exibindo <strong style={{ color: C.text }}>{instrutoresFiltrados.length}</strong> de{' '}
            <strong style={{ color: C.text }}>{instrutoresMock.length}</strong> instrutores
          </span>
          <span style={{ fontSize: '12px', color: C.muted, fontStyle: 'italic' }}>
            Avaliação média geral: <strong style={{ color: '#f59e0b' }}>{mediaAvaliacao} ★</strong>
          </span>
        </div>

      </div>
    </LayoutAdmin>
  )
}
