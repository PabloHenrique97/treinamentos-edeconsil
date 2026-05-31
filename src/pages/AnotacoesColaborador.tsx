import { useState, useEffect } from 'react'
import {
  Plus, Search, Trash2, Edit3, Save,
  X, Clock, ChevronRight,
  FileText
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { cursosAPI } from '../services/api'

interface Anotacao {
  id: number
  cursoId: string
  cursoTitulo: string
  aulaId: number
  aulaTitulo: string
  texto: string
  dataCriacao: string
  dataEdicao: string
  cor: string
}

const anotacoesIniciais: Anotacao[] = []

function IlustracaoVazia({ C }: { C: Record<string, string> }) {
  return (
    <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="48" r="26" fill={C.surface2} stroke={C.border} strokeWidth="2.5" />
      <circle cx="52" cy="48" r="18" fill={C.bg} stroke={C.border} strokeWidth="1.5" />
      <line x1="70" y1="66" x2="84" y2="80" stroke={C.border} strokeWidth="4" strokeLinecap="round" />
      <rect x="10" y="68" width="32" height="38" rx="4" fill={C.surface2} stroke={C.border} strokeWidth="1.5" transform="rotate(-12 10 68)" />
      <line x1="18" y1="80" x2="34" y2="78" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="19" y1="86" x2="35" y2="84" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="92" x2="36" y2="90" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="72" y="65" width="32" height="38" rx="4" fill={C.surface2} stroke={C.border} strokeWidth="1.5" transform="rotate(10 72 65)" />
      <line x1="78" y1="78" x2="94" y2="80" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="77" y1="84" x2="93" y2="86" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="76" y1="90" x2="92" y2="92" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="38" y="72" width="36" height="34" rx="4" fill={C.surface} stroke={C.border} strokeWidth="1.5" />
      <line x1="45" y1="82" x2="67" y2="82" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="45" y1="88" x2="67" y2="88" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="45" y1="94" x2="58" y2="94" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

const coresAnotacao = ['#1a56ff', '#10b981', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2', '#db2777']

interface AnotacoesColaboradorProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function AnotacoesColaborador({ onNavigate, onLogout }: AnotacoesColaboradorProps) {
  const { C } = useTheme()
  const { nome, iniciais, perfil: perfilUsuario } = useUsuarioLogado()
  const roleDisplay = perfilUsuario === 'admin' ? 'Administrador' : 'Colaborador'
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(anotacoesIniciais)
  const [busca, setBusca] = useState('')
  const [cursoBusca, setCursoBusca] = useState('Todas as disciplinas')
  const [modoEditor, setModoEditor] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [cursoSelecionado, setCursoSelecionado] = useState('')
  const [aulaSelecionada, setAulaSelecionada] = useState('')
  const [textoAnotacao, setTextoAnotacao] = useState('')
  const [corSelecionada, setCorSelecionada] = useState(coresAnotacao[0])
  const [cursosApi, setCursosApi] = useState<{ id: string; slug: string; titulo: string }[]>([])

  useEffect(() => {
    ;(cursosAPI.meusCursos() as Promise<any[]>).then(rows => {
      setCursosApi((rows ?? []).map((c: any) => ({ id: c.id, slug: c.slug, titulo: c.titulo })))
    }).catch(() => {})
  }, [])

  const cursosOpcoes = ['Todas as disciplinas', ...cursosApi.map(c => c.titulo)]

  const anotacoesFiltradas = anotacoes.filter(a => {
    const matchBusca = a.texto.toLowerCase().includes(busca.toLowerCase()) ||
                       a.aulaTitulo.toLowerCase().includes(busca.toLowerCase()) ||
                       a.cursoTitulo.toLowerCase().includes(busca.toLowerCase())
    const matchCurso = cursoBusca === 'Todas as disciplinas' || a.cursoTitulo === cursoBusca
    return matchBusca && matchCurso
  })

  const todasAulas: { id: number; titulo: string }[] = []

  const abrirNovaAnotacao = () => {
    setCursoSelecionado(cursosApi[0]?.titulo ?? '')
    setAulaSelecionada('')
    setTextoAnotacao('')
    setCorSelecionada(coresAnotacao[0])
    setEditandoId(null)
    setModoEditor(true)
  }

  const editarAnotacao = (anotacao: Anotacao) => {
    setCursoSelecionado(anotacao.cursoTitulo)
    setAulaSelecionada(anotacao.aulaTitulo)
    setTextoAnotacao(anotacao.texto)
    setCorSelecionada(anotacao.cor)
    setEditandoId(anotacao.id)
    setModoEditor(true)
  }

  const salvarAnotacao = () => {
    if (!textoAnotacao.trim() || !cursoSelecionado) return

    const agora = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    if (editandoId !== null) {
      setAnotacoes(prev => prev.map(a =>
        a.id === editandoId
          ? { ...a, texto: textoAnotacao, cursoTitulo: cursoSelecionado, aulaTitulo: aulaSelecionada, cor: corSelecionada, dataEdicao: agora }
          : a
      ))
    } else {
      const nova: Anotacao = {
        id: Date.now(),
        cursoId: cursosApi.find(c => c.titulo === cursoSelecionado)?.slug ?? '',
        cursoTitulo: cursoSelecionado,
        aulaId: todasAulas.find(a => a.titulo === aulaSelecionada)?.id ?? 0,
        aulaTitulo: aulaSelecionada || 'Anotação geral',
        texto: textoAnotacao,
        dataCriacao: agora,
        dataEdicao: agora,
        cor: corSelecionada,
      }
      setAnotacoes(prev => [nova, ...prev])
    }

    setModoEditor(false)
    setEditandoId(null)
  }

  const excluirAnotacao = (id: number) => {
    setAnotacoes(prev => prev.filter(a => a.id !== id))
  }

  if (modoEditor) {
    return (
      <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar paginaAtiva="anotacoes" onNavigate={onNavigate} onLogout={onLogout} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Topbar
            navItems={[
              { label: 'Início',      ativo: false, onClick: () => onNavigate('dashboard') },
              { label: 'Meus Cursos', ativo: false, onClick: () => onNavigate('meusCursos') },
            ]}
            userName={nome} userRole={roleDisplay} userInitials={iniciais} notificacoes={3}
          />
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <span
                onClick={() => setModoEditor(false)}
                style={{ fontSize: '13px', color: C.blue, cursor: 'pointer', fontWeight: 500 }}
              >
                Minhas anotações
              </span>
              <span style={{ fontSize: '13px', color: C.muted }}>›</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>
                {editandoId ? 'Editar anotação' : 'Nova anotação'}
              </span>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', maxWidth: '760px' }}>
              <div style={{ height: '4px', background: corSelecionada }} />
              <div style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: C.text, margin: '0 0 20px' }}>
                  {editandoId ? 'Editar anotação' : 'Nova anotação'}
                </h2>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Disciplina *
                  </label>
                  <select
                    value={cursoSelecionado}
                    onChange={e => { setCursoSelecionado(e.target.value); setAulaSelecionada('') }}
                    style={{ width: '100%', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="">Selecione a disciplina</option>
                    {cursosApi.map(c => (
                      <option key={c.id} value={c.titulo}>{c.titulo}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Aula (opcional)
                  </label>
                  <select
                    value={aulaSelecionada}
                    onChange={e => setAulaSelecionada(e.target.value)}
                    disabled={!cursoSelecionado}
                    style={{ width: '100%', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: cursoSelecionado ? C.text : C.muted, outline: 'none', cursor: cursoSelecionado ? 'pointer' : 'not-allowed', opacity: cursoSelecionado ? 1 : 0.6 }}
                  >
                    <option value="">Anotação geral do curso</option>
                    {todasAulas.map(a => (
                      <option key={a.id} value={a.titulo}>{a.titulo}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Cor da etiqueta
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {coresAnotacao.map(cor => (
                      <button
                        key={cor}
                        onClick={() => setCorSelecionada(cor)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: cor, border: `3px solid ${corSelecionada === cor ? C.text : 'transparent'}`,
                          cursor: 'pointer', outline: 'none', transition: 'all 150ms',
                          boxShadow: corSelecionada === cor ? `0 0 0 2px ${C.bg}, 0 0 0 4px ${cor}` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Anotação *
                  </label>
                  <textarea
                    value={textoAnotacao}
                    onChange={e => setTextoAnotacao(e.target.value)}
                    placeholder="Escreva sua anotação aqui... Use este espaço para registrar pontos importantes, dúvidas ou resumos da aula."
                    rows={8}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '14px', background: C.surface2,
                      border: `1px solid ${C.border}`, borderRadius: '10px',
                      fontSize: '14px', color: C.text, outline: 'none',
                      resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.7,
                      minHeight: '180px',
                    }}
                    onFocus={e => e.target.style.borderColor = corSelecionada}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: C.muted }}>{textoAnotacao.length} caracteres</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setModoEditor(false)}
                    style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: C.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <X size={14} /> Cancelar
                  </button>
                  <button
                    onClick={salvarAnotacao}
                    disabled={!textoAnotacao.trim() || !cursoSelecionado}
                    style={{
                      padding: '10px 24px',
                      background: textoAnotacao.trim() && cursoSelecionado ? corSelecionada : C.border,
                      border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                      color: '#fff', cursor: textoAnotacao.trim() && cursoSelecionado ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 150ms',
                    }}
                  >
                    <Save size={14} /> {editandoId ? 'Salvar alterações' : 'Salvar anotação'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar paginaAtiva="anotacoes" onNavigate={onNavigate} onLogout={onLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          navItems={[
            { label: 'Início',      ativo: false, onClick: () => onNavigate('dashboard') },
            { label: 'Meus Cursos', ativo: false, onClick: () => onNavigate('meusCursos') },
          ]}
          userName={nome} userRole={roleDisplay} userInitials={iniciais} notificacoes={3}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

          <div style={{ marginBottom: '28px' }}>
            <div style={{ width: '40px', height: '3px', background: C.blue, borderRadius: '2px', marginBottom: '10px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
              Minhas anotações
            </h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              Acesse as anotações feitas durante a aula em cada disciplina que você estudou.
            </p>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 16px' }}>
            Disciplinas
          </h2>

          {anotacoes.length === 0 ? (
            <div style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '48px 32px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '12px', textAlign: 'center',
              maxWidth: '860px',
            }}>
              <IlustracaoVazia C={C as Record<string, string>} />

              <div style={{ marginTop: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                  Você ainda não fez anotações!
                </h3>
                <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px', maxWidth: '420px', lineHeight: 1.6 }}>
                  Para escrever anotações, basta acessar uma disciplina e começar a estudar!
                </p>
              </div>

              <button
                onClick={() => onNavigate('meusCursos')}
                style={{
                  padding: '13px 28px',
                  background: C.blue, color: '#fff',
                  border: 'none', borderRadius: '10px',
                  fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(26,86,255,0.30)',
                  transition: 'opacity 150ms',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Acessar minhas disciplinas
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 14px', flex: 1, minWidth: '200px' }}>
                  <Search size={14} color={C.muted} />
                  <input
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    placeholder="Buscar nas anotações..."
                    style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1 }}
                  />
                </div>
                <select
                  value={cursoBusca}
                  onChange={e => setCursoBusca(e.target.value)}
                  style={{ padding: '9px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', cursor: 'pointer', minWidth: '220px' }}
                >
                  {cursosOpcoes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={abrirNovaAnotacao}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                >
                  <Plus size={14} /> Nova anotação
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', maxWidth: '860px' }}>
                {anotacoesFiltradas.map(anotacao => (
                  <div
                    key={anotacao.id}
                    style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 150ms' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ height: '4px', background: anotacao.cor }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: anotacao.cor, flexShrink: 0 }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: anotacao.cor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {anotacao.cursoTitulo}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {anotacao.aulaTitulo}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button
                            onClick={() => editarAnotacao(anotacao)}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.10)'; e.currentTarget.style.borderColor = C.blue }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                          >
                            <Edit3 size={12} color={C.muted} />
                          </button>
                          <button
                            onClick={() => excluirAnotacao(anotacao.id)}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.10)'; e.currentTarget.style.borderColor = '#ef4444' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                          >
                            <Trash2 size={12} color={C.muted} />
                          </button>
                        </div>
                      </div>

                      <p style={{
                        fontSize: '13px', color: C.text, margin: '0 0 12px',
                        lineHeight: 1.6, display: '-webkit-box',
                        WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}>
                        {anotacao.texto}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
                        <Clock size={11} color={C.muted} />
                        <span style={{ fontSize: '11px', color: C.muted, flex: 1 }}>
                          {anotacao.dataEdicao !== anotacao.dataCriacao ? `Editado: ${anotacao.dataEdicao}` : anotacao.dataCriacao}
                        </span>
                        <span
                          onClick={() => editarAnotacao(anotacao)}
                          style={{ fontSize: '12px', fontWeight: 600, color: C.blue, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                        >
                          Ver tudo <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {anotacoesFiltradas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: C.muted }}>
                  <FileText size={32} color={C.border} style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: '0 0 6px' }}>
                    Nenhuma anotação encontrada
                  </p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 16px' }}>
                    Tente ajustar os filtros de busca.
                  </p>
                  <button
                    onClick={() => { setBusca(''); setCursoBusca('Todas as disciplinas') }}
                    style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </>
          )}

          {anotacoes.length > 0 && (
            <div style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
              <button
                onClick={abrirNovaAnotacao}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: C.blue, color: '#fff',
                  border: 'none', borderRadius: '12px',
                  padding: '13px 20px', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(26,86,255,0.40)',
                  transition: 'opacity 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Plus size={18} /> Nova anotação
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
