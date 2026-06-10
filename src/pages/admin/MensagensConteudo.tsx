import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Paperclip, X, Download, Search } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { getToken } from '../../services/authStorage'
import { useUsuarioLogado } from '../../hooks/useUsuarioLogado'

interface MensagensConteudoProps {
  onNavigate: (page: string) => void
}

const _apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
const baseUrl = _apiUrl.replace(/\/api\/?$/, '')

function useAdminChat(convSelecionadaRef: { current: any }) {
  const [mensagens, setMensagens] = useState<any[]>([])
  const [status,    setStatus]    = useState<'conectando' | 'conectado' | 'desconectado'>('conectando')
  const wsRef = useRef<WebSocket | null>(null)

  const conectar = useCallback(() => {
    const token = getToken()
    if (!token) return
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host  = baseUrl.replace(/^https?:\/\//, '')
    const ws    = new WebSocket(`${proto}//${host}/ws/chat`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('conectado')
      ws.send(JSON.stringify({ tipo: 'auth', token }))
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.tipo === 'auth_ok') return
        if (msg.tipo === 'nova_mensagem') {
          if (String(msg.conversa_id) !== String(convSelecionadaRef.current?.id)) return
          setMensagens(prev => {
            const semOptimista = prev.filter((m: any) =>
              !String(m.id).startsWith('temp-'))
            if (semOptimista.some((m: any) =>
              String(m.id) === String(msg.mensagem.id))) return prev
            return [...semOptimista, msg.mensagem]
          })
        }
      } catch { /* ignore */ }
    }

    ws.onclose = () => {
      setStatus('desconectado')
      setTimeout(conectar, 3000)
    }

    ws.onerror = () => setStatus('desconectado')
  }, [])

  useEffect(() => {
    conectar()
    return () => wsRef.current?.close()
  }, [conectar])

  const enviar = useCallback((conteudo: string, arquivo?: { url: string; nome: string; tipo: string }) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({
      tipo:         'mensagem',
      conteudo:     conteudo || null,
      arquivo_url:  arquivo?.url  ?? null,
      arquivo_nome: arquivo?.nome ?? null,
      arquivo_tipo: arquivo?.tipo ?? null,
      aluno_id:     convSelecionadaRef.current?.aluno_id ?? null,
    }))
  }, [])

  const uploadArquivo = useCallback(async (file: File) => {
    const token = getToken()
    const form  = new FormData()
    form.append('arquivo', file)
    const resp = await fetch(`${baseUrl}/api/mensagens/upload`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    form,
    })
    return resp.json()
  }, [])

  return { mensagens, setMensagens, status, enviar, uploadArquivo }
}

export function MensagensConteudo({ onNavigate: _onNavigate }: MensagensConteudoProps) {
  const { C } = useTheme()
  useUsuarioLogado()

  const [conversas,      setConversas]      = useState<any[]>([])
  const [convSelecionada,setConvSelecionada]= useState<any>(null)
  const [busca,          setBusca]          = useState('')
  const [texto,          setTexto]          = useState('')
  const [arquivoPreview, setArquivoPreview] = useState<{ url: string; nome: string; tipo: string } | null>(null)
  const [uploadando,     setUploadando]     = useState(false)
  const bottomRef          = useRef<HTMLDivElement>(null)
  const fileRef            = useRef<HTMLInputElement>(null)
  const convSelecionadaRef = useRef<any>(null)

  const { mensagens, setMensagens, status, enviar, uploadArquivo } = useAdminChat(convSelecionadaRef)

  useEffect(() => {
    const token = getToken()
    fetch(`${baseUrl}/api/conversas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConversas(data)
          if (data.length > 0) {
            const primeira = data[0]
            setConvSelecionada(primeira)
            convSelecionadaRef.current = primeira
            fetch(`${baseUrl}/api/conversas/${primeira.id}/mensagens`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(r => r.json())
              .then((msgs: any[]) => Array.isArray(msgs) ? setMensagens(msgs) : null)
              .catch(() => {})
          }
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleEnviar = () => {
    if (!texto.trim() && !arquivoPreview) return
    const mensagemOptimista = {
      id: `temp-${Date.now()}`,
      conteudo: texto,
      remetente_perfil: 'admin',
      conversa_id: convSelecionadaRef.current?.id,
      criado_em: new Date().toISOString(),
    }
    setMensagens(prev => [...prev, mensagemOptimista])
    enviar(texto, arquivoPreview ?? undefined)
    setTexto('')
    setArquivoPreview(null)
  }

  const handleArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadando(true)
    try {
      const res = await uploadArquivo(file)
      setArquivoPreview({ url: res.url, nome: res.nome, tipo: res.tipo })
    } finally {
      setUploadando(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const formatarHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const conversasFiltradas = conversas.filter(c =>
    !busca || c.aluno_nome?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>

      {/* Lista de conversas */}
      <div style={{ width: '300px', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 10px' }}>
            Mensagens
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '6px 10px' }}>
            <Search size={13} color={C.muted} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
              placeholder="Buscar aluno..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '12px', color: C.text, flex: 1 }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversasFiltradas.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
              Nenhuma conversa ainda
            </div>
          ) : conversasFiltradas.map(conv => (
            <div
              key={conv.id}
              onClick={() => {
                setConvSelecionada(conv)
                convSelecionadaRef.current = conv
                setMensagens([])
                const token = getToken()
                fetch(`${baseUrl}/api/conversas/${conv.id}/mensagens`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                  .then(r => r.json())
                  .then((msgs: any[]) => {
                    if (String(convSelecionadaRef.current?.id) === String(conv.id)) {
                      if (Array.isArray(msgs)) setMensagens(msgs)
                    }
                  })
                  .catch(() => {
                    if (String(convSelecionadaRef.current?.id) === String(conv.id)) {
                      setMensagens([])
                    }
                  })
              }}
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
                background: convSelecionada?.id === conv.id ? 'rgba(26,86,255,0.06)' : 'transparent',
                borderLeft: convSelecionada?.id === conv.id ? `3px solid ${C.blue}` : '3px solid transparent',
                transition: 'all 150ms',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(26,86,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: C.blue, flexShrink: 0 }}>
                  {conv.aluno_nome?.split(' ').slice(0, 2).map((n: string) => n[0]).join('') ?? '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {conv.aluno_nome ?? 'Aluno'}
                    </p>
                    {conv.nao_lidas_admin > 0 && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: C.blue, borderRadius: '10px', padding: '1px 6px', flexShrink: 0 }}>
                        {conv.nao_lidas_admin}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: C.muted, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.ultima_mensagem ?? conv.aluno_setor ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área do chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!convSelecionada ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: C.muted, fontSize: '14px', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>💬</span>
            Selecione uma conversa para responder
          </div>
        ) : (
          <>
            {/* Header da conversa */}
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(26,86,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: C.blue }}>
                  {convSelecionada.aluno_nome?.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 1px' }}>
                    {convSelecionada.aluno_nome}
                  </p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                    {convSelecionada.aluno_setor ?? convSelecionada.aluno_cargo ?? '—'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: status === 'conectado' ? '#10b981' : '#f59e0b' }} />
                <span style={{ fontSize: '11px', color: C.muted }}>
                  {status === 'conectado' ? 'Online' : 'Reconectando...'}
                </span>
              </div>
            </div>

            {/* Mensagens */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {mensagens.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: C.muted, fontSize: '13px', textAlign: 'center', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '32px' }}>💬</span>
                  Nenhuma mensagem ainda.<br />Aguardando o aluno entrar em contato.
                </div>
              ) : mensagens.map((m: any) => {
                const minha = m.remetente_perfil === 'admin'
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: minha ? 'flex-end' : 'flex-start', marginBottom: '4px' }}>
                    <div style={{ maxWidth: '65%' }}>
                      {!minha && (
                        <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 3px 2px', fontWeight: 600 }}>
                          {m.remetente_nome}
                        </p>
                      )}
                      <div style={{
                        background:   minha ? C.blue : C.surface,
                        border:       minha ? 'none' : `1px solid ${C.border}`,
                        borderRadius: minha ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding:      '10px 14px',
                      }}>
                        {m.tipo === 'arquivo' && m.arquivo_url && (
                          <a
                            href={`${baseUrl}${m.arquivo_url}`}
                            target="_blank"
                            rel="noreferrer"
                            download={m.arquivo_nome}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                          >
                            <span style={{ fontSize: '18px' }}>
                              {m.arquivo_tipo?.startsWith('image/') ? '🖼️' : '📄'}
                            </span>
                            <span style={{ fontSize: '12px', color: minha ? '#fff' : C.blue, fontWeight: 600 }}>
                              {m.arquivo_nome ?? 'arquivo'}
                            </span>
                            <Download size={12} color={minha ? '#fff' : C.blue} />
                          </a>
                        )}
                        {m.tipo === 'arquivo' && m.arquivo_tipo?.startsWith('image/') && (
                          <img
                            src={`${baseUrl}${m.arquivo_url}`}
                            alt=""
                            style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', marginTop: '6px', display: 'block' }}
                          />
                        )}
                        {m.conteudo && (
                          <p style={{ fontSize: '13px', color: minha ? '#fff' : C.text, margin: m.tipo === 'arquivo' ? '6px 0 0' : '0', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {m.conteudo}
                          </p>
                        )}
                      </div>
                      <p style={{ fontSize: '10px', color: C.muted, margin: '3px 2px 0', textAlign: minha ? 'right' : 'left' }}>
                        {formatarHora(m.criado_em)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Preview arquivo */}
            {arquivoPreview && (
              <div style={{ padding: '8px 20px', background: C.surface2, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{arquivoPreview.tipo?.startsWith('image/') ? '🖼️' : '📄'}</span>
                <p style={{ fontSize: '12px', color: C.text, margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {arquivoPreview.nome}
                </p>
                <button
                  onClick={() => setArquivoPreview(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadando}
                style={{ width: '36px', height: '36px', borderRadius: '8px', background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                {uploadando
                  ? <div style={{ width: '12px', height: '12px', border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <Paperclip size={14} color={C.muted} />
                }
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleArquivo} style={{ display: 'none' }} />

              <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '8px 12px' }}>
                <textarea
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Responder..."
                  rows={1}
                  style={{ width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontSize: '13px', color: C.text, fontFamily: 'inherit', lineHeight: 1.5, maxHeight: '100px', overflowY: 'auto', boxSizing: 'border-box' }}
                />
              </div>

              <button
                onClick={handleEnviar}
                disabled={!texto.trim() && !arquivoPreview}
                style={{ width: '36px', height: '36px', borderRadius: '8px', background: (!texto.trim() && !arquivoPreview) ? C.border : C.blue, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <Send size={14} color={(!texto.trim() && !arquivoPreview) ? C.muted : '#fff'} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
