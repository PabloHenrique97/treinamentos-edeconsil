import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  GraduationCap, BookOpen, Users, Award,
  ChevronRight, UserPlus, TrendingUp,
  FileText, Send, BarChart2, Calendar,
  FileBarChart
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { LayoutAdmin } from '../components/admin/LayoutAdmin'
import { useMetricasAdmin } from '../hooks/useMetricasAdmin'

const metricasBase = [
  { icon: BookOpen,      label: 'Total de Cursos',   cor: '#3b82f6', spark: [10,15,12,20,18,25,22,28,24,32,30,38] },
  { icon: BookOpen,      label: 'Cursos Ativos',     cor: '#1a56ff', spark: [8,12,10,16,14,20,18,22,20,28,24,32] },
  { icon: GraduationCap, label: 'Total de Alunos',   cor: '#10b981', spark: [20,35,28,45,38,55,48,65,58,75,68,85] },
  { icon: Users,         label: 'Alunos Ativos',     cor: '#059669', spark: [18,30,24,40,34,50,44,60,54,70,64,80] },
  { icon: Users,         label: 'Total de Turmas',   cor: '#8b5cf6', spark: [30,45,38,55,48,65,58,72,65,80,74,90] },
  { icon: Award,         label: 'Matrículas Ativas', cor: '#f59e0b', spark: [15,22,18,30,25,38,32,45,40,55,50,65] },
  { icon: TrendingUp,    label: 'Taxa de Conclusão', cor: '#ec4899', spark: [40,45,42,50,48,55,52,60,58,65,62,70] },
  { icon: TrendingUp,    label: 'Progresso Médio',   cor: '#0891b2', spark: [35,40,38,45,43,50,48,55,52,60,58,65] },
]

const matriculaData = [
  { dia: '01/mai', matriculas: 120, conclusoes: 45  },
  { dia: '06/mai', matriculas: 280, conclusoes: 120 },
  { dia: '11/mai', matriculas: 420, conclusoes: 210 },
  { dia: '16/mai', matriculas: 380, conclusoes: 280 },
  { dia: '21/mai', matriculas: 520, conclusoes: 350 },
  { dia: '26/mai', matriculas: 680, conclusoes: 480 },
  { dia: '31/mai', matriculas: 980, conclusoes: 680 },
]

const atividades = [
  { icon: UserPlus, cor: '#1a56ff', titulo: 'Novo aluno matriculado',  desc: 'João Silva se matriculou no curso NR-18',             tempo: '2 min atrás'    },
  { icon: Award,    cor: '#10b981', titulo: 'Curso concluído',         desc: 'Maria Santos concluiu o curso Gestão de Obras',        tempo: '15 min atrás'   },
  { icon: Users,    cor: '#8b5cf6', titulo: 'Nova turma criada',       desc: 'Turma Pavimentação — Maio/2025',                       tempo: '1 hora atrás'   },
  { icon: Award,    cor: '#f59e0b', titulo: 'Certificado emitido',     desc: 'Carlos Lima recebeu certificado em Leitura de Projetos', tempo: '2 horas atrás' },
  { icon: FileText, cor: '#3b82f6', titulo: 'Avaliação respondida',    desc: 'Ana Paula respondeu avaliação do curso Topografia',    tempo: '3 horas atrás'  },
]

const distribuicao = [
  { nome: 'Obras e Infraestrutura', valor: 38, cor: '#1a56ff' },
  { nome: 'Terraplanagem',          valor: 22, cor: '#10b981' },
  { nome: 'Pavimentação',           valor: 18, cor: '#f59e0b' },
  { nome: 'Equipamentos',           valor: 12, cor: '#8b5cf6' },
  { nome: 'Administrativo',         valor: 10, cor: '#ec4899' },
]

const statusAlunos = [
  { label: 'Ativos',       valor: 892, cor: '#1a56ff', pct: 71 },
  { label: 'Em andamento', valor: 256, cor: '#3b82f6', pct: 21 },
  { label: 'Concluídos',   valor: 532, cor: '#10b981', pct: 43 },
  { label: 'Inativos',     valor: 68,  cor: '#8b5cf6', pct: 5  },
]

const acoes = [
  { icon: BookOpen,  label: 'Novo Curso',        desc: 'Criar um novo curso'        },
  { icon: Users,     label: 'Nova Turma',         desc: 'Criar uma nova turma'       },
  { icon: UserPlus,  label: 'Matricular Alunos',  desc: 'Matricular alunos em massa' },
  { icon: Send,      label: 'Enviar Notificação', desc: 'Enviar para os alunos'      },
  { icon: BarChart2, label: 'Relatórios',         desc: 'Gerar relatórios'           },
]

const acoesRapidas = [
  { icon: FileText,     label: 'Importar Alunos',   desc: 'Importar via planilha Excel', cor: '#16a34a' },
  { icon: FileBarChart, label: 'Relatório Completo', desc: 'Gerar relatório detalhado',   cor: '#1a56ff' },
]


function Sparkline({ data, cor }: { data: number[]; cor: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 120, h = 36
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

export function DashboardAdmin({ onNavigate, onLogout }: { onNavigate: (p: string) => void; onLogout: () => void }) {
  const { C } = useTheme()
  const m = useMetricasAdmin()

  const valoresMetricas = [
    m.cursos.total,
    m.cursos.ativos,
    m.alunos.total,
    m.alunos.ativos,
    m.turmas.total,
    m.matriculas.ativas,
    m.carregando ? '...' : `${m.taxaConclusao}%`,
    m.carregando ? '...' : `${m.progressoMedio}%`,
  ]

  const metricas = metricasBase.map((base, i) => ({
    ...base,
    valor: m.carregando ? '...' : String(valoresMetricas[i]),
  }))

  return (
    <LayoutAdmin
      paginaAtiva="admin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Olá, Administrador! 👋"
      topbarSubtitulo="Bem-vindo ao painel de gestão da Universidade Corporativa."
    >
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Filtro de data */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>
              <Calendar size={13} color={C.muted} />
              <span style={{ fontSize: '12px', color: C.muted }}>01/05/2025 - 31/05/2025</span>
            </div>
          </div>

          {/* ── MÉTRICAS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {metricas.map(mt => (
              <div key={mt.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${mt.cor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <mt.icon size={20} color={mt.cor} />
                  </div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{mt.valor}</div>
                    <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{mt.label}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <Sparkline data={mt.spark} cor={mt.cor} />
                </div>
              </div>
            ))}
          </div>

          {/* ── LINHA 2: Gráfico + Atividades + Distribuição ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px 280px', gap: '16px', alignItems: 'start' }}>

            {/* Gráfico Matrículas */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Matrículas e Engajamento</div>
                <div style={{ fontSize: '12px', color: C.muted, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>Últimos 30 dias ▾</div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />
                  <span style={{ fontSize: '12px', color: C.muted }}>Matrículas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green }} />
                  <span style={{ fontSize: '12px', color: C.muted }}>Conclusões</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={matriculaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,86,255,0.08)" />
                  <XAxis dataKey="dia" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="matriculas" stroke={C.blue}  strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="conclusoes"  stroke={C.green} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Atividades Recentes */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Atividades Recentes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {atividades.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${a.cor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <a.icon size={14} color={a.cor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{a.titulo}</div>
                      <div style={{ fontSize: '11px', color: C.muted, lineHeight: 1.4 }}>{a.desc}</div>
                      <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{a.tempo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribuição de Alunos */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Distribuição de Alunos</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={distribuicao} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="valor" strokeWidth={0}>
                    {distribuicao.map((entry, index) => (
                      <Cell key={index} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [`${v}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {distribuicao.map(d => (
                  <div key={d.nome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: C.muted }}>{d.nome}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: C.text }}>{d.valor}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── LINHA 3: Cursos + Taxa Conclusão + Status + Ações Rápidas ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 220px 200px', gap: '16px', alignItems: 'start' }}>

            {/* Cursos mais acessados */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Cursos Mais Acessados</div>
                <span style={{ fontSize: '12px', color: C.blue, cursor: 'pointer' }}>Ver todos</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {m.carregando ? (
                  <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: C.muted }}>Carregando...</div>
                ) : m.cursosMaisAcessados.map((curso: any, idx: number) => (
                  <div key={curso.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: curso.cor ?? C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{idx + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: C.text, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curso.titulo}</div>
                      <div style={{ background: 'rgba(26,86,255,0.12)', borderRadius: '4px', height: '4px' }}>
                        <div style={{ background: curso.cor ?? C.blue, height: '4px', borderRadius: '4px', width: `${Math.min(curso.progresso_medio ?? 0, 100)}%`, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: C.muted, flexShrink: 0 }}>{curso.total_alunos} alunos</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Taxa de Conclusão */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Taxa de Conclusão</div>
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px' }}>
                <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(26,86,255,0.12)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={C.blue} strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.72} ${2 * Math.PI * 40 * 0.28}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>72%</div>
                  <div style={{ fontSize: '9px', color: C.muted }}>Taxa geral</div>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: C.green, fontWeight: 600 }}>↑ 7,8%</div>
              <div style={{ fontSize: '11px', color: C.muted }}>vs mês anterior</div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '4px' }}>⊙ Meta: 70%</div>
            </div>

            {/* Alunos por Status */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>Alunos por Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {statusAlunos.map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: C.muted2 }}>{s.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>{s.valor}</span>
                    </div>
                    <div style={{ background: 'rgba(26,86,255,0.08)', borderRadius: '4px', height: '4px' }}>
                      <div style={{ background: s.cor, height: '4px', borderRadius: '4px', width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '12px' }}>Ações Rápidas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {acoesRapidas.map(a => (
                  <div key={a.label}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(26,86,255,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${a.cor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <a.icon size={14} color={a.cor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{a.label}</div>
                      <div style={{ fontSize: '10px', color: C.muted }}>{a.desc}</div>
                    </div>
                    <ChevronRight size={14} color={C.muted} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CURSOS RECENTES + ALUNOS RECENTES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Cursos Recentes */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>Cursos Recentes</div>
              {m.carregando ? (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: C.muted }}>
                  Carregando...
                </div>
              ) : m.cursosRecentes.map((curso: any) => (
                <div key={curso.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>
                      {curso.titulo}
                    </p>
                    <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                      {curso.total_aulas} aulas ·{' '}
                      <span style={{
                        color: curso.status === 'ativo' ? '#10b981' :
                               curso.status === 'rascunho' ? '#f59e0b' : C.muted,
                        fontWeight: 600,
                      }}>
                        {curso.status === 'ativo' ? 'Publicado' :
                         curso.status === 'rascunho' ? 'Rascunho' : 'Arquivado'}
                      </span>
                    </p>
                  </div>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                    {new Date(curso.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Alunos Recentes */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>Alunos Recentes</div>
              {m.alunosRecentes.map((aluno: any) => (
                <div key={aluno.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(26,86,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: C.blue, flexShrink: 0,
                  }}>
                    {aluno.nome.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {aluno.nome}
                    </p>
                    <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                      {aluno.setor ?? aluno.cargo ?? '—'}
                    </p>
                  </div>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0, flexShrink: 0 }}>
                    {new Date(aluno.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* ── GERENCIAMENTO RÁPIDO ── */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '14px' }}>Gerenciamento Rápido</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {acoes.map(a => (
                <div key={a.label}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '16px 12px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 150ms', textAlign: 'center' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,86,255,0.4)'
                    e.currentTarget.style.background = 'rgba(26,86,255,0.06)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border
                    e.currentTarget.style.background = C.surface2
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(26,86,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <a.icon size={20} color={C.blue} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{a.label}</div>
                    <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

      </div>
    </LayoutAdmin>
  )
}
