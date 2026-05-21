import {
  BookOpen, ChevronRight,
  Play
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { MobileMenu } from '../components/MobileMenu'
import { useTheme } from '../contexts/ThemeContext'
import { useResponsive } from '../hooks/useResponsive'

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


interface DashboardColaboradorProps {
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function DashboardColaborador({ onLogout, onNavigate }: DashboardColaboradorProps) {
  const { C } = useTheme()
  const { isMobile, isTablet } = useResponsive()
  const isSmall = isMobile || isTablet

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* SIDEBAR — apenas desktop */}
      {!isSmall && (
        <Sidebar paginaAtiva="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      )}

      {/* MENU MOBILE/TABLET */}
      {isSmall && (
        <MobileMenu
          paginaAtiva="dashboard"
          onNavigate={onNavigate}
          onLogout={onLogout}
          userName="Suporte TI"
          userRole="Colaborador"
          userInitials="SE"
        />
      )}

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: isSmall ? '56px' : '0' }}>

        {/* Topbar — apenas desktop */}
        {!isSmall && (
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
        )}

        {/* Conteúdo */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isSmall ? '16px' : '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
            {metricas.map(m => (
              <div key={m.label} style={{ background: 'rgba(26,86,255,0.08)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', color: C.muted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: C.text }}>{m.valor}</div>
                <div style={{ fontSize: '10px', color: m.deltaColor, marginTop: '4px' }}>{m.delta}</div>
              </div>
            ))}
          </div>

          {/* Duas colunas */}
          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: isSmall ? '12px' : '16px' }}>

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
                onClick={() => onNavigate('videoAula')}
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

          {/* ── ACESSOS RÁPIDOS ── */}
          <div style={{
            marginTop: '32px',
            paddingBottom: '32px',
          }}>

            {/* Título da seção */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '40px', height: '3px', background: C.blue, borderRadius: '2px', marginBottom: '10px' }} />
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: C.text,
                margin: 0,
              }}>
                Acessos rápidos
              </h2>
            </div>

            {/* Grid 2x2 de cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '16px',
            }}>

              {/* Card 1 — Minhas Anotações */}
              <div
                onClick={() => onNavigate('meusCursos')}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.blue
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Minhas anotações</p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Consulte suas anotações escritas durante as aulas de suas disciplinas.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.blue }}>Acessar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>

              {/* Card 2 — Apostilas */}
              <div
                onClick={() => onNavigate('apostilas')}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.blue
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Apostilas</p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Conheça nossa biblioteca virtual e acesse nosso acervo digital de materiais.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.blue }}>Acessar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>

              {/* Card 3 — Certificados */}
              <div
                onClick={() => onNavigate('certificadosColaborador')}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.blue
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Certificados</p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Acesse seus certificados conquistados ao concluir os cursos da plataforma.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.blue }}>Acessar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>

              {/* Card 4 — Trilha de Aprendizado */}
              <div
                onClick={() => onNavigate('trilha')}
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.blue
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Trilha de Aprendizado</p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    Acompanhe seu progresso e evolua pelas trilhas definidas para seu cargo.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.blue }}>Acessar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
