import { useState, useEffect, useRef, useCallback } from 'react'
import { getToken } from '../services/authStorage'

export interface Mensagem {
  id:               string
  remetente_id:     string
  remetente_nome:   string
  remetente_perfil: string
  conteudo:         string | null
  tipo:             'texto' | 'arquivo'
  arquivo_url:      string | null
  arquivo_nome:     string | null
  arquivo_tipo:     string | null
  lida:             boolean
  criado_em:        string
}

export interface Conversa {
  id:              string
  aluno_id:        string
  aluno_nome?:     string
  aluno_setor?:    string
  titulo:          string
  status:          string
  ultima_mensagem: string | null
  ultima_msg_em:   string | null
  nao_lidas_admin: number
  nao_lidas_aluno: number
}

type Status = 'conectando' | 'conectado' | 'desconectado' | 'erro'

export function useChat() {
  const [mensagens,     setMensagens]     = useState<Mensagem[]>([])
  const [conversaAtiva, setConversaAtiva] = useState<any>(null)
  const [status,        setStatus]        = useState<Status>('conectando')
  const [enviando,      setEnviando]      = useState(false)
  const wsRef            = useRef<WebSocket | null>(null)
  const reconectarRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const conversaAtivaRef = useRef<any>(null)

  const conectar = useCallback(() => {
    const token = getToken()
    if (!token) { setStatus('erro'); return }

    const proto  = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
    const host   = apiUrl
      .replace(/^https?:\/\//, '')
      .replace(/\/api\/?$/, '')
    const url    = `${proto}//${host}/ws/chat`

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('conectado')
      ws.send(JSON.stringify({ tipo: 'auth', token }))
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)

        if (msg.tipo === 'auth_ok') {
          ws.send(JSON.stringify({ tipo: 'historico' }))
          return
        }
        if (msg.tipo === 'historico') {
          setConversaAtiva(msg.conversa)
          conversaAtivaRef.current = msg.conversa
          setMensagens(msg.mensagens ?? [])
          ws.send(JSON.stringify({ tipo: 'marcar_lida', tipo_contato: msg.conversa?.tipo_contato }))
          window.dispatchEvent(new CustomEvent('nova-mensagem-recebida'))
          return
        }
        if (msg.tipo === 'nova_mensagem') {
          if (conversaAtivaRef.current &&
              String(msg.conversa_id) !== String(conversaAtivaRef.current.id)) return
          setMensagens(prev => {
            if (prev.some(m => m.id === msg.mensagem.id)) return prev
            return [...prev, msg.mensagem]
          })
          window.dispatchEvent(new CustomEvent('nova-mensagem-recebida'))
          ws.send(JSON.stringify({ tipo: 'marcar_lida', tipo_contato: conversaAtivaRef.current?.tipo_contato }))
          return
        }
      } catch { /* ignore parse errors */ }
    }

    ws.onclose = () => {
      setStatus('desconectado')
      reconectarRef.current = setTimeout(conectar, 3000)
    }

    ws.onerror = () => setStatus('erro')
  }, [])

  useEffect(() => {
    conectar()
    return () => {
      clearTimeout(reconectarRef.current)
      wsRef.current?.close()
    }
  }, [conectar])

  const enviarMensagem = useCallback(async (
    conteudo: string,
    arquivo?: { url: string; nome: string; tipo: string }
  ) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    if (!conteudo.trim() && !arquivo) return
    setEnviando(true)
    try {
      wsRef.current.send(JSON.stringify({
        tipo:                 'mensagem',
        conteudo:             conteudo.trim() || null,
        arquivo_url:          arquivo?.url  ?? null,
        arquivo_nome:         arquivo?.nome ?? null,
        arquivo_tipo:         arquivo?.tipo ?? null,
        tipo_contato:         conversaAtivaRef.current?.tipo_contato ?? 'suporte',
        instrutor_id_payload: conversaAtivaRef.current?.instrutor_id ?? null,
      }))
    } finally {
      setEnviando(false)
    }
  }, [])

  const uploadArquivo = useCallback(async (file: File): Promise<{
    url: string; nome: string; tipo: string
  }> => {
    const token   = getToken()
    const form    = new FormData()
    form.append('arquivo', file)
    const apiUrl  = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
    const baseUrl = apiUrl.replace(/\/api\/?$/, '')
    const resp = await fetch(`${baseUrl}/api/mensagens/upload`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form,
    })
    if (!resp.ok) throw new Error('Erro no upload')
    return resp.json()
  }, [])

  const selecionarConversa = useCallback((tipo: string, instId?: string | null) => {
    setMensagens([])
    setConversaAtiva(null)
    conversaAtivaRef.current = null
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        tipo:                 'historico',
        tipo_contato:         tipo,
        instrutor_id_payload: instId ?? null,
      }))
    }
  }, [])

  return { mensagens, conversa: conversaAtiva, conversaAtiva, status, enviando, enviarMensagem, uploadArquivo, selecionarConversa }
}
