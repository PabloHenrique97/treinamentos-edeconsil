import { useState } from 'react'
import {
  ChevronDown, ChevronUp, ChevronRight,
  Calendar, BookOpen, FileText,
  MessageSquare, Play, Download,
  Check, Clock,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { cursosMockColaborador } from '../data/cursosMock'

interface CursoDetalheColaboradorProps {
  cursoId: string
  onNavigate: (page: string) => void
  onLogout: () => void
  onVoltarLista: () => void
  onAbrirAula: (cursoId: string, moduloId: number, aulaId: number) => void
}

export function CursoDetalheColaborador({
  cursoId, onNavigate, onLogout, onVoltarLista, onAbrirAula
}: CursoDetalheColaboradorProps) {
  const { C } = useTheme()
  const { nome, iniciais, perfil: perfilUsuario } = useUsuarioLogado()
  const roleDisplay = perfilUsuario === 'admin' ? 'Administrador' : 'Colaborador'
  const curso = cursosMockColaborador.find(c => c.id === cursoId) ?? cursosMockColaborador[0]
  const [modulos, setModulos] = useState(curso.modulos)

  const toggleModulo = (id: number) => {
    setModulos(prev => prev.map(m => m.id === id ? { ...m, aberto: !m.aberto } : m))
  }

  const corStatus = (s: string) => ({
    'Concluída':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    'Em andamento': { color: C.blue,   bg: 'rgba(26,86,255,0.10)',  border: 'rgba(26,86,255,0.25)'  },
    'Incompleta':   { color: C.muted,  bg: C.surface2,              border: C.border                },
  } as Record<string, { color: string; bg: string; border: string }>)[s] ?? { color: C.muted, bg: C.surface2, border: C.border }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar paginaAtiva="meusCursos" onNavigate={onNavigate} onLogout={onLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          navItems={[
            { label: 'Início',       ativo: false, onClick: () => onNavigate('dashboard') },
            { label: 'Meus Cursos',  ativo: true,  onClick: onVoltarLista },
            { label: 'Certificados', ativo: false, onClick: () => onNavigate('certificadosColaborador') },
            { label: 'Biblioteca',   ativo: false, onClick: () => onNavigate('apostilas') },
            { label: 'Trilhas',      ativo: false, onClick: () => onNavigate('trilha') },
          ]}
          userName={nome} userRole={roleDisplay} userInitials={iniciais} notificacoes={3}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Breadcrumb */}
          <div style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
            <span onClick={onVoltarLista} style={{ fontSize: '13px', color: C.blue, cursor: 'pointer', fontWeight: 500 }}>Meus Cursos</span>
            <span style={{ fontSize: '13px', color: C.muted }}>›</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{curso.titulo}</span>
          </div>

          <div style={{ padding: '32px', maxWidth: '860px', margin: '0 auto' }}>

            {/* Título do curso */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${curso.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {curso.icone}
                </div>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.text, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {curso.titulo}
                  </h1>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: C.muted }}>Instrutor: <strong style={{ color: C.text }}>{curso.instrutor}</strong></span>
                    <span style={{ fontSize: '12px', color: C.muted }}>·</span>
                    <span style={{ fontSize: '12px', color: C.muted }}>{curso.cargaHoraria}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card live */}
            {curso.live && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#fff', background: C.blue, borderRadius: '4px', padding: '2px 8px', fontWeight: 700 }}>
                    {curso.live.status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color={C.muted} />
                    <span style={{ fontSize: '13px', color: C.text }}>{curso.live.data}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color={C.muted} />
                    <span style={{ fontSize: '13px', color: C.text }}>{curso.live.hora}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{curso.live.titulo}</p>
              </div>
            )}

            {/* Calendário */}
            <div
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color={C.blue} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>Calendário da disciplina</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: C.muted }}>Período de estudo: {curso.calendario.inicio} a {curso.calendario.fim}</span>
                <ChevronRight size={16} color={C.blue} />
              </div>
            </div>

            {/* Progresso */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                  <span style={{ color: C.blue, fontWeight: 700 }}>{curso.progresso}%</span>
                  <span style={{ color: C.text }}> Progresso em aula</span>
                </span>
                <span style={{ fontSize: '12px', color: C.muted }}>{curso.aulasConcluidas} de {curso.totalAulas} aulas</span>
              </div>
              <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '6px' }}>
                <div style={{ background: C.blue, height: '6px', borderRadius: '4px', width: `${curso.progresso}%`, transition: 'width 0.5s' }} />
              </div>
            </div>

            {/* Apresentação */}
            <div
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={16} color={C.blue} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>Apresentação da disciplina</span>
              </div>
              <ChevronRight size={16} color={C.blue} />
            </div>

            {/* Pontuação */}
            <div style={{ background: C.blue, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Pontuação atual:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{curso.aulasConcluidas * 10} pontos de 100</span>
                <ChevronRight size={16} color="#fff" />
              </div>
            </div>

            {/* Minhas anotações */}
            <div
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={16} color={C.blue} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>Minhas anotações</span>
              </div>
              <ChevronRight size={16} color={C.blue} />
            </div>

            {/* Mensagens do mediador */}
            <div
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={16} color={C.blue} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>Mensagens do mediador</span>
              </div>
              <ChevronRight size={16} color={C.blue} />
            </div>

            {/* ── MÓDULOS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {modulos.map(mod => (
                <div key={mod.id}>
                  {/* Cabeçalho do módulo */}
                  <div
                    onClick={() => toggleModulo(mod.id)}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${C.blue}`,
                      borderRadius: '10px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '16px',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `rgba(26,86,255,0.04)`}
                    onMouseLeave={e => e.currentTarget.style.background = C.surface}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: C.text, flex: 1 }}>{mod.titulo}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: C.muted }}>{mod.aulasConcluidas}/{mod.totalAulas}</span>
                      <div style={{ width: '100px', background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '5px' }}>
                        <div style={{ background: mod.progresso === 100 ? '#10b981' : C.blue, height: '5px', borderRadius: '4px', width: `${mod.progresso}%` }} />
                      </div>
                      <span style={{ fontSize: '12px', color: C.muted, minWidth: '28px' }}>{mod.progresso}%</span>
                      {mod.aberto ? <ChevronUp size={16} color={C.blue} /> : <ChevronDown size={16} color={C.blue} />}
                    </div>
                  </div>

                  {/* Aulas do módulo */}
                  {mod.aberto && (
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                      {/* Botão PDF */}
                      <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: C.text }}>Conteúdo disponível em PDF</span>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1.5px solid ${C.blue}`, borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: C.blue, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                          <Download size={13} /> Baixar PDF
                        </button>
                      </div>

                      {/* Lista de aulas */}
                      {mod.aulas.map((aula, idx) => {
                        const st = corStatus(aula.status)
                        return (
                          <div
                            key={aula.id}
                            style={{
                              padding: '14px 20px',
                              display: 'flex', alignItems: 'center', gap: '16px',
                              borderBottom: idx < mod.aulas.length - 1 ? `1px solid ${C.border}` : 'none',
                              cursor: 'pointer', transition: 'background 150ms',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = `rgba(26,86,255,0.04)`}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {/* Ícone de status */}
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: st.bg, border: `1.5px solid ${st.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {aula.status === 'Concluída'
                                ? <Check size={12} color="#10b981" />
                                : aula.status === 'Em andamento'
                                ? <Play size={10} color={C.blue} style={{ marginLeft: '1px' }} />
                                : <span style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>{aula.numero}</span>
                              }
                            </div>

                            {/* Info da aula */}
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>
                                Aula {aula.numero}
                              </p>
                              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{aula.titulo}</p>
                            </div>

                            {/* Status + progresso + botão */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                              <span style={{ fontSize: '11px', fontWeight: 600, color: st.color }}>{aula.status}</span>
                              <div style={{ width: '80px', background: 'rgba(26,86,255,0.10)', borderRadius: '3px', height: '4px' }}>
                                <div style={{ background: aula.status === 'Concluída' ? '#10b981' : C.blue, height: '4px', borderRadius: '3px', width: `${aula.progresso}%` }} />
                              </div>
                              <span style={{ fontSize: '11px', color: C.muted, minWidth: '28px' }}>{aula.progresso}%</span>
                              <span
                                onClick={e => { e.stopPropagation(); onAbrirAula(curso.id, mod.id, aula.id) }}
                                style={{ fontSize: '13px', fontWeight: 600, color: C.blue, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                              >
                                Acessar aula <ChevronRight size={14} />
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── GRAVAÇÕES DE LIVES ── */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 500, color: C.text, flex: 1 }}>
                Gravações de Lives
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            {/* ── PROVA ONLINE ── */}
            <div
              style={{
                background: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '16px 20px',
                marginTop: '8px',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                opacity: 0.75,
                cursor: 'not-allowed',
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: '0 0 3px' }}>
                  Prova online
                </p>
                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>
                  Você está fora do período de realização, entre 23/05/2026 e 30/05/2026.
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
