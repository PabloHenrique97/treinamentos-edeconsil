import { useState } from 'react'
import Login from './pages/Login'
import { DashboardColaborador } from './pages/DashboardColaborador'
import { DashboardAdmin } from './pages/DashboardAdmin'
import { MeusCursos } from './pages/MeusCursos'
import { TrilhaAprendizado } from './pages/TrilhaAprendizado'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

type Perfil = 'colaborador' | 'admin'
type Pagina = 'dashboard' | 'meusCursos' | 'trilha'

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
    return <DashboardAdmin onLogout={() => setLogado(false)} />
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
