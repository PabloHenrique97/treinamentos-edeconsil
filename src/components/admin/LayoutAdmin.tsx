import { useTheme } from '../../contexts/ThemeContext'
import { SidebarAdmin } from './SidebarAdmin'
import { TopbarAdmin } from './TopbarAdmin'

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

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: C.bg,
      color: C.text,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <SidebarAdmin
        paginaAtiva={paginaAtiva}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopbarAdmin
          titulo={topbarTitulo}
          subtitulo={topbarSubtitulo}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
