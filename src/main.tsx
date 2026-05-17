import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (rootElement) {
  // Limpa qualquer conteúdo injetado por extensões
  // antes do React montar para evitar conflito de nós
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} else {
  console.error('Elemento root não encontrado')
}
