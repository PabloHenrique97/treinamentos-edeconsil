import { useState, useEffect, useRef, useCallback } from 'react'
import { getToken, getUsuario } from '../services/authStorage'

interface NotificacoesState {
  mensagensNaoLidas: number
  total:             number
}

export function useNotificacoes(): NotificacoesState {
  const [state, setState] = useState<NotificacoesState>({
    mensagensNaoLidas: 0,
    total:             0,
  })
  const intervaloRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const buscarViaRest = useCallback(async () => {
    try {
      const token   = getToken()
      const usuario = getUsuario<{ perfil?: string }>()
      if (!token || !usuario) return

      const baseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api')
        .replace(/\/api\/?$/, '')

      const resp = await fetch(`${baseUrl}/api/conversas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) return

      const conversas = await resp.json()
      if (!Array.isArray(conversas)) return

      const perfil = usuario.perfil
      let naoLidas = 0

      for (const conv of conversas) {
        if (perfil === 'admin') {
          naoLidas += conv.nao_lidas_admin ?? 0
        } else {
          naoLidas += conv.nao_lidas_aluno ?? 0
        }
      }

      setState({ mensagensNaoLidas: naoLidas, total: naoLidas })
    } catch { /* silencioso — não quebrar a UI */ }
  }, [])

  useEffect(() => {
    buscarViaRest()

    intervaloRef.current = setInterval(buscarViaRest, 30_000)

    const handler = () => buscarViaRest()
    window.addEventListener('nova-mensagem-recebida', handler)

    return () => {
      clearInterval(intervaloRef.current)
      window.removeEventListener('nova-mensagem-recebida', handler)
    }
  }, [buscarViaRest])

  return state
}
