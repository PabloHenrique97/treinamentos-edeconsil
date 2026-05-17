import { useState } from 'react'
import Login from './pages/Login'
import { DashboardColaborador } from './pages/DashboardColaborador'
import { DashboardAdmin } from './pages/DashboardAdmin'
import { MeusCursos } from './pages/MeusCursos'
import { TrilhaAprendizado } from './pages/TrilhaAprendizado'
import { CursosAdmin } from './pages/admin/CursosAdmin'
import { CursoDetalheAdmin } from './pages/admin/CursoDetalheAdmin'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

type Perfil = 'colaborador' | 'admin'
type Pagina = 'dashboard' | 'meusCursos' | 'trilha' | 'admin' | 'cursosAdmin' | 'cursoDetalheAdmin'

function AppContent() {
  const [logado, setLogado] = useState(false)
  const [perfil, setPerfil] = useState<Perfil>('colaborador')
  const [pagina, setPagina] = useState<Pagina>('dashboard')

  if (!logado) {
    return (
      <Login onLogin={(p: Perfil) => {
        setPerfil(p)
        setLogado(true)
      }} />
    )
  }

  if (perfil === 'admin') {
    if (pagina === 'cursosAdmin') return (
      <CursosAdmin
        onNavigate={(p) => setPagina(p as Pagina)}
        onLogout={() => setLogado(false)}
      />
    )
    if (pagina === 'cursoDetalheAdmin') return (
      <CursoDetalheAdmin
        onNavigate={(p) => setPagina(p as Pagina)}
        onLogout={() => setLogado(false)}
        onVoltar={() => setPagina('cursosAdmin')}
      />
    )
    return (
      <DashboardAdmin
        onNavigate={(p) => setPagina(p as Pagina)}
        onLogout={() => setLogado(false)}
      />
    )
  }

  if (pagina === 'meusCursos') {
    return <MeusCursos onNavigate={(page) => setPagina(page as Pagina)} />
  }

  if (pagina === 'trilha') return (
    <TrilhaAprendizado
      onNavigate={(p) => setPagina(p as Pagina)}
      onLogout={() => setLogado(false)}
    />
  )

  return (
    <DashboardColaborador
      onLogout={() => setLogado(false)}
      onNavigate={(page) => setPagina(page as Pagina)}
    />
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
