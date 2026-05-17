import { Bell, MessageSquare, Search } from 'lucide-react'
import { ThemeToggle } from '../ThemeToggle'
import { useTheme } from '../../contexts/ThemeContext'

interface TopbarAdminProps {
  titulo?: string
  subtitulo?: string
  notificacoes?: number
  mensagens?: number
}

export function TopbarAdmin({
  titulo = 'Olá, Administrador! 👋',
  subtitulo = 'Bem-vindo ao painel de gestão da Universidade Corporativa.',
  notificacoes = 12,
  mensagens = 5,
}: TopbarAdminProps) {
  const { C } = useTheme()

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

      {/* Sino */}
      <div style={{ position: 'relative', cursor: 'pointer', padding: '6px', flexShrink: 0 }}>
        <Bell size={18} color={C.muted} />
        {notificacoes > 0 && (
          <div style={{
            position: 'absolute', top: '2px', right: '2px',
            minWidth: '16px', height: '16px',
            background: C.blue, borderRadius: '8px',
            fontSize: '9px', fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {notificacoes}
          </div>
        )}
      </div>

      {/* Mensagens */}
      <div style={{ position: 'relative', cursor: 'pointer', padding: '6px', flexShrink: 0 }}>
        <MessageSquare size={18} color={C.muted} />
        {mensagens > 0 && (
          <div style={{
            position: 'absolute', top: '2px', right: '2px',
            minWidth: '16px', height: '16px',
            background: '#ef4444', borderRadius: '8px',
            fontSize: '9px', fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {mensagens}
          </div>
        )}
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
