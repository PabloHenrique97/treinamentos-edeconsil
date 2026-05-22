import { Bell, MessageSquare, Search, ChevronRight } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'

interface TopbarItem {
  label: string
  ativo?: boolean
  onClick?: () => void
}

interface TopbarProps {
  navItems: TopbarItem[]
  userName?: string
  userRole?: string
  userInitials?: string
  notificacoes?: number
}

export function Topbar({
  navItems,
  userName,
  userRole,
  userInitials,
  notificacoes = 3,
}: TopbarProps) {
  const { C } = useTheme()
  const { nome, iniciais, perfil } = useUsuarioLogado()
  const displayName     = nome     || userName     || 'Usuário'
  const displayInitials = iniciais || userInitials || 'U'
  const displayRole     = userRole || (perfil === 'admin' ? 'Administrador' : 'Colaborador')

  return (
    <div style={{
      height: '56px',
      flexShrink: 0,
      background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '20px',
    }}>

      {/* Links de navegação */}
      {navItems.map(item => (
        <span
          key={item.label}
          onClick={item.onClick}
          style={{
            fontSize: '13px',
            fontWeight: item.ativo ? 600 : 400,
            color: item.ativo ? C.text : C.muted,
            cursor: 'pointer',
            padding: '4px 0',
            borderBottom: item.ativo
              ? `2px solid ${C.blue}`
              : '2px solid transparent',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </span>
      ))}

      {/* Busca */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: C.inputBg,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        padding: '7px 14px',
        width: '240px',
        flexShrink: 0,
      }}>
        <Search size={13} color={C.muted} />
        <span style={{ fontSize: '12px', color: C.muted, flex: 1 }}>
          Buscar aulas, cursos...
        </span>
        <span style={{
          fontSize: '10px',
          color: C.muted,
          background: C.surface,
          padding: '1px 5px',
          borderRadius: '4px',
          border: `1px solid ${C.border}`,
        }}>
          ⌘ K
        </span>
      </div>

      {/* Toggle Dark/Light */}
      <ThemeToggle />

      {/* Sino */}
      <div style={{ position: 'relative', cursor: 'pointer', padding: '6px', flexShrink: 0 }}>
        <Bell size={17} color={C.muted} />
        {notificacoes > 0 && (
          <div style={{
            position: 'absolute', top: '3px', right: '3px',
            width: '14px', height: '14px',
            background: C.blue,
            borderRadius: '50%',
            fontSize: '8px', fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {notificacoes}
          </div>
        )}
      </div>

      {/* Mensagens */}
      <div style={{ cursor: 'pointer', padding: '6px', flexShrink: 0 }}>
        <MessageSquare size={17} color={C.muted} />
      </div>

      {/* Avatar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px 8px',
        background: C.inputBg,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '26px', height: '26px',
          borderRadius: '50%',
          background: C.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 700, color: '#fff',
        }}>
          {displayInitials}
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: C.text }}>{displayName}</div>
          <div style={{ fontSize: '9px', color: C.green }}>● {displayRole}</div>
        </div>
        <ChevronRight size={12} color={C.muted} />
      </div>
    </div>
  )
}
