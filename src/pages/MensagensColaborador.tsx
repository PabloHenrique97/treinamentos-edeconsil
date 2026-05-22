import { useState, useRef, useEffect } from 'react'
import {
  Send, Search, MoreVertical, Phone,
  Video, Paperclip, Smile, Check,
  CheckCheck,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'

// ── Tipos ──
interface Mensagem {
  id: number
  texto: string
  hora: string
  remetente: 'aluno' | 'tutor'
  status: 'enviado' | 'entregue' | 'lido'
  tipo: 'texto' | 'arquivo' | 'imagem'
}

interface Conversa {
  id: number
  tutor: string
  cargo: string
  curso: string
  iniciais: string
  cor: string
  online: boolean
  ultimaMensagem: string
  ultimaHora: string
  naoLidas: number
  mensagens: Mensagem[]
}

// ── Dados mock ──
const conversasMock: Conversa[] = [
  {
    id: 1,
    tutor: 'Carlos Eduardo Mendes',
    cargo: 'Tutor — NR-35',
    curso: 'NR-35 — Trabalho em Altura',
    iniciais: 'CE',
    cor: '#dc2626',
    online: true,
    ultimaMensagem: 'Olá! Pode me chamar a qualquer momento.',
    ultimaHora: '10:32',
    naoLidas: 2,
    mensagens: [
      { id: 1,  texto: 'Olá João! Seja bem-vindo ao curso NR-35. Estou à disposição para tirar suas dúvidas.', hora: '09:00', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 2,  texto: 'Bom dia! Tenho uma dúvida sobre a Aula 3 — Equipamentos de Proteção Individual.', hora: '09:45', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 3,  texto: 'Claro! Qual é a sua dúvida?', hora: '09:46', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 4,  texto: 'Qual é a diferença entre o cinturão tipo paraquedista e o cinturão abdominal?', hora: '09:48', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 5,  texto: 'Ótima pergunta! O cinturão abdominal é usado apenas para posicionamento e restrição de movimentos. Já o cinturão paraquedista é obrigatório para trabalhos em altura acima de 2 metros, pois distribui a energia de uma queda por todo o corpo — ombros, peito, quadril e pernas.', hora: '09:52', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 6,  texto: 'O paraquedista é exigido pela NR-35 sempre que há risco de queda livre, enquanto o abdominal pode ser usado apenas quando o risco de queda é nulo.', hora: '09:52', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 7,  texto: 'Ficou bem claro! Muito obrigado pela explicação detalhada.', hora: '10:01', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 8,  texto: 'Fico feliz em ajudar! Se tiver mais alguma dúvida, pode perguntar à vontade. Estou aqui para isso! 😊', hora: '10:03', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 9,  texto: 'Com certeza! Continuando o estudo da aula, vi que menciona "permissão de trabalho". Isso é obrigatório sempre?', hora: '10:28', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 10, texto: 'Sim! A Permissão de Trabalho em Altura (PTA) é obrigatória sempre que houver trabalho acima de 2m com risco de queda. Ela deve ser emitida antes do início de cada atividade.', hora: '10:30', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 11, texto: 'Olá! Pode me chamar a qualquer momento.', hora: '10:32', remetente: 'tutor', status: 'lido', tipo: 'texto' },
    ],
  },
  {
    id: 2,
    tutor: 'Juliana Ferreira Costa',
    cargo: 'Tutora — SIPAT',
    curso: 'SIPAT — Segurança no Canteiro',
    iniciais: 'JF',
    cor: '#d97706',
    online: false,
    ultimaMensagem: 'O material da Aula 2 foi atualizado!',
    ultimaHora: 'Ontem',
    naoLidas: 0,
    mensagens: [
      { id: 1, texto: 'Olá João! Bem-vindo ao curso SIPAT. Qualquer dúvida é só chamar!', hora: 'Seg', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 2, texto: 'Obrigado! Vou começar as aulas essa semana.', hora: 'Seg', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 3, texto: 'O material da Aula 2 foi atualizado com novos exemplos práticos!', hora: 'Ontem', remetente: 'tutor', status: 'lido', tipo: 'texto' },
    ],
  },
  {
    id: 3,
    tutor: 'Carla Beatriz Monteiro',
    cargo: 'Tutora — ISO 9001',
    curso: 'Gestão da Qualidade ISO 9001',
    iniciais: 'CB',
    cor: '#7c3aed',
    online: true,
    ultimaMensagem: 'Quando quiser começar o Módulo 2, avise!',
    ultimaHora: '08:15',
    naoLidas: 1,
    mensagens: [
      { id: 1, texto: 'Olá João! Parabéns por iniciar o curso de Gestão da Qualidade!', hora: '08:00', remetente: 'tutor', status: 'lido', tipo: 'texto' },
      { id: 2, texto: 'Obrigado! Estou animado para aprender sobre ISO 9001.', hora: '08:10', remetente: 'aluno', status: 'lido', tipo: 'texto' },
      { id: 3, texto: 'Quando quiser começar o Módulo 2, avise!', hora: '08:15', remetente: 'tutor', status: 'entregue', tipo: 'texto' },
    ],
  },
]

const respostasAuto = [
  'Entendido! Fico feliz em ajudar. 😊',
  'Ótima dúvida! Vou te explicar melhor.',
  'Claro! Pode perguntar à vontade.',
  'Muito bem! Continue assim nos estudos!',
  'Essa é uma questão muito importante. Deixa eu te explicar...',
]

// ── Componente principal ──
interface MensagensColaboradorProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function MensagensColaborador({ onNavigate, onLogout }: MensagensColaboradorProps) {
  const { C } = useTheme()
  const { nome, iniciais, perfil: perfilUsuario } = useUsuarioLogado()
  const roleDisplay = perfilUsuario === 'admin' ? 'Administrador' : 'Colaborador'
  const [conversas, setConversas] = useState<Conversa[]>(conversasMock)
  const [conversaAtiva, setConversaAtiva] = useState<Conversa>(conversasMock[0])
  const [textoBusca, setTextoBusca] = useState('')
  const [textoMensagem, setTextoMensagem] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversaAtiva.id, conversaAtiva.mensagens.length])

  const conversasFiltradas = conversas.filter(c =>
    c.tutor.toLowerCase().includes(textoBusca.toLowerCase()) ||
    c.curso.toLowerCase().includes(textoBusca.toLowerCase())
  )

  const enviarMensagem = () => {
    const texto = textoMensagem.trim()
    if (!texto) return

    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const novaMensagem: Mensagem = {
      id: Date.now(),
      texto,
      hora,
      remetente: 'aluno',
      status: 'enviado',
      tipo: 'texto',
    }

    setConversas(prev => prev.map(c =>
      c.id === conversaAtiva.id
        ? { ...c, mensagens: [...c.mensagens, novaMensagem], ultimaMensagem: texto, ultimaHora: hora }
        : c
    ))
    setConversaAtiva(prev => ({
      ...prev,
      mensagens: [...prev.mensagens, novaMensagem],
      ultimaMensagem: texto,
      ultimaHora: hora,
    }))
    setTextoMensagem('')

    const idConversa = conversaAtiva.id
    setTimeout(() => {
      const horaResp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      const resposta: Mensagem = {
        id: Date.now() + 1,
        texto: respostasAuto[Math.floor(Math.random() * respostasAuto.length)],
        hora: horaResp,
        remetente: 'tutor',
        status: 'lido',
        tipo: 'texto',
      }
      setConversas(prev => prev.map(c =>
        c.id === idConversa
          ? { ...c, mensagens: [...c.mensagens, resposta], ultimaMensagem: resposta.texto, ultimaHora: horaResp }
          : c
      ))
      setConversaAtiva(prev =>
        prev.id === idConversa
          ? { ...prev, mensagens: [...prev.mensagens, resposta] }
          : prev
      )
    }, 1500)
  }

  const selecionarConversa = (conversa: Conversa) => {
    setConversas(prev => prev.map(c => c.id === conversa.id ? { ...c, naoLidas: 0 } : c))
    setConversaAtiva({ ...conversa, naoLidas: 0 })
  }

  const IconeStatus = ({ status }: { status: Mensagem['status'] }) => {
    if (status === 'enviado')  return <Check size={12} color="rgba(255,255,255,0.6)" />
    if (status === 'entregue') return <CheckCheck size={12} color="rgba(255,255,255,0.6)" />
    if (status === 'lido')     return <CheckCheck size={12} color="#60d4f5" />
    return null
  }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      <Sidebar paginaAtiva="mensagens" onNavigate={onNavigate} onLogout={onLogout} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <Topbar
          navItems={[
            { label: 'Início',       ativo: false, onClick: () => onNavigate('dashboard') },
            { label: 'Meus Cursos',  ativo: false, onClick: () => onNavigate('meusCursos') },
            { label: 'Mensagens',    ativo: true },
            { label: 'Certificados', ativo: false, onClick: () => onNavigate('certificadosColaborador') },
            { label: 'Trilhas',      ativo: false, onClick: () => onNavigate('trilha') },
          ]}
          userName={nome} userRole={roleDisplay} userInitials={iniciais} notificacoes={3}
        />

        {/* Container do chat */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── PAINEL ESQUERDO — Lista de conversas ── */}
          <div style={{
            width: '320px',
            flexShrink: 0,
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>

            {/* Header da lista */}
            <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 12px' }}>
                Mensagens
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '8px 12px' }}>
                <Search size={14} color={C.muted} />
                <input
                  value={textoBusca}
                  onChange={e => setTextoBusca(e.target.value)}
                  placeholder="Buscar conversa..."
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1 }}
                />
              </div>
            </div>

            {/* Lista de conversas */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversasFiltradas.map(conversa => {
                const ativa = conversaAtiva.id === conversa.id
                return (
                  <div
                    key={conversa.id}
                    onClick={() => selecionarConversa(conversa)}
                    style={{
                      padding: '14px 16px',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      cursor: 'pointer',
                      background: ativa ? `rgba(26,86,255,0.08)` : 'transparent',
                      borderLeft: ativa ? `3px solid ${C.blue}` : '3px solid transparent',
                      borderBottom: `1px solid ${C.border}`,
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => { if (!ativa) e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
                    onMouseLeave={e => { if (!ativa) e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Avatar com indicador online */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: `${conversa.cor}22`,
                        border: `2px solid ${conversa.cor}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: 700, color: conversa.cor,
                      }}>
                        {conversa.iniciais}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: '1px', right: '1px',
                        width: '11px', height: '11px', borderRadius: '50%',
                        background: conversa.online ? '#10b981' : C.border,
                        border: `2px solid ${C.surface}`,
                      }} />
                    </div>

                    {/* Info da conversa */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px', fontWeight: ativa || conversa.naoLidas > 0 ? 700 : 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                          {conversa.tutor}
                        </span>
                        <span style={{ fontSize: '11px', color: conversa.naoLidas > 0 ? C.blue : C.muted, flexShrink: 0 }}>
                          {conversa.ultimaHora}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: conversa.naoLidas > 0 ? C.text : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', fontWeight: conversa.naoLidas > 0 ? 600 : 400 }}>
                          {conversa.ultimaMensagem}
                        </span>
                        {conversa.naoLidas > 0 && (
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0, marginLeft: '6px' }}>
                            {conversa.naoLidas}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '10px', color: C.muted }}>
                        {conversa.cargo}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── PAINEL DIREITO — Chat ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>

            {/* Header do chat */}
            <div style={{
              padding: '14px 20px',
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: '14px',
              flexShrink: 0,
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `${conversaAtiva.cor}22`,
                  border: `2px solid ${conversaAtiva.cor}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, color: conversaAtiva.cor,
                }}>
                  {conversaAtiva.iniciais}
                </div>
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: conversaAtiva.online ? '#10b981' : C.border,
                  border: `2px solid ${C.surface}`,
                }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{conversaAtiva.tutor}</div>
                <div style={{ fontSize: '11px', color: conversaAtiva.online ? '#10b981' : C.muted }}>
                  {conversaAtiva.online ? '● Online agora' : '○ Offline'} · {conversaAtiva.cargo}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {([
                  { icon: Phone, title: 'Ligar' },
                  { icon: Video, title: 'Videochamada' },
                  { icon: MoreVertical, title: 'Mais opções' },
                ] as const).map(({ icon: Icon, title }) => (
                  <button key={title} title={title}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(26,86,255,0.08)`; e.currentTarget.style.borderColor = C.blue }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                  >
                    <Icon size={16} color={C.muted} />
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa do curso */}
            <div style={{ padding: '8px 20px', background: `rgba(26,86,255,0.05)`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.blue, flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: C.blue, fontWeight: 600 }}>Curso: {conversaAtiva.curso}</span>
            </div>

            {/* ── ÁREA DE MENSAGENS ── */}
            <div
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {/* Separador de data */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                <div style={{ flex: 1, height: '1px', background: C.border }} />
                <span style={{ fontSize: '11px', color: C.muted, whiteSpace: 'nowrap', padding: '0 8px', background: C.bg, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                  Hoje
                </span>
                <div style={{ flex: 1, height: '1px', background: C.border }} />
              </div>

              {conversaAtiva.mensagens.map((msg, idx) => {
                const ehAluno = msg.remetente === 'aluno'
                const proxMesmoRemetente = conversaAtiva.mensagens[idx + 1]?.remetente === msg.remetente
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: ehAluno ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: '8px',
                      marginBottom: proxMesmoRemetente ? '2px' : '8px',
                    }}
                  >
                    {/* Avatar do tutor (apenas na última mensagem do grupo) */}
                    {!ehAluno && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        background: !proxMesmoRemetente ? `${conversaAtiva.cor}22` : 'transparent',
                        border: !proxMesmoRemetente ? `1.5px solid ${conversaAtiva.cor}44` : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700, color: conversaAtiva.cor,
                      }}>
                        {!proxMesmoRemetente ? conversaAtiva.iniciais : ''}
                      </div>
                    )}

                    {/* Balão da mensagem */}
                    <div style={{
                      maxWidth: '68%',
                      padding: '10px 14px',
                      borderRadius: ehAluno
                        ? proxMesmoRemetente ? '16px 4px 4px 16px' : '16px 4px 16px 16px'
                        : proxMesmoRemetente ? '4px 16px 16px 4px' : '4px 16px 16px 16px',
                      background: ehAluno ? C.blue : C.surface,
                      border: ehAluno ? 'none' : `1px solid ${C.border}`,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    }}>
                      <p style={{ fontSize: '13px', color: ehAluno ? '#ffffff' : C.text, margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>
                        {msg.texto}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: ehAluno ? 'rgba(255,255,255,0.65)' : C.muted }}>
                          {msg.hora}
                        </span>
                        {ehAluno && <IconeStatus status={msg.status} />}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Indicador de digitando */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${conversaAtiva.cor}22`, border: `1.5px solid ${conversaAtiva.cor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: conversaAtiva.cor, flexShrink: 0 }}>
                  {conversaAtiva.iniciais}
                </div>
                <div style={{ padding: '10px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.muted, opacity: 0.4 + i * 0.2 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── ÁREA DE INPUT ── */}
            <div style={{
              padding: '14px 20px',
              background: C.surface,
              borderTop: `1px solid ${C.border}`,
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: '10px',
                background: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: '14px',
                padding: '10px 14px',
              }}>
                <button title="Anexar arquivo" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', flexShrink: 0, marginBottom: '2px' }}>
                  <Paperclip size={18} color={C.muted} />
                </button>

                <textarea
                  value={textoMensagem}
                  onChange={e => setTextoMensagem(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      enviarMensagem()
                    }
                  }}
                  placeholder="Digite uma mensagem..."
                  rows={1}
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontSize: '13px', color: C.text, resize: 'none',
                    fontFamily: 'inherit', lineHeight: 1.5,
                    maxHeight: '100px', overflowY: 'auto',
                  }}
                />

                <button title="Emoji" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center', flexShrink: 0, marginBottom: '2px' }}>
                  <Smile size={18} color={C.muted} />
                </button>

                <button
                  onClick={enviarMensagem}
                  disabled={!textoMensagem.trim()}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: textoMensagem.trim() ? C.blue : C.border,
                    border: 'none', cursor: textoMensagem.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 150ms',
                    transform: textoMensagem.trim() ? 'scale(1)' : 'scale(0.9)',
                  }}
                >
                  <Send size={16} color="#ffffff" style={{ marginLeft: '2px', marginTop: '-1px' }} />
                </button>
              </div>
              <p style={{ fontSize: '11px', color: C.muted, margin: '6px 0 0', textAlign: 'center' }}>
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
