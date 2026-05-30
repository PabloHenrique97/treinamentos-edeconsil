import { useState, useEffect, useRef, useCallback } from 'react'
import { getToken, getUsuario } from '../services/authStorage'

export interface Notificacao {
  id:          string
  tipo:        string
  titulo:      string
  mensagem:    string | null
  lida:        boolean
  link_pagina: string | null
  dados_extra: any
  criado_em:   string
}

export interface ContadorNotif {
  notificacoes: number
  mensagens:    number
  total:        number
}

const _apiUrl  = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api'
const BASE_URL = _apiUrl.endsWith('/api') ? _apiUrl : _apiUrl + '/api'

async function fetchAuth(path: string, opts?: RequestInit) {
  const token = getToken()
  const resp  = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts?.headers ?? {}),
    },
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return resp.json()
}

export function useNotificacoes() {
  const [notificacoes,  setNotificacoes]  = useState<Notificacao[]>([])
  const [contador,      setContador]      = useState<ContadorNotif>({
    notificacoes: 0, mensagens: 0, total: 0,
  })
  const [aberto,        setAberto]        = useState(false)
  const [carregando,    setCarregando]    = useState(false)
  const intervaloRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const buscarContador = useCallback(async () => {
    try {
      const data = await fetchAuth('/notificacoes/contador')
      setContador(data)
    } catch {}
  }, [])

  const buscarNotificacoes = useCallback(async () => {
    setCarregando(true)
    try {
      const data = await fetchAuth('/notificacoes')
      setNotificacoes(data.notificacoes ?? [])
    } catch {} finally {
      setCarregando(false)
    }
  }, [])

  const marcarLida = useCallback(async (id: string) => {
    try {
      await fetchAuth(`/notificacoes/${id}/lida`, { method: 'PATCH' })
      setNotificacoes(prev =>
        prev.map(n => n.id === id ? { ...n, lida: true } : n)
      )
      setContador(prev => ({
        ...prev,
        notificacoes: Math.max(0, prev.notificacoes - 1),
        total:        Math.max(0, prev.total - 1),
      }))
    } catch {}
  }, [])

  const marcarTodasLidas = useCallback(async () => {
    try {
      await fetchAuth('/notificacoes/marcar-todas-lidas', { method: 'PATCH' })
      setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
      setContador(prev => ({ ...prev, notificacoes: 0, total: prev.mensagens }))
    } catch {}
  }, [])

  const abrirDropdown = useCallback(() => {
    setAberto(true)
    buscarNotificacoes()
  }, [buscarNotificacoes])

  const fecharDropdown = useCallback(() => {
    setAberto(false)
  }, [])

  useEffect(() => {
    const usuario = getUsuario()
    if (!usuario) return

    buscarContador()
    intervaloRef.current = setInterval(buscarContador, 30_000)

    const handler = () => buscarContador()
    window.addEventListener('nova-mensagem-recebida', handler)
    window.addEventListener('notificacao-nova',       handler)

    return () => {
      clearInterval(intervaloRef.current)
      window.removeEventListener('nova-mensagem-recebida', handler)
      window.removeEventListener('notificacao-nova',       handler)
    }
  }, [buscarContador])

  return {
    notificacoes, contador, aberto, carregando,
    abrirDropdown, fecharDropdown,
    marcarLida, marcarTodasLidas,
    totalNaoLidas:     contador.total,
    mensagensNaoLidas: contador.mensagens,
    notifNaoLidas:     contador.notificacoes,
  }
}
