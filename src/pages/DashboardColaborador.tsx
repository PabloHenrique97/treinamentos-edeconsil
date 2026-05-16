import { useState } from 'react'
import {
  LayoutDashboard, BookOpen, Award, ClipboardCheck,
  FileText, BarChart2, Bell, LogOut, ChevronRight,
  Play
} from 'lucide-react'
import logoEdeconsil from '../assets/logo-edeconsil.png'

const C = {
  bg:      '#050d1a',
  surface: '#070f1e',
  surface2:'#0a1628',
  border:  'rgba(26,86,255,0.15)',
  blue:    '#1a56ff',
  green:   '#10b981',
  amber:   '#f59e0b',
  purple:  '#8b5cf6',
  text:    '#ffffff',
  muted:   '#4a6080',
  muted2:  '#6b80a0',
}

const navItems = [
  { icon: LayoutDashboard, label: 'Início'        },
  { icon: BookOpen,        label: 'Meus Cursos'   },
  { icon: Award,           label: 'Certificados'  },
  { icon: ClipboardCheck,  label: 'EdeconQuiz'    },
  { icon: FileText,        label: 'Apostilas'     },
  { icon: BarChart2,       label: 'Meu Progresso' },
]

const metricas = [
  { label: 'Cursos ativos',   valor: '8',   delta: '+2 este mês',  deltaColor: C.blue  },
  { label: 'Concluídos',      valor: '3',   delta: '37% concluído', deltaColor: C.green },
  { label: 'Certificados',    valor: '3',   delta: 'Ver todos',    deltaColor: C.amber },
  { label: 'Horas estudadas', valor: '24h', delta: 'Este mês',     deltaColor: C.blue  },
]

const cursosAndamento = [
  { icon: '🪖', titulo: 'NR-35 — Trabalho em Altura',    pct: 68, cor: C.blue  },
  { icon: '🛡️', titulo: 'SIPAT — Segurança no Trabalho', pct: 35, cor: C.blue  },
  { icon: '📋', titulo: 'Gestão da Qualidade ISO 9001',  pct: 12, cor: C.amber },
]

const recomendados = [
  { cor: C.blue,   titulo: 'Liderança em Obras',        info: '32 aulas · 10 matérias' },
  { cor: C.green,  titulo: 'Gestão Ambiental em Obras', info: '18 aulas · 6 matérias'  },
  { cor: C.purple, titulo: 'EdeconQuiz — SIPAT 2026',   info: '20 questões · 15 min'   },
]

interface DashboardColaboradorProps {
  onLogout: () => void
}

export function DashboardColaborador({ onLogout }: DashboardColaboradorProps) {
  const [navAtiva, setNavAtiva] = useState('Início')

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '220px', background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logoEdeconsil} alt="Edeconsil" style={{ height: '36px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: C.text, letterSpacing: '1.5px' }}>UNIVERSIDADE</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: C.blue, letterSpacing: '1.5px' }}>CORPORATIVA</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(item => (
            <div
              key={item.label}
              onClick={() => setNavAtiva(item.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                background: navAtiva === item.label ? 'rgba(26,86,255,0.15)' : 'transparent',
                border: navAtiva === item.label ? '0.5px solid rgba(26,86,255,0.3)' : '0.5px solid transparent',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (navAtiva !== item.label) e.currentTarget.style.background = 'rgba(26,86,255,0.06)' }}
              onMouseLeave={e => { if (navAtiva !== item.label) e.currentTarget.style.background = 'transparent' }}
            >
              <item.icon size={16} color={navAtiva === item.label ? C.blue : C.muted} />
              <span style={{ fontSize: '13px', fontWeight: navAtiva === item.label ? 600 : 400, color: navAtiva === item.label ? C.text : C.muted2 }}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>

        {/* Perfil + Logout */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(26,86,255,0.2)', border: '1px solid rgba(26,86,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: C.blue, flexShrink: 0 }}>
            SE
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Suporte TI</div>
            <div style={{ fontSize: '10px', color: C.muted }}>Colaborador</div>
          </div>
          <LogOut size={15} color={C.muted} style={{ cursor: 'pointer', flexShrink: 0 }} onClick={onLogout} />
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ padding: '0 24px', height: '64px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: C.surface }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>Olá, Suporte! 👋</div>
            <div style={{ fontSize: '12px', color: C.muted }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', padding: '8px' }}>
              <Bell size={18} color={C.muted} />
              <div style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: C.blue, borderRadius: '50%' }} />
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(26,86,255,0.2)', border: '1px solid rgba(26,86,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: C.blue }}>SE</div>
          </div>
        </div>

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
            <div style={{ background: 'rgba(7,15,30,0.8)', border: `0.5px solid ${C.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                style={{ marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <Play size={14} /> Continuar estudando
              </button>
            </div>

            {/* Recomendados */}
            <div style={{ background: 'rgba(7,15,30,0.8)', border: `0.5px solid ${C.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

        </div>
      </main>
    </div>
  )
}
