import { MessageSquare, Search } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'
import { useNotificacoes } from '../../hooks/useNotificacoes'

interface TopbarAdminProps {
  titulo?: string
  subtitulo?: string
  onNavigate?: (page: string) => void
}

export function TopbarAdmin({
  titulo = 'Olá, Administrador! 👋',
  subtitulo = 'Bem-vindo ao painel de gestão da Universidade Corporativa.',
  onNavigate,
}: TopbarAdminProps) {
  const { C } = useTheme()
  const { mensagensNaoLidas } = useNotificacoes()

  return (
    <div style={{
      height: '64px',
      flexShrink: 0,
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: '16px',
    }}>

      {/* Saudação */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>{titulo}</div>
        <div style={{ fontSize: '11px', color: C.muted }}>{subtitulo}</div>
      </div>

      {/* Busca */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        padding: '7px 14px',
        width: '260px',
        flexShrink: 0,
      }}>
        <Search size={13} color={C.muted} />
        <span style={{ fontSize: '12px', color: C.muted, flex: 1 }}>
          Buscar cursos, alunos, turmas...
        </span>
        <span style={{
          fontSize: '10px', color: C.muted,
          background: C.surface,
          padding: '1px 5px', borderRadius: '4px',
          border: `1px solid ${C.border}`,
        }}>
          ⌘ K
        </span>
      </div>

      {/* Toggle dark/light */}
      <ThemeToggle />

      {/* Sino — navegável, contagem real de não lidas */}
      <button
        onClick={() => onNavigate?.('mensagensAdmin')}
        style={{
          position: 'relative',
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '6px',
          borderRadius: '8px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.muted, transition: 'all 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.08)'; e.currentTarget.style.color = '#1a56ff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted }}
        title={mensagensNaoLidas > 0 ? `${mensagensNaoLidas} mensagem(s) não lida(s)` : 'Mensagens'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {mensagensNaoLidas > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            minWidth: '16px', height: '16px',
            background: '#ef4444', color: '#fff',
            fontSize: '9px', fontWeight: 700, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
            boxShadow: '0 0 0 2px white',
            animation: 'pulse 2s infinite',
          }}>
            {mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}
          </span>
        )}
      </button>

      {/* Mensagens */}
      <div
        onClick={() => onNavigate?.('mensagensAdmin')}
        style={{ cursor: 'pointer', padding: '6px', flexShrink: 0 }}
      >
        <MessageSquare size={18} color={C.muted} />
      </div>

      {/* Avatar admin */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '5px 10px',
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        cursor: 'pointer',
        flexShrink: 0,
      }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: C.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, color: '#fff',
        }}>
          A
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>Administrador</div>
          <div style={{ fontSize: '10px', color: C.muted }}>Administrador</div>
        </div>
      </div>
    </div>
  )
}
