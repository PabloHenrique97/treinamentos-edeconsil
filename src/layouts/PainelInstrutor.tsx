import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useResponsive } from '../hooks/useResponsive'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { SidebarInstrutor } from '../components/instrutor/SidebarInstrutor'
import { TopbarAdmin } from '../components/admin/TopbarAdmin'
import { DashboardInstrutor } from '../pages/instrutor/DashboardInstrutor'
import { TurmaInstrutor } from '../pages/instrutor/TurmaInstrutor'
import { AlunosInstrutor } from '../pages/instrutor/AlunosInstrutor'
import { CursosInstrutor } from '../pages/instrutor/CursosInstrutor'
import { MensagensAdmin } from '../pages/admin/MensagensAdmin'
import { BibliotecaAdmin } from '../pages/admin/BibliotecaAdmin'
import { CursoDetalheAdmin } from '../pages/admin/CursoDetalheAdmin'

type PaginaInstrutor =
  | 'dashboardInstrutor'
  | 'turmaInstrutor'
  | 'alunosInstrutor'
  | 'cursosInstrutor'
  | 'cursoDetalheInstrutor'
  | 'mensagensInstrutor'
  | 'bibliotecaInstrutor'

interface PainelInstrutorProps {
  onLogout: () => void
}

const TITULOS: Record<PaginaInstrutor, string> = {
  dashboardInstrutor:   'Painel do Instrutor',
  turmaInstrutor:       'Minha Turma',
  alunosInstrutor:      'Alunos',
  cursosInstrutor:      'Cursos',
  cursoDetalheInstrutor:'Detalhe do Curso',
  mensagensInstrutor:   'Mensagens',
  bibliotecaInstrutor:  'Biblioteca',
}

export function PainelInstrutor({ onLogout }: PainelInstrutorProps) {
  const { C } = useTheme()
  const { isMobile, isTablet } = useResponsive()
  const isSmall = isMobile || isTablet
  const { nome } = useUsuarioLogado()
  const [pagina, setPagina] = useState<PaginaInstrutor>('dashboardInstrutor')
  const [cursoAtivoId, setCursoAtivoId] = useState('')
  const [sidebarAberta, setSidebarAberta] = useState(false)

  function navegar(p: string) {
    setPagina(p as PaginaInstrutor)
    setSidebarAberta(false)
  }

  function renderConteudo() {
    switch (pagina) {
      case 'dashboardInstrutor':
        return <DashboardInstrutor onNavigate={navegar} />
      case 'turmaInstrutor':
        return <TurmaInstrutor />
      case 'alunosInstrutor':
        return <AlunosInstrutor />
      case 'cursosInstrutor':
        return (
          <CursosInstrutor
            onAbrirCurso={(slug) => {
              setCursoAtivoId(slug)
              setPagina('cursoDetalheInstrutor')
            }}
          />
        )
      case 'cursoDetalheInstrutor':
        return (
          <CursoDetalheAdmin
            cursoId={cursoAtivoId}
            onNavigate={navegar}
            onLogout={onLogout}
            onVoltar={() => setPagina('cursosInstrutor')}
          />
        )
      case 'mensagensInstrutor':
        return <MensagensAdmin onNavigate={navegar} onLogout={onLogout} />
      case 'bibliotecaInstrutor':
        return <BibliotecaAdmin onNavigate={navegar} onLogout={onLogout} />
      default:
        return <DashboardInstrutor onNavigate={navegar} />
    }
  }

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: C.bg,
      color: C.text,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {isSmall && sidebarAberta && (
        <div
          onClick={() => setSidebarAberta(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 499 }}
        />
      )}

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
        <SidebarInstrutor
          paginaAtual={pagina}
          onNavigate={navegar}
          onLogout={onLogout}
          nome={nome}
        />
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {isSmall ? (
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
              {TITULOS[pagina]}
            </span>
          </div>
        ) : (
          <TopbarAdmin
            titulo={TITULOS[pagina]}
            onNavigate={navegar}
          />
        )}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderConteudo()}
        </div>
      </main>
    </div>
  )
}
