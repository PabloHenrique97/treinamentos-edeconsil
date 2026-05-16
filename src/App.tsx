import { useState } from 'react'
import Login from './pages/Login'
import { Treinamentos } from './pages/Treinamentos'
import { DashboardAdmin } from './pages/DashboardAdmin'
import './App.css'

type Perfil = 'colaborador' | 'admin'

export default function App() {
  const [logado, setLogado] = useState(false)
  const [perfil, setPerfil] = useState<Perfil>('colaborador')

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

  return <Treinamentos />
}
