import { useState } from 'react'
import Login from './pages/Login'
import { Treinamentos } from './pages/Treinamentos'
import './App.css'

export default function App() {
  const [logado, setLogado] = useState(false)
  if (!logado) return <Login onLogin={() => setLogado(true)} />
  return <Treinamentos />
}
