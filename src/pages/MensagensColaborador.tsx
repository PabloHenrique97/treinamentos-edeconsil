import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Paperclip, X, Download } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { useChat } from '../hooks/useChat'
import type { Mensagem } from '../hooks/useChat'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'

interface MensagensColaboradorProps {
  onNavigate: (page: string) => void
  onLogout:   () => void
}

const _apiUrl  = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
const BASE_URL = _apiUrl.replace(/\/api\/?$/, '')

export function MensagensColaborador({ onNavigate, onLogout }: MensagensColaboradorProps) {
  const { C } = useTheme()
  const { nome, iniciais, id: meuId } = useUsuarioLogado()
  const { mensagens, conversa, status, enviando, enviarMensagem, uploadArquivo } = useChat()

  const [texto,          setTexto]          = useState('')
  const [arquivoPreview, setArquivoPreview] = useState<{ url: string; nome: string; tipo: string } | null>(null)
  const [uploadando,     setUploadando]     = useState(false)
  const [erroEnvio,      setErroEnvio]      = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleEnviar = async () => {
    if ((!texto.trim() && !arquivoPreview) || enviando) return
    setErroEnvio('')
    try {
      await enviarMensagem(texto, arquivoPreview ?? undefined)
      setTexto('')
      setArquivoPreview(null)
    } catch {
      setErroEnvio('Erro ao enviar.')
    }
  }

  const handleArquivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadando(true)
    try {
      const res = await uploadArquivo(file)
      setArquivoPreview(res)
    } catch {
      setErroEnvio('Erro no upload.')
    } finally {
      setUploadando(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, arquivoPreview, enviando])

  const formatarHora = (iso: string) =>
    new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const formatarData = (iso: string) => {
    const d     = new Date(iso)
    const hoje  = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(hoje.getDate() - 1)
    if (d.toDateString() === hoje.toDateString())  return 'Hoje'
    if (d.toDateString() === ontem.toDateString()) return 'Ontem'
    return d.toLocaleDateString('pt-BR')
  }

  type GrupoData = { data: string; msgs: Mensagem[] }
  const grupos: GrupoData[] = []
  let dataAtual = ''
  for (const m of mensagens) {
    const data = formatarData(m.criado_em)
    if (data !== dataAtual) { dataAtual = data; grupos.push({ data, msgs: [] }) }
    grupos[grupos.length - 1].msgs.push(m)
  }

  const corStatus = status === 'conectado'  ? '#10b981'
    : status === 'conectando' ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      fontFamily: "'Inter',sans-serif",
      background: C.bg, color: C.text,
      display: 'flex', height: '100vh', overflow: 'hidden',
    }}>
      <Sidebar paginaAtiva="mensagens" onNavigate={onNavigate} onLogout={onLogout} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          navItems={[
            { label: 'Início',    ativo: false, onClick: () => onNavigate('dashboard') },
            { label: 'Mensagens', ativo: true },
          ]}
          userName={nome} userInitials={iniciais}
          userRole="Colaborador"
          onNavigate={onNavigate}
        />

        {/* Layout 2 colunas */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── COLUNA ESQUERDA: lista de conversas ── */}
          <div style={{
            width: '280px', flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            background: C.surface,
          }}>
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: 0 }}>
                Mensagens
              </h2>
            </div>

            {/* Conversa única do aluno */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${C.border}`,
                background: 'rgba(26,86,255,0.06)',
                borderLeft: `3px solid ${C.blue}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'rgba(26,86,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0,
                  }}>
                    🎓
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: 0 }}>
                        Suporte EAD
                      </p>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: corStatus, flexShrink: 0,
                      }} />
                    </div>
                    <p style={{
                      fontSize: '11px', color: C.muted,
                      margin: '2px 0 0',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {conversa?.ultima_mensagem ?? 'Tire suas dúvidas aqui'}
                    </p>
                  </div>
                </div>
                {(conversa?.nao_lidas_aluno ?? 0) > 0 && (
                  <div style={{ marginTop: '6px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: '#fff', background: '#ef4444',
                      borderRadius: '10px', padding: '2px 8px',
                    }}>
                      {conversa!.nao_lidas_aluno} nova(s)
                    </span>
                  </div>
                )}
              </div>

              {status === 'conectando' && (
                <div style={{ padding: '20px', textAlign: 'center', color: C.muted, fontSize: '12px' }}>
                  Conectando...
                </div>
              )}
            </div>

            {/* Rodapé status */}
            <div style={{
              padding: '10px 16px',
              borderTop: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: corStatus }} />
              <span style={{ fontSize: '11px', color: C.muted }}>
                {status === 'conectado'  ? 'Conectado ao servidor'
                  : status === 'conectando' ? 'Conectando...'
                  : 'Sem conexão'}
              </span>
            </div>
          </div>

          {/* ── COLUNA DIREITA: área do chat ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header do chat */}
            <div style={{
              padding: '12px 20px',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center',
              background: C.surface,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(26,86,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  🎓
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 1px' }}>
                    Suporte EAD
                  </p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>
                    Equipe de suporte da Universidade Corporativa
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              {/* Estado vazio */}
              {mensagens.length === 0 && status === 'conectado' && (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  flex: 1, gap: '12px', textAlign: 'center', padding: '40px',
                }}>
                  <span style={{ fontSize: '48px' }}>💬</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: 0 }}>
                    Olá, {nome.split(' ')[0]}!
                  </h3>
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0, maxWidth: '320px', lineHeight: 1.6 }}>
                    Envie sua dúvida para o Suporte EAD. Responderemos em breve!
                  </p>
                </div>
              )}

              {/* Grupos por data */}
              {grupos.map(({ data, msgs }) => (
                <div key={data}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: C.border }} />
                    <span style={{ fontSize: '11px', color: C.muted, fontWeight: 600, whiteSpace: 'nowrap', padding: '0 8px' }}>
                      {data}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: C.border }} />
                  </div>

                  {msgs.map(m => {
                    const minha = m.remetente_id === meuId
                    return (
                      <div key={m.id} style={{
                        display: 'flex',
                        justifyContent: minha ? 'flex-end' : 'flex-start',
                        marginBottom: '6px',
                      }}>
                        {!minha && (
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'rgba(26,86,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', flexShrink: 0,
                            marginRight: '8px', alignSelf: 'flex-end',
                          }}>
                            🎓
                          </div>
                        )}

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
                            padding:      m.tipo === 'arquivo' ? '8px 12px' : '10px 14px',
                          }}>
                            {m.tipo === 'arquivo' && m.arquivo_url && (
                              <a
                                href={`${BASE_URL}${m.arquivo_url}`}
                                target="_blank" rel="noreferrer"
                                download={m.arquivo_nome ?? 'arquivo'}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                              >
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '8px',
                                  background: minha ? 'rgba(255,255,255,0.20)' : 'rgba(26,86,255,0.10)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  {m.arquivo_tipo?.startsWith('image/') ? '🖼️' : '📄'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: '12px', fontWeight: 600, color: minha ? '#fff' : C.text, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {m.arquivo_nome ?? 'arquivo'}
                                  </p>
                                  <p style={{ fontSize: '10px', color: minha ? 'rgba(255,255,255,0.70)' : C.muted, margin: 0 }}>
                                    Clique para baixar
                                  </p>
                                </div>
                                <Download size={14} color={minha ? '#fff' : C.blue} />
                              </a>
                            )}

                            {m.tipo === 'arquivo' && m.arquivo_tipo?.startsWith('image/') && (
                              <img
                                src={`${BASE_URL}${m.arquivo_url}`}
                                alt={m.arquivo_nome ?? 'imagem'}
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '6px', display: 'block' }}
                              />
                            )}

                            {m.conteudo && (
                              <p style={{
                                fontSize: '13px', color: minha ? '#fff' : C.text,
                                margin: m.tipo === 'arquivo' ? '6px 0 0' : '0',
                                lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                              }}>
                                {m.conteudo}
                              </p>
                            )}
                          </div>

                          <p style={{ fontSize: '10px', color: C.muted, margin: '3px 2px 0', textAlign: minha ? 'right' : 'left' }}>
                            {formatarHora(m.criado_em)}{minha && m.lida ? ' ✓✓' : ''}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Preview arquivo selecionado */}
            {arquivoPreview && (
              <div style={{
                padding: '8px 20px', background: C.surface2,
                borderTop: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span>{arquivoPreview.tipo?.startsWith('image/') ? '🖼️' : '📄'}</span>
                <p style={{ fontSize: '12px', color: C.text, margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {arquivoPreview.nome}
                </p>
                <button onClick={() => setArquivoPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {erroEnvio && (
              <p style={{ fontSize: '12px', color: '#ef4444', margin: '0 20px 6px', textAlign: 'center' }}>
                ⚠️ {erroEnvio}
              </p>
            )}

            {/* Input */}
            <div style={{
              padding: '12px 20px',
              borderTop: `1px solid ${C.border}`,
              display: 'flex', gap: '8px', alignItems: 'flex-end',
              background: C.surface,
            }}>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadando}
                title="Anexar PDF ou imagem"
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: C.surface2, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: uploadando ? 'not-allowed' : 'pointer',
                  flexShrink: 0, opacity: uploadando ? 0.6 : 1,
                }}
              >
                {uploadando
                  ? <div style={{ width: '14px', height: '14px', border: `2px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <Paperclip size={16} color={C.muted} />
                }
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleArquivo} style={{ display: 'none' }} />

              <div style={{
                flex: 1, background: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '10px 14px',
              }}>
                <textarea
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyPress={e => e.stopPropagation()}
                  placeholder="Digite sua mensagem... (Enter para enviar)"
                  rows={1}
                  style={{
                    width: '100%', background: 'none', border: 'none', outline: 'none',
                    resize: 'none', fontSize: '13px', color: C.text,
                    fontFamily: 'inherit', lineHeight: 1.5,
                    maxHeight: '120px', overflowY: 'auto',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={handleEnviar}
                disabled={enviando || (!texto.trim() && !arquivoPreview)}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: (enviando || (!texto.trim() && !arquivoPreview)) ? C.border : C.blue,
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: (enviando || (!texto.trim() && !arquivoPreview)) ? 'not-allowed' : 'pointer',
                  flexShrink: 0, transition: 'background 150ms',
                }}
              >
                <Send size={16} color={(enviando || (!texto.trim() && !arquivoPreview)) ? C.muted : '#fff'} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
