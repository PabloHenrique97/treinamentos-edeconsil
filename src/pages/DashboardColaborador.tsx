import {
  BookOpen, ChevronRight,
  Play
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { useTheme } from '../contexts/ThemeContext'

const metricas = [
  { label: 'Cursos ativos',   valor: '8',   delta: '+2 este mês',   deltaColor: '#1a56ff' },
  { label: 'Concluídos',      valor: '3',   delta: '37% concluído', deltaColor: '#10b981' },
  { label: 'Certificados',    valor: '3',   delta: 'Ver todos',     deltaColor: '#f59e0b' },
  { label: 'Horas estudadas', valor: '24h', delta: 'Este mês',      deltaColor: '#1a56ff' },
]

const cursosAndamento = [
  { icon: '🪖', titulo: 'NR-35 — Trabalho em Altura',    pct: 68, cor: '#1a56ff' },
  { icon: '🛡️', titulo: 'SIPAT — Segurança no Trabalho', pct: 35, cor: '#1a56ff' },
  { icon: '📋', titulo: 'Gestão da Qualidade ISO 9001',  pct: 12, cor: '#f59e0b' },
]

const recomendados = [
  { cor: '#1a56ff', titulo: 'Liderança em Obras',        info: '32 aulas · 10 matérias' },
  { cor: '#10b981', titulo: 'Gestão Ambiental em Obras', info: '18 aulas · 6 matérias'  },
  { cor: '#8b5cf6', titulo: 'EdeconQuiz — SIPAT 2026',   info: '20 questões · 15 min'   },
]

const disciplinas = [
  { id: 1, titulo: 'NR-35 — Trabalho em Altura',          status: 'Cursando', pct: 68  },
  { id: 2, titulo: 'SIPAT — Segurança no Canteiro',       status: 'Cursando', pct: 35  },
  { id: 3, titulo: 'Gestão da Qualidade ISO 9001',        status: 'Cursando', pct: 12  },
  { id: 4, titulo: 'Liderança em Obras e Canteiros',      status: 'Cursando', pct: 0   },
  { id: 5, titulo: 'NR-18 — Condições e Meio Ambiente',   status: 'Cursando', pct: 0   },
  { id: 6, titulo: 'Gestão Ambiental em Obras',           status: 'Cursando', pct: 0   },
]

interface DashboardColaboradorProps {
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function DashboardColaborador({ onLogout, onNavigate }: DashboardColaboradorProps) {
  const { C } = useTheme()
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* SIDEBAR */}
      <Sidebar
        paginaAtiva="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <Topbar
          navItems={[
            { label: 'Início',     ativo: true  },
            { label: 'Notícias',   ativo: false },
            { label: 'Biblioteca', ativo: false },
          ]}
          userName="Suporte TI"
          userRole="Colaborador"
          userInitials="SE"
          notificacoes={3}
        />

        {/* Conteúdo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {metricas.map(m => (
              <div key={m.label} style={{ background: 'rgba(26,86,255,0.08)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: C.text }}>{m.valor}</div>
                <div style={{ fontSize: '10px', color: m.deltaColor, marginTop: '4px' }}>{m.delta}</div>
              </div>
            ))}
          </div>

          {/* Duas colunas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Cursos em andamento */}
            <div style={{ background: 'rgba(26,86,255,0.08)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Em andamento</div>
              {cursosAndamento.map(c => (
                <div key={c.titulo} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(26,86,255,0.15)', border: '0.5px solid rgba(26,86,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: C.text, marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.titulo}</div>
                    <div style={{ background: 'rgba(26,86,255,0.12)', borderRadius: '4px', height: '4px' }}>
                      <div style={{ background: c.cor, height: '4px', borderRadius: '4px', width: `${c.pct}%` }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: c.cor, flexShrink: 0 }}>{c.pct}%</div>
                </div>
              ))}

              <button
                onClick={() => onNavigate('meusCursos')}
                style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <Play size={14} /> Continuar estudando
              </button>
            </div>

            {/* Recomendados */}
            <div style={{ background: 'rgba(26,86,255,0.08)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>Recomendados para você</div>
              {recomendados.map(r => (
                <div
                  key={r.titulo}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(26,86,255,0.06)', borderRadius: '8px', border: '0.5px solid rgba(26,86,255,0.12)', cursor: 'pointer', transition: 'all 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(26,86,255,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(26,86,255,0.12)')}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: r.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={14} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: C.text }}>{r.titulo}</div>
                    <div style={{ fontSize: '10px', color: C.muted }}>{r.info}</div>
                  </div>
                  <ChevronRight size={14} color={C.blue} />
                </div>
              ))}
            </div>
          </div>

          {/* ── DISCIPLINAS EM ANDAMENTO ── */}
          <div style={{
            background: 'rgba(26,86,255,0.08)',
            border: '0.5px solid rgba(26,86,255,0.20)',
            borderRadius: '12px',
            padding: '20px 24px',
          }}>
            {/* Cabeçalho */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>
                  Disciplinas em andamento
                </span>
                <div style={{
                  width: '18px', height: '18px',
                  borderRadius: '50%',
                  border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'help',
                }}>
                  <span style={{ fontSize: '10px', color: C.muted }}>?</span>
                </div>
              </div>
              <a style={{ fontSize: '13px', color: C.blue, textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Ver todas as disciplinas
              </a>
            </div>

            {/* Grid de cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}>
              {disciplinas.map(d => (
                <div
                  key={d.id}
                  style={{
                    background: C.surface2,
                    border: `0.5px solid ${C.border}`,
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(26,86,255,0.40)'
                    e.currentTarget.style.background = 'rgba(26,86,255,0.06)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border
                    e.currentTarget.style.background = C.surface2
                  }}
                >
                  {/* Badge status */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(26,86,255,0.12)',
                    border: '0.5px solid rgba(26,86,255,0.25)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    marginBottom: '10px',
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: C.blue }}>
                      {d.status}
                    </span>
                  </div>

                  {/* Título */}
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: C.text,
                    margin: '0 0 14px',
                    lineHeight: 1.4,
                    minHeight: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    {d.titulo}
                  </p>

                  {/* Barra de progresso */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      flex: 1,
                      background: 'rgba(26,86,255,0.10)',
                      borderRadius: '4px',
                      height: '5px',
                    }}>
                      <div style={{
                        background: d.pct > 0 ? C.blue : 'rgba(26,86,255,0.20)',
                        height: '5px',
                        borderRadius: '4px',
                        width: `${d.pct}%`,
                        minWidth: d.pct > 0 ? '4px' : '0',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: d.pct > 0 ? C.blue : C.muted,
                      minWidth: '28px',
                      textAlign: 'right',
                    }}>
                      {d.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
