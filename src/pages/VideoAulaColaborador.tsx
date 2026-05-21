import { useState, useRef } from 'react'
import {
  Play, Pause, SkipForward, Volume2, VolumeX,
  Maximize, Settings, ChevronRight,
  ChevronUp, Check, Download, FileText,
  Clock,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { cursosMockColaborador } from '../data/cursosMock'
import modeloTreinamento from '../assets/modelo-treinamento.png'
import logoEdeconsil from '../assets/logo-edeconsil.png'

interface VideoAulaColaboradorProps {
  cursoId: string
  moduloId: number
  aulaId: number
  onNavigate: (page: string) => void
  onLogout: () => void
  onVoltarLista: () => void
  onVoltarDetalhe: (cursoId: string) => void
  onTrocarAula: (cursoId: string, moduloId: number, aulaId: number) => void
}

export function VideoAulaColaborador({
  cursoId, moduloId, aulaId,
  onNavigate, onLogout,
  onVoltarLista, onVoltarDetalhe, onTrocarAula
}: VideoAulaColaboradorProps) {
  const { C } = useTheme()
  const curso = cursosMockColaborador.find(c => c.id === cursoId) ?? cursosMockColaborador[0]
  const moduloAtivo = curso.modulos.find(m => m.id === moduloId) ?? curso.modulos[0]
  const aulaAtiva = moduloAtivo.aulas.find(a => a.id === aulaId) ?? moduloAtivo.aulas[0]

  const videoRef = useRef<HTMLVideoElement>(null)
  const [tocando, setTocando] = useState(false)
  const [progresso] = useState(0)
  const [tempoTotal] = useState('32:16')
  const [velocidade, setVelocidade] = useState(1.25)
  const [menuVelocidade, setMenuVelocidade] = useState(false)
  const [mutado, setMutado] = useState(false)
  const [modulosAbertos, setModulosAbertos] = useState([moduloId])
  const [abaAtiva, setAbaAtiva] = useState<'sobre' | 'materiais' | 'anotacoes' | 'perguntas'>('sobre')
  const [aulasConcluidas, setAulasConcluidas] = useState<number[]>([])

  const togglePlay = () => {
    if (!videoRef.current) { setTocando(!tocando); return }
    if (tocando) videoRef.current.pause()
    else videoRef.current.play()
    setTocando(!tocando)
  }

  const toggleModulo = (id: number) => {
    setModulosAbertos(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  const marcarConcluida = () => {
    if (!aulasConcluidas.includes(aulaAtiva.id)) {
      setAulasConcluidas(prev => [...prev, aulaAtiva.id])
    }
  }

  const concluida = aulasConcluidas.includes(aulaAtiva.id) || aulaAtiva.status === 'Concluída'
  const totalConcluidas = aulasConcluidas.length + curso.aulasConcluidas
  const progressoGeral = Math.round((totalConcluidas / curso.totalAulas) * 100)

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar paginaAtiva="meusCursos" onNavigate={onNavigate} onLogout={onLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          navItems={[
            { label: 'Meus Cursos',  ativo: true,  onClick: onVoltarLista },
            { label: 'Certificados', ativo: false, onClick: () => onNavigate('certificadosColaborador') },
            { label: 'Biblioteca',   ativo: false, onClick: () => onNavigate('apostilas') },
            { label: 'Trilhas',      ativo: false, onClick: () => onNavigate('trilha') },
          ]}
          userName="João Silva" userRole="Aluno" userInitials="JS" notificacoes={3}
        />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── ÁREA CENTRAL ── */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Breadcrumb */}
            <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
              <span onClick={onVoltarLista} style={{ fontSize: '12px', color: C.blue, cursor: 'pointer' }}>Meus Cursos</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span onClick={() => onVoltarDetalhe(cursoId)} style={{ fontSize: '12px', color: C.blue, cursor: 'pointer' }}>{curso.titulo}</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span style={{ fontSize: '12px', color: C.muted }}>{moduloAtivo.titulo.split(' - ')[0]}</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>Aula {aulaAtiva.numero}</span>
              <button
                onClick={marcarConcluida}
                style={{
                  marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: concluida ? 'rgba(16,185,129,0.12)' : 'transparent',
                  border: `1.5px solid ${concluida ? '#10b981' : C.border}`,
                  borderRadius: '8px', padding: '7px 14px',
                  fontSize: '12px', fontWeight: 600,
                  color: concluida ? '#10b981' : C.text,
                  cursor: 'pointer', transition: 'all 150ms', fontFamily: "'Inter',sans-serif",
                }}
              >
                <Check size={13} />
                {concluida ? 'Concluída' : 'Marcar como concluída'}
              </button>
            </div>

            {/* Título + badges */}
            <div style={{ padding: '14px 20px 8px', flexShrink: 0 }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                {aulaAtiva.titulo}
              </h1>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.12)', border: `1px solid rgba(26,86,255,0.25)`, borderRadius: '6px', padding: '3px 10px' }}>
                  {moduloAtivo.titulo.split(' - ')[0]}
                </span>
                <span style={{ fontSize: '12px', color: C.muted }}>{moduloAtivo.titulo.split(' - ')[1]}</span>
                <span style={{ fontSize: '12px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {aulaAtiva.duracao}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600,
                  color: aulaAtiva.status === 'Concluída' ? '#10b981' : aulaAtiva.status === 'Em andamento' ? C.blue : C.muted,
                  background: aulaAtiva.status === 'Concluída' ? 'rgba(16,185,129,0.12)' : aulaAtiva.status === 'Em andamento' ? 'rgba(26,86,255,0.10)' : C.surface2,
                  border: `0.5px solid ${aulaAtiva.status === 'Concluída' ? 'rgba(16,185,129,0.25)' : aulaAtiva.status === 'Em andamento' ? 'rgba(26,86,255,0.25)' : C.border}`,
                  borderRadius: '6px', padding: '2px 8px',
                }}>
                  {aulaAtiva.status}
                </span>
              </div>
            </div>

            {/* Player */}
            <div style={{ padding: '0 20px', flexShrink: 0 }}>
              <div style={{
                background: `url(${modeloTreinamento}) center center / cover no-repeat`,
                borderRadius: '12px', overflow: 'hidden',
                border: `1px solid ${C.border}`,
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '16/7',
              }}>
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,13,26,0.88) 0%, rgba(5,13,26,0.45) 60%, rgba(5,13,26,0.20) 100%)', zIndex: 0 }} />

                {/* Conteúdo sobre o overlay */}
                <div style={{ position: 'relative', zIndex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%', width: '100%' }}>
                  <img src={logoEdeconsil} alt="Edeconsil" style={{ height: '24px', objectFit: 'contain', marginBottom: '14px', opacity: 0.85 }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px', maxWidth: '360px', lineHeight: 1.3 }}>
                    {aulaAtiva.titulo}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: 0 }}>
                    {moduloAtivo.titulo.split(' - ')[1] ?? moduloAtivo.titulo}
                  </p>
                </div>

                {/* Botão Play central */}
                <button
                  onClick={togglePlay}
                  style={{ position: 'relative', zIndex: 2, width: '56px', height: '56px', borderRadius: '50%', background: C.blue, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 14px rgba(26,86,255,0.18)`, transition: 'all 200ms' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {tocando ? <Pause size={22} color="#fff" /> : <Play size={22} color="#fff" style={{ marginLeft: '2px' }} />}
                </button>

                {/* Barra de controles */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'linear-gradient(to top, rgba(5,13,26,0.95), transparent)', zIndex: 2 }}>
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '4px', height: '4px', marginBottom: '10px', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ background: C.blue, height: '4px', borderRadius: '4px', width: `${progresso}%` }} />
                    <div style={{ position: 'absolute', top: '50%', left: `${progresso}%`, transform: 'translate(-50%,-50%)', width: '12px', height: '12px', background: '#fff', borderRadius: '50%' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={togglePlay} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                      {tocando ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}><SkipForward size={16} /></button>
                    <button onClick={() => setMutado(!mutado)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                      {mutado ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>12:47 / {tempoTotal}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                      <button onClick={() => setMenuVelocidade(!menuVelocidade)} style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
                        {velocidade}x
                      </button>
                      {menuVelocidade && (
                        <div style={{ position: 'absolute', bottom: '100%', right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden', marginBottom: '4px' }}>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(v => (
                            <button key={v} onClick={() => { setVelocidade(v); setMenuVelocidade(false) }}
                              style={{ display: 'block', width: '100%', padding: '7px 16px', background: velocidade === v ? `rgba(26,86,255,0.12)` : 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: velocidade === v ? C.blue : C.text, fontWeight: velocidade === v ? 700 : 400, textAlign: 'left', fontFamily: "'Inter',sans-serif" }}>
                              {v}x
                            </button>
                          ))}
                        </div>
                      )}
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}><Settings size={15} /></button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}><Maximize size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Abas */}
            <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: '16px' }}>
                {[
                  { key: 'sobre',     label: 'Sobre a Aula'  },
                  { key: 'materiais', label: 'Materiais'      },
                  { key: 'anotacoes', label: 'Anotações'      },
                  { key: 'perguntas', label: 'Perguntas (12)' },
                ].map(aba => (
                  <button key={aba.key} onClick={() => setAbaAtiva(aba.key as typeof abaAtiva)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: '13px', fontWeight: abaAtiva === aba.key ? 600 : 400, color: abaAtiva === aba.key ? C.text : C.muted, borderBottom: abaAtiva === aba.key ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px', fontFamily: "'Inter',sans-serif" }}>
                    {aba.label}
                  </button>
                ))}
              </div>

              {abaAtiva === 'sobre' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', paddingBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.7, margin: '0 0 14px' }}>
                      {aulaAtiva.descricao}
                    </p>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '10px' }}>O que você vai aprender:</div>
                    {['Conceitos fundamentais e aplicação prática', 'Normas e regulamentos vigentes', 'Exercícios guiados e exemplos reais', 'Procedimentos de segurança obrigatórios'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <Check size={13} color="#10b981" />
                        <span style={{ fontSize: '13px', color: C.muted }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* Materiais da Aula */}
                  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Materiais da Aula</span>
                      <Download size={14} color={C.muted} style={{ cursor: 'pointer' }} />
                    </div>
                    {aulaAtiva.materiais.length > 0 ? aulaAtiva.materiais.map((mat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: C.surface, borderRadius: '8px', cursor: 'pointer', marginBottom: '6px' }}
                        onMouseEnter={e => e.currentTarget.style.background = `rgba(26,86,255,0.06)`}
                        onMouseLeave={e => e.currentTarget.style.background = C.surface}
                      >
                        <FileText size={13} color={C.blue} />
                        <span style={{ flex: 1, fontSize: '12px', color: C.text }}>{mat.nome}</span>
                        <span style={{ fontSize: '11px', color: C.muted }}>{mat.tamanho}</span>
                      </div>
                    )) : (
                      <>
                        {[
                          { nome: `Apostila - ${curso.titulo}.pdf`, tam: '2.4 MB' },
                          { nome: 'Exemplo de Projeto.dwg',          tam: '6.8 MB' },
                          { nome: 'Tabela de Volumes.xlsx',           tam: '1.1 MB' },
                          { nome: 'Lista de Verificação.pdf',         tam: '890 KB' },
                        ].map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: C.surface, borderRadius: '8px', cursor: 'pointer', marginBottom: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = `rgba(26,86,255,0.06)`}
                            onMouseLeave={e => e.currentTarget.style.background = C.surface}
                          >
                            <FileText size={13} color={C.blue} />
                            <span style={{ flex: 1, fontSize: '12px', color: C.text }}>{m.nome}</span>
                            <span style={{ fontSize: '11px', color: C.muted }}>{m.tam}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {abaAtiva !== 'sobre' && (
                <div style={{ padding: '20px', background: C.surface2, borderRadius: '10px', border: `1px dashed ${C.border}`, textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                    {abaAtiva === 'materiais' ? 'Nenhum material adicional para esta aula.' :
                     abaAtiva === 'anotacoes' ? 'Suas anotações aparecerão aqui.' :
                     'As perguntas desta aula aparecerão aqui.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── PAINEL DIREITO ── */}
          <div style={{ width: '300px', flexShrink: 0, background: C.surface, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Progresso */}
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Progresso do Curso</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: C.blue }}>{progressoGeral}%</span>
              </div>
              <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '5px', marginBottom: '4px' }}>
                <div style={{ background: C.blue, height: '5px', borderRadius: '4px', width: `${progressoGeral}%`, transition: 'width 500ms' }} />
              </div>
              <div style={{ fontSize: '11px', color: C.muted }}>{totalConcluidas} de {curso.totalAulas} aulas concluídas</div>
            </div>

            {/* Abas do painel */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
              {['Conteúdo', 'Aula Anterior'].map((tab, i) => (
                <button key={tab} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '11px 8px', fontSize: '12px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.blue : C.muted, borderBottom: i === 0 ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px', fontFamily: "'Inter',sans-serif" }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Lista de módulos */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {curso.modulos.map(mod => (
                <div key={mod.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div
                    onClick={() => toggleModulo(mod.id)}
                    style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1, marginRight: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{mod.titulo}</div>
                      <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{mod.aulasConcluidas}/{mod.totalAulas}</div>
                    </div>
                    {modulosAbertos.includes(mod.id) ? <ChevronUp size={14} color={C.muted} /> : <ChevronRight size={14} color={C.muted} />}
                  </div>

                  {modulosAbertos.includes(mod.id) && mod.aulas.map(aula => {
                    const isAtiva = aula.id === aulaAtiva.id && mod.id === moduloAtivo.id
                    const isConcluida = aulasConcluidas.includes(aula.id) || aula.status === 'Concluída'
                    return (
                      <div
                        key={aula.id}
                        onClick={() => onTrocarAula(cursoId, mod.id, aula.id)}
                        style={{
                          padding: '9px 16px 9px 28px',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          background: isAtiva ? 'rgba(26,86,255,0.10)' : 'transparent',
                          borderLeft: isAtiva ? `3px solid ${C.blue}` : '3px solid transparent',
                          cursor: 'pointer', transition: 'background 150ms',
                        }}
                        onMouseEnter={e => { if (!isAtiva) e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
                        onMouseLeave={e => { if (!isAtiva) e.currentTarget.style.background = 'transparent' }}
                      >
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: isConcluida ? '#10b981' : isAtiva ? C.blue : 'transparent', border: `1.5px solid ${isConcluida ? '#10b981' : isAtiva ? C.blue : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isConcluida
                            ? <Check size={10} color="#fff" />
                            : isAtiva
                            ? <Play size={8} color="#fff" style={{ marginLeft: '1px' }} />
                            : <span style={{ fontSize: '9px', color: C.muted, fontWeight: 600 }}>{String(aula.numero).padStart(2, '0')}</span>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: isAtiva ? 600 : 400, color: isAtiva ? C.text : C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {aula.titulo}
                          </div>
                          <div style={{ fontSize: '10px', color: C.muted }}>{aula.duracao}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Motivação */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, background: 'rgba(245,158,11,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🏆</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b' }}>Continue assim!</div>
                  <div style={{ fontSize: '10px', color: C.muted, lineHeight: 1.5, marginTop: '2px' }}>
                    Você está se dedicando e evoluindo muito. Foco no objetivo!
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
