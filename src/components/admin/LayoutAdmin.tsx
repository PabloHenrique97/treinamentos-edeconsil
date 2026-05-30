import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { SidebarAdmin } from './SidebarAdmin'
import { TopbarAdmin } from './TopbarAdmin'
import { useResponsive } from '../../hooks/useResponsive'

interface LayoutAdminProps {
  paginaAtiva: string
  onNavigate: (page: string) => void
  onLogout: () => void
  children: React.ReactNode
  topbarTitulo?: string
  topbarSubtitulo?: string
}

export function LayoutAdmin({
  paginaAtiva,
  onNavigate,
  onLogout,
  children,
  topbarTitulo,
  topbarSubtitulo,
}: LayoutAdminProps) {
  const { C } = useTheme()
  const { isMobile, isTablet } = useResponsive()
  const isSmall = isMobile || isTablet
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: C.bg,
      color: C.text,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Overlay quando sidebar admin aberta em mobile */}
      {isSmall && sidebarAberta && (
        <div
          onClick={() => setSidebarAberta(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 499 }}
        />
      )}

      {/* SidebarAdmin — fixa em desktop, drawer em mobile */}
      <div style={{
        position: isSmall ? 'fixed' : 'relative',
        top: isSmall ? 0 : 'auto',
        left: isSmall ? 0 : 'auto',
        bottom: isSmall ? 0 : 'auto',
        zIndex: isSmall ? 500 : 'auto',
        transform: isSmall
          ? sidebarAberta ? 'translateX(0)' : 'translateX(-100%)'
          : 'none',
        transition: isSmall ? 'transform 280ms ease' : 'none',
        width: '220px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: isSmall ? '100vh' : 'auto',
      } as React.CSSProperties}>
        {isSmall && (
          <button
            onClick={() => setSidebarAberta(false)}
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 1 }}
          >
            <X size={18} color={C.muted} />
          </button>
        )}
        <SidebarAdmin
          paginaAtiva={paginaAtiva}
          onNavigate={(p) => { onNavigate(p); setSidebarAberta(false) }}
          onLogout={onLogout}
        />
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar mobile com botão hambúrguer */}
        {isSmall && (
          <div style={{
            height: '56px', background: C.surface, borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px', flexShrink: 0,
          }}>
            <button
              onClick={() => setSidebarAberta(!sidebarAberta)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', borderRadius: '8px' }}
            >
              <Menu size={22} color={C.text} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: 700, color: C.text }}>
              {topbarTitulo ?? 'Administração'}
            </span>
          </div>
        )}
        {!isSmall && (
          <TopbarAdmin
            titulo={topbarTitulo}
            subtitulo={topbarSubtitulo}
            onNavigate={onNavigate}
          />
        )}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
