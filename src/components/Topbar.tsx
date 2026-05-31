import { MessageSquare, Search, ChevronRight } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../contexts/ThemeContext'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { useNotificacoes } from '../hooks/useNotificacoes'
import { DropdownNotificacoes } from './DropdownNotificacoes'
import { useMobile } from '../hooks/useMobile'

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
  onNavigate?: (page: string) => void
}

export function Topbar({
  navItems,
  userName,
  userRole,
  userInitials,
  onNavigate,
}: TopbarProps) {
  const { C } = useTheme()
  const isMobile = useMobile()
  const { nome, iniciais, perfil } = useUsuarioLogado()
  const {
    notificacoes, contador, aberto, carregando,
    abrirDropdown, fecharDropdown,
    marcarLida, marcarTodasLidas,
    totalNaoLidas, mensagensNaoLidas,
  } = useNotificacoes()
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
      padding: isMobile ? '0 12px' : '0 20px',
      gap: '20px',
    }}>

      {/* Links de navegação */}
      {!isMobile && navItems.map(item => (
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
        width: isMobile ? '140px' : '240px',
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

      {/* Sino — dropdown de notificações */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => aberto ? fecharDropdown() : abrirDropdown()}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.muted, transition: 'all 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.08)'; e.currentTarget.style.color = '#1a56ff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted }}
          title={totalNaoLidas > 0 ? `${totalNaoLidas} notificação(ões) não lida(s)` : 'Notificações'}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {totalNaoLidas > 0 && (
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              minWidth: '16px', height: '16px',
              background: '#ef4444', color: '#fff',
              fontSize: '10px', fontWeight: 700,
              borderRadius: '8px', padding: '0 3px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, boxShadow: '0 0 0 2px white',
            }}>
              {totalNaoLidas > 99 ? '99+' : totalNaoLidas}
            </span>
          )}
        </button>
        <DropdownNotificacoes
          notificacoes={notificacoes}
          naoLidas={contador.notificacoes}
          aberto={aberto}
          carregando={carregando}
          onFechar={fecharDropdown}
          onMarcarLida={marcarLida}
          onMarcarTodas={marcarTodasLidas}
          onNavegar={(pagina) => onNavigate?.(pagina)}
        />
      </div>

      {/* Mensagens — navega + badge */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => onNavigate?.('mensagens')}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.muted, transition: 'all 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.08)'; e.currentTarget.style.color = '#1a56ff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted }}
          title={mensagensNaoLidas > 0 ? `${mensagensNaoLidas} mensagem(ns) não lida(s)` : 'Mensagens'}
        >
          <MessageSquare size={17} />
          {mensagensNaoLidas > 0 && (
            <span style={{
              position: 'absolute', top: '2px', right: '2px',
              minWidth: '16px', height: '16px',
              background: '#1a56ff', color: '#fff',
              fontSize: '10px', fontWeight: 700,
              borderRadius: '8px', padding: '0 3px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, boxShadow: '0 0 0 2px white',
            }}>
              {mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}
            </span>
          )}
        </button>
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
