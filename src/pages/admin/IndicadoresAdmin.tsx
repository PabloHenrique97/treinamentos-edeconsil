import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  ChevronRight, ChevronDown, Filter, Calendar,
  AlertTriangle, TrendingUp
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

const metricas = [
  { label: 'Total de Colaboradores',      valor: '1.248',  delta: '+8,3%',  cor: '#1a56ff', spark: [20,28,25,35,30,42,38,50,45,58,52,65] },
  { label: 'Horas de Treinamento (Total)', valor: '2.856h', delta: '+12,5%', cor: '#10b981', spark: [15,22,18,30,25,38,32,45,40,52,48,60] },
  { label: 'Treinamentos Concluídos',      valor: '532',    delta: '+15,7%', cor: '#8b5cf6', spark: [10,15,12,20,18,25,22,32,28,38,35,45] },
  { label: 'Treinamentos Pendentes',       valor: '186',    delta: '+6,2%',  cor: '#f59e0b', spark: [8,12,10,14,12,16,14,18,16,20,18,22]  },
  { label: 'Treinamentos Vencidos',        valor: '37',     delta: '+23,1%', cor: '#ef4444', spark: [2,3,2,4,3,5,4,6,5,7,6,8]            },
]

const visaoGeral = [
  { nome: 'Concluídos',   valor: 532, pct: 70.5, cor: '#10b981' },
  { nome: 'Em Andamento', valor: 186, pct: 24.6, cor: '#1a56ff' },
  { nome: 'Pendentes',    valor: 37,  pct: 4.9,  cor: '#f59e0b' },
  { nome: 'Vencidos',     valor: 37,  pct: 4.9,  cor: '#ef4444' },
]
const totalPizza = 755

const horasData = [
  { dia: '01/mai', horas: 180  },
  { dia: '08/mai', horas: 320  },
  { dia: '15/mai', horas: 580  },
  { dia: '22/mai', horas: 820  },
  { dia: '31/mai', horas: 1000 },
]

const atencoes = [
  { cor: '#ef4444', valor: 37,  titulo: 'Treinamentos vencidos',                       sub: 'Necessitam refazer'   },
  { cor: '#f59e0b', valor: 186, titulo: 'Treinamentos pendentes',                      sub: 'Aguardando conclusão' },
  { cor: '#f59e0b', valor: 14,  titulo: 'Certificados vencendo em 30 dias',            sub: 'Requer atenção'       },
  { cor: '#1a56ff', valor: 28,  titulo: 'Colaboradores sem treinamentos obrigatórios', sub: 'Regularizar'          },
]

const colaborador = {
  nome: 'João Silva Santos',
  cargo: 'Colaborador',
  funcao: 'Operador de Escavadeira',
  centroCusto: 'Terraplanagem',
  admissao: '15/03/2022',
  email: 'joaosilva@edeconsil.com.br',
}

const historicoCursos = [
  { curso: 'NR 11 - Operação de Equipamentos',  status: 'Concluído', conclusao: '12/02/2025', validade: '12/02/2026', cargaH: '16h', vencido: false },
  { curso: 'NR 18 - Condições e Meio Ambiente', status: 'Concluído', conclusao: '20/01/2025', validade: '20/01/2026', cargaH: '8h',  vencido: false },
  { curso: 'Direção Defensiva',                 status: 'Concluído', conclusao: '10/03/2025', validade: '10/03/2026', cargaH: '12h', vencido: false },
  { curso: 'Segurança em Obras',                status: 'Concluído', conclusao: '05/02/2025', validade: '05/02/2026', cargaH: '10h', vencido: false },
  { curso: 'Trabalho em Altura - NR 35',        status: 'Vencido',   conclusao: '15/01/2024', validade: '15/01/2025', cargaH: '8h',  vencido: true  },
  { curso: 'Primeiros Socorros',                status: 'Concluído', conclusao: '18/02/2025', validade: '18/02/2026', cargaH: '6h',  vencido: false },
  { curso: 'Combate a Incêndio',                status: 'Vencido',   conclusao: '28/12/2023', validade: '28/12/2024', cargaH: '4h',  vencido: true  },
]

const horasCentro = [
  { nome: 'Terraplanagem',  horas: 1245, pct: 100 },
  { nome: 'Pavimentação',   horas: 845,  pct: 68  },
  { nome: 'Obras de Arte',  horas: 385,  pct: 31  },
  { nome: 'Manutenção',     horas: 215,  pct: 17  },
  { nome: 'Administrativo', horas: 166,  pct: 13  },
]

const pendentesCols = [
  { nome: 'Carlos Eduardo',  cargo: 'Operador de Rolo',     curso: 'NR 11 - Operação de Equipamentos',  diasRestantes: 5,  cor: '#ef4444' },
  { nome: 'Marcos Vinicius', cargo: 'Encarregado de Obras', curso: 'NR 18 - Condições e Meio Ambiente', diasRestantes: 7,  cor: '#ef4444' },
  { nome: 'Pedro Almeida',   cargo: 'Motorista',            curso: 'Direção Defensiva',                 diasRestantes: 10, cor: '#f59e0b' },
  { nome: 'Lucas Ferreira',  cargo: 'Auxiliar de Serviços', curso: 'Primeiros Socorros',                diasRestantes: 12, cor: '#f59e0b' },
]

function Sparkline({ data, cor }: { data: number[]; cor: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 100, h = 32
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IndicadoresAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [abaCursos, setAbaCursos] = useState<'historico' | 'disponiveis' | 'certificados'>('historico')
  const [periodoHoras, setPeriodoHoras] = useState<'geral' | 'centro'>('geral')

  return (
    <LayoutAdmin
      paginaAtiva="indicadoresAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Painel de Indicadores"
      topbarSubtitulo="Acompanhe o desempenho dos treinamentos em toda a organização."
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── FILTRO DE DATA ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 14px', cursor: 'pointer' }}>
            <Calendar size={13} color={C.muted} />
            <span style={{ fontSize: '12px', color: C.text }}>01/05/2025 - 31/05/2025</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 14px', cursor: 'pointer' }}>
            <Filter size={13} color={C.muted} />
            <span style={{ fontSize: '12px', color: C.text }}>Filtros</span>
          </div>
        </div>

        {/* ── MÉTRICAS PRINCIPAIS (5 cards) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {metricas.map(m => (
            <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={18} color={m.cor} />
                </div>
                <span style={{ fontSize: '11px', color: C.muted, lineHeight: 1.3 }}>{m.label}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: C.text, marginBottom: '8px' }}>{m.valor}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '11px', color: m.label === 'Treinamentos Vencidos' ? '#ef4444' : '#10b981', fontWeight: 600 }}>↑ {m.delta}</span>
                  <div style={{ fontSize: '10px', color: C.muted }}>vs mês anterior</div>
                </div>
                <Sparkline data={m.spark} cor={m.cor} />
              </div>
            </div>
          ))}
        </div>

        {/* ── LINHA 2: Pizza + Gráfico Horas + Atenções ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '16px' }}>

          {/* Pizza — Visão Geral */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Visão Geral dos Treinamentos</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', color: C.muted }}>
                Todos os Centros de Custo <ChevronDown size={12} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <PieChart width={160} height={160}>
                  <Pie data={visaoGeral} cx={75} cy={75} innerRadius={48} outerRadius={72} dataKey="valor" strokeWidth={0}>
                    {visaoGeral.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                  </Pie>
                </PieChart>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: C.text }}>{totalPizza}</div>
                  <div style={{ fontSize: '10px', color: C.muted }}>Total</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {visaoGeral.map(v => (
                  <div key={v.nome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: C.muted2 }}>{v.nome}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>
                      {v.valor} <span style={{ color: C.muted, fontWeight: 400 }}>({v.pct}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico de Horas */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Horas de Treinamento</span>
              <div style={{ display: 'flex', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                {(['geral', 'centro'] as const).map(p => (
                  <button key={p} onClick={() => setPeriodoHoras(p)} style={{ padding: '5px 12px', background: periodoHoras === p ? C.blue : 'none', color: periodoHoras === p ? '#fff' : C.muted, border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                    {p === 'geral' ? 'Geral' : 'Por Centro de Custo'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: C.text }}>2.856h</div>
              <div style={{ fontSize: '11px', color: C.muted }}>Total no período</div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={horasData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
                <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px' }} formatter={v => [`${v}h`]} />
                <Line type="monotone" dataKey="horas" stroke={C.blue} strokeWidth={2} dot={{ r: 3, fill: C.blue }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Atenções Necessárias */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Atenções Necessárias</span>
              <span style={{ fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 500 }}>Ver todas</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {atencoes.map((a, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = a.cor}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${a.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertTriangle size={15} color={a.cor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: a.cor }}>{a.valor}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: C.text }}>{a.titulo}</div>
                    <div style={{ fontSize: '10px', color: C.muted }}>{a.sub}</div>
                  </div>
                  <ChevronRight size={14} color={C.muted} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LINHA 3: Ficha Colaborador + Histórico Cursos + Coluna Direita ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: '16px' }}>

          {/* Ficha do Colaborador */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>Ficha do Colaborador</span>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(26,86,255,0.15)', border: `2px solid ${C.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: C.blue }}>
                JS
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{colaborador.nome}</div>
                <span style={{ fontSize: '10px', background: 'rgba(26,86,255,0.15)', color: C.blue, borderRadius: '6px', padding: '2px 10px', fontWeight: 600 }}>{colaborador.cargo}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: `1px solid ${C.border}`, paddingTop: '10px' }}>
              {[
                { label: 'Função',         valor: colaborador.funcao      },
                { label: 'Centro de Custo', valor: colaborador.centroCusto },
                { label: 'Admissão',       valor: colaborador.admissao    },
                { label: 'E-mail',         valor: colaborador.email       },
              ].map(d => (
                <div key={d.label}>
                  <div style={{ fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.label}</div>
                  <div style={{ fontSize: '12px', color: C.text, fontWeight: 500, wordBreak: 'break-all' }}>{d.valor}</div>
                </div>
              ))}
            </div>

            <button
              style={{ width: '100%', padding: '9px', background: 'none', border: `1.5px solid ${C.blue}`, borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: C.blue, cursor: 'pointer', transition: 'all 150ms' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.blue }}
            >
              Ver perfil completo
            </button>
          </div>

          {/* Histórico de Cursos */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: '12px' }}>
              {[
                { key: 'historico',    label: 'Histórico de Cursos'      },
                { key: 'disponiveis',  label: 'Treinamentos Disponíveis'  },
                { key: 'certificados', label: 'Certificados'              },
              ].map(aba => (
                <button
                  key={aba.key}
                  onClick={() => setAbaCursos(aba.key as typeof abaCursos)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: '13px', fontWeight: abaCursos === aba.key ? 600 : 400, color: abaCursos === aba.key ? C.blue : C.muted, borderBottom: abaCursos === aba.key ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px', transition: 'all 150ms' }}
                >
                  {aba.label}
                </button>
              ))}
            </div>

            {abaCursos === 'historico' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 80px', gap: '8px', padding: '6px 8px', marginBottom: '4px' }}>
                  {['Curso', 'Status', 'Conclusão', 'Validade', 'Carga H.'].map(h => (
                    <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{h}</span>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {historicoCursos.map((curso, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 80px', gap: '8px', padding: '10px 8px', background: C.surface2, borderRadius: '8px', alignItems: 'center', border: `0.5px solid ${C.border}` }}>
                      <span style={{ fontSize: '12px', color: C.text, fontWeight: 500 }}>{curso.curso}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: curso.vencido ? '#ef4444' : '#10b981' }}>{curso.status}</span>
                      <span style={{ fontSize: '11px', color: curso.vencido ? '#ef4444' : C.muted2 }}>{curso.conclusao}</span>
                      <span style={{ fontSize: '11px', color: curso.vencido ? '#ef4444' : C.muted2, fontWeight: curso.vencido ? 700 : 400 }}>{curso.validade}</span>
                      <span style={{ fontSize: '11px', color: curso.vencido ? '#ef4444' : C.muted, fontWeight: curso.vencido ? 700 : 400 }}>{curso.cargaH}{curso.vencido ? ' Vencido' : ''}</span>
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: '12px', padding: '9px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600 }}>
                  Ver todos os cursos concluídos
                </button>
              </>
            )}

            {abaCursos !== 'historico' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '120px', color: C.muted, fontSize: '13px' }}>
                Conteúdo de {abaCursos === 'disponiveis' ? 'Treinamentos Disponíveis' : 'Certificados'} em breve
              </div>
            )}
          </div>

          {/* Coluna direita — Horas por Centro + Pendentes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Horas por Centro de Custo */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Horas por Centro de Custo</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', color: C.muted }}>
                  Este mês <ChevronDown size={11} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {horasCentro.map(h => (
                  <div key={h.nome} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: C.muted2, minWidth: '100px' }}>{h.nome}</span>
                    <div style={{ flex: 1, background: 'rgba(26,86,255,0.08)', borderRadius: '4px', height: '5px' }}>
                      <div style={{ background: C.blue, height: '5px', borderRadius: '4px', width: `${h.pct}%`, transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: C.text, minWidth: '48px', textAlign: 'right' }}>{h.horas.toLocaleString()}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Treinamentos Pendentes por Colaborador */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Pendentes por Colaborador</span>
                <span style={{ fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 500 }}>Ver todos</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendentesCols.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: C.surface2, borderRadius: '8px', border: `0.5px solid ${C.border}` }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(26,86,255,0.15)', border: '1px solid rgba(26,86,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: C.blue, flexShrink: 0 }}>
                      {p.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{p.nome}</div>
                      <div style={{ fontSize: '10px', color: C.muted }}>{p.cargo}</div>
                      <div style={{ fontSize: '10px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.curso}</div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: p.cor, borderRadius: '6px', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                        Vence em {p.diasRestantes} dias
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: '11px', color: C.muted }}>© 2025 Edeconsil Universidade Corporativa. Todos os direitos reservados.</span>
        </div>

      </div>
    </LayoutAdmin>
  )
}
