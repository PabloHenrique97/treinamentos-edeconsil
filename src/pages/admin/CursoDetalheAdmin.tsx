import { useState } from 'react'
import {
  ChevronDown, ChevronUp, ChevronRight,
  Calendar, BookOpen, FileText,
  MessageSquare, Lock, Play, Download,
  SkipForward, Volume2, Settings, Maximize,
  Pause, Check, Clock, ArrowLeft
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import modeloTreinamento from '../../assets/modelo-treinamento.png'
import logoEdeconsil from '../../assets/logo-edeconsil.png'

const cursoDetalhe = {
  id: 1,
  titulo: 'NR-35 — Trabalho em Altura',
  status: 'Em breve',
  live: {
    data: 'Sexta-feira, 22 de Maio',
    hora: '20:00 BRT',
    titulo: 'Live de Revisão - NR-35 TRABALHO EM ALTURA',
  },
  calendario: {
    periodo: '27/04 a 24/05',
  },
  progresso: 0,
  pontuacao: 0,
  pontuacaoMax: 100,
  modulos: [
    {
      id: 1,
      titulo: 'UNIDADE 1 - Fundamentos de Trabalho em Altura',
      progresso: 0,
      aberto: false,
      aulas: [
        { id: 1,  num: 1, titulo: 'Introdução ao trabalho em altura',    status: 'Incompleta', progresso: 0 },
        { id: 2,  num: 2, titulo: 'Legislação e normas aplicáveis',      status: 'Incompleta', progresso: 0 },
        { id: 3,  num: 3, titulo: 'Equipamentos de proteção individual', status: 'Incompleta', progresso: 0 },
        { id: 4,  num: 4, titulo: 'Pontos de ancoragem',                 status: 'Incompleta', progresso: 0 },
        { id: 5,  num: 5, titulo: 'Sistemas de proteção coletiva',       status: 'Incompleta', progresso: 0 },
      ],
    },
    {
      id: 2,
      titulo: 'UNIDADE 2 - Equipamentos e Proteções',
      progresso: 0,
      aberto: false,
      aulas: [
        { id: 6,  num: 1, titulo: 'Cinturões e talabartes',            status: 'Incompleta', progresso: 0 },
        { id: 7,  num: 2, titulo: 'Capacetes e protetores',            status: 'Incompleta', progresso: 0 },
        { id: 8,  num: 3, titulo: 'Redes e plataformas de proteção',   status: 'Incompleta', progresso: 0 },
        { id: 9,  num: 4, titulo: 'Inspeção de equipamentos',          status: 'Incompleta', progresso: 0 },
      ],
    },
    {
      id: 3,
      titulo: 'UNIDADE 3 - Procedimentos Operacionais',
      progresso: 0,
      aberto: false,
      aulas: [
        { id: 10, num: 1, titulo: 'Análise de risco',      status: 'Incompleta', progresso: 0 },
        { id: 11, num: 2, titulo: 'Permissão de trabalho', status: 'Incompleta', progresso: 0 },
        { id: 12, num: 3, titulo: 'Resgate em altura',     status: 'Incompleta', progresso: 0 },
      ],
    },
    {
      id: 4,
      titulo: 'UNIDADE 4 - Casos Práticos e Avaliação',
      progresso: 0,
      aberto: false,
      aulas: [
        { id: 13, num: 1, titulo: 'Estudos de caso reais',  status: 'Incompleta', progresso: 0 },
        { id: 14, num: 2, titulo: 'Exercícios práticos',    status: 'Incompleta', progresso: 0 },
        { id: 15, num: 3, titulo: 'Simulado final',         status: 'Incompleta', progresso: 0 },
      ],
    },
  ],
}

type Tela = 'visaoGeral' | 'videoAula'

interface AulaItem {
  id: number
  num: number
  titulo: string
  status: string
  progresso: number
}

interface ModuloItem {
  id: number
  titulo: string
  progresso: number
  aberto: boolean
  aulas: AulaItem[]
}

interface CursoDetalheAdminProps {
  onNavigate: (page: string) => void
  onLogout: () => void
  onVoltar: () => void
}

export function CursoDetalheAdmin({ onNavigate, onLogout, onVoltar }: CursoDetalheAdminProps) {
  const { C } = useTheme()
  const [tela, setTela] = useState<Tela>('visaoGeral')
  const [modulos, setModulos] = useState<ModuloItem[]>(cursoDetalhe.modulos)
  const [aulaAtiva, setAulaAtiva] = useState<AulaItem | null>(null)
  const [moduloAulaAtiva, setModuloAulaAtiva] = useState<ModuloItem | null>(null)
  const [tocando, setTocando] = useState(false)

  const toggleModulo = (id: number) => {
    setModulos(prev => prev.map(m =>
      m.id === id ? { ...m, aberto: !m.aberto } : m
    ))
  }

  const abrirAula = (modulo: ModuloItem, aula: AulaItem) => {
    setAulaAtiva(aula)
    setModuloAulaAtiva(modulo)
    setTela('videoAula')
  }

  // ── TELA DE VÍDEO AULA ──
  if (tela === 'videoAula' && aulaAtiva && moduloAulaAtiva) {
    return (
      <LayoutAdmin
        paginaAtiva="cursosAdmin"
        onNavigate={onNavigate}
        onLogout={onLogout}
        topbarTitulo="Gestão de Cursos"
        topbarSubtitulo="Visualizando aula do curso."
      >
        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

          {/* Área central — player */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {/* Breadcrumb */}
            <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
              <span onClick={() => setTela('visaoGeral')} style={{ fontSize: '12px', color: C.blue, cursor: 'pointer' }}>Cursos</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span onClick={() => setTela('visaoGeral')} style={{ fontSize: '12px', color: C.blue, cursor: 'pointer' }}>{cursoDetalhe.titulo}</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span style={{ fontSize: '12px', color: C.muted }}>{moduloAulaAtiva.titulo.split(' - ')[0]}</span>
              <span style={{ fontSize: '12px', color: C.muted }}>›</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>Aula {aulaAtiva.num}</span>
            </div>

            {/* Título + botão */}
            <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexShrink: 0 }}>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                  {aulaAtiva.titulo}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.15)', border: '1px solid rgba(26,86,255,0.3)', borderRadius: '6px', padding: '3px 10px' }}>
                    {moduloAulaAtiva.titulo.split(' - ')[0]}
                  </span>
                  <span style={{ fontSize: '12px', color: C.muted }}>{moduloAulaAtiva.titulo.split(' - ')[1]}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.muted }}>
                    <Clock size={12} /> 32 min
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '6px', padding: '3px 10px' }}>
                    {aulaAtiva.status}
                  </span>
                </div>
              </div>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: `1.5px solid ${C.blue}`,
                  borderRadius: '8px', padding: '9px 16px',
                  fontSize: '13px', fontWeight: 600, color: C.blue,
                  cursor: 'pointer', flexShrink: 0, transition: 'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.blue }}
              >
                <Check size={14} /> Marcar como concluída
              </button>
            </div>

            {/* Player */}
            <div style={{ padding: '0 20px', flexShrink: 0 }}>
              <div style={{
                background: `url(${modeloTreinamento}) center center / cover no-repeat`,
                borderRadius: '12px', overflow: 'hidden',
                border: `1px solid ${C.border}`,
                aspectRatio: '16/7', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,13,26,0.85) 0%, rgba(5,13,26,0.40) 60%, rgba(5,13,26,0.15) 100%)', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%', width: '100%' }}>
                  <img src={logoEdeconsil} alt="" style={{ height: '24px', objectFit: 'contain', marginBottom: '14px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px', maxWidth: '340px', lineHeight: 1.3 }}>
                    {aulaAtiva.titulo}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: 0, maxWidth: '300px' }}>
                    {cursoDetalhe.titulo}
                  </p>
                </div>
                <button
                  onClick={() => setTocando(!tocando)}
                  style={{ position: 'relative', zIndex: 2, width: '52px', height: '52px', borderRadius: '50%', background: C.blue, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 12px rgba(26,86,255,0.15)', transition: 'all 200ms' }}
                >
                  {tocando ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" style={{ marginLeft: '2px' }} />}
                </button>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px', background: 'linear-gradient(to top, rgba(5,13,26,0.95), transparent)', zIndex: 2 }}>
                  <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '4px', height: '4px', marginBottom: '10px', cursor: 'pointer', position: 'relative' }}>
                    <div style={{ background: C.blue, height: '4px', borderRadius: '4px', width: '39%' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '39%', transform: 'translate(-50%,-50%)', width: '12px', height: '12px', background: '#fff', borderRadius: '50%' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setTocando(!tocando)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                      {tocando ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}><SkipForward size={16} /></button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}><Volume2 size={16} /></button>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginLeft: '4px' }}>0:00 / 32:16</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}>1.25x</span>
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
                {['Sobre a Aula', 'Materiais', 'Anotações', 'Perguntas (12)'].map((aba, i) => (
                  <button key={aba} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: '13px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.text : C.muted, borderBottom: i === 0 ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px' }}>
                    {aba}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', paddingBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: C.muted2, lineHeight: 1.7, margin: '0 0 14px' }}>
                    Nesta aula você vai aprender os conceitos fundamentais relacionados ao tema, com aplicação prática no ambiente de obras da construção civil.
                  </p>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '10px' }}>O que você vai aprender:</div>
                  {['Conceitos fundamentais', 'Aplicação prática', 'Normas e regulamentos', 'Exercícios guiados'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Check size={13} color={C.green} />
                      <span style={{ fontSize: '13px', color: C.muted2 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Materiais da Aula</span>
                    <Download size={14} color={C.muted} style={{ cursor: 'pointer' }} />
                  </div>
                  {['Apostila - NR35.pdf · 2.4 MB', 'Checklist de segurança.pdf · 890 KB', 'Planilha de risco.xlsx · 1.1 MB'].map(m => {
                    const [nome, tam] = m.split(' · ')
                    return (
                      <div
                        key={m}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: C.surface, borderRadius: '8px', cursor: 'pointer', marginBottom: '6px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = C.surface}
                      >
                        <FileText size={13} color={C.blue} />
                        <span style={{ flex: 1, fontSize: '12px', color: C.text }}>{nome}</span>
                        <span style={{ fontSize: '11px', color: C.muted }}>{tam}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Painel direito — módulos */}
          <div style={{ width: '300px', flexShrink: 0, background: C.surface, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Progresso do Curso</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: C.blue }}>{cursoDetalhe.progresso}%</span>
              </div>
              <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '5px', marginBottom: '5px' }}>
                <div style={{ background: C.blue, height: '5px', borderRadius: '4px', width: `${cursoDetalhe.progresso}%` }} />
              </div>
              <div style={{ fontSize: '11px', color: C.muted }}>0 de 15 aulas concluídas</div>
            </div>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
              {['Conteúdo', 'Aula Anterior'].map((tab, i) => (
                <button key={tab} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '11px 8px', fontSize: '12px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.blue : C.muted, borderBottom: i === 0 ? `2px solid ${C.blue}` : '2px solid transparent', marginBottom: '-1px' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {modulos.map(mod => (
                <div key={mod.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div
                    onClick={() => toggleModulo(mod.id)}
                    style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1, marginRight: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{mod.titulo}</div>
                      <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{mod.aulas.filter(a => a.status === 'Concluída').length}/{mod.aulas.length}</div>
                    </div>
                    {mod.aberto ? <ChevronUp size={14} color={C.muted} /> : <ChevronRight size={14} color={C.muted} />}
                  </div>
                  {mod.aberto && mod.aulas.map(aula => (
                    <div
                      key={aula.id}
                      onClick={() => abrirAula(mod, aula)}
                      style={{
                        padding: '9px 16px 9px 28px', display: 'flex', alignItems: 'center', gap: '10px',
                        background: aulaAtiva?.id === aula.id ? 'rgba(26,86,255,0.10)' : 'transparent',
                        borderLeft: aulaAtiva?.id === aula.id ? `3px solid ${C.blue}` : '3px solid transparent',
                        cursor: 'pointer', transition: 'background 150ms',
                      }}
                      onMouseEnter={e => { if (aulaAtiva?.id !== aula.id) e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
                      onMouseLeave={e => { if (aulaAtiva?.id !== aula.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, background: aulaAtiva?.id === aula.id ? C.blue : 'rgba(255,255,255,0.08)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {aulaAtiva?.id === aula.id
                          ? <Play size={9} color="#fff" style={{ marginLeft: '1px' }} />
                          : <span style={{ fontSize: '9px', color: C.muted, fontWeight: 600 }}>{String(aula.num).padStart(2, '0')}</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: aulaAtiva?.id === aula.id ? 600 : 400, color: aulaAtiva?.id === aula.id ? C.text : C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {aula.titulo}
                        </div>
                        <div style={{ fontSize: '10px', color: C.muted }}>32 min</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, background: 'rgba(26,86,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '14px' }}>🏆</span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: C.amber }}>Continue assim!</div>
                  <div style={{ fontSize: '10px', color: C.muted, lineHeight: 1.5, marginTop: '2px' }}>
                    Você está dedicando e evoluindo muito. Foco no objetivo!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    )
  }

  // ── TELA PRINCIPAL — VISÃO GERAL DO CURSO ──
  return (
    <LayoutAdmin
      paginaAtiva="cursosAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Gestão de Cursos"
      topbarSubtitulo="Detalhes e conteúdo do curso selecionado."
    >
      <div style={{ overflowY: 'auto', maxHeight: '100%' }}>

        {/* Breadcrumb */}
        <div style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${C.border}`, background: C.surface, flexShrink: 0 }}>
          <ArrowLeft size={14} color={C.blue} style={{ cursor: 'pointer' }} onClick={onVoltar} />
          <span onClick={onVoltar} style={{ fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Cursos</span>
          <span style={{ fontSize: '13px', color: C.muted }}>›</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{cursoDetalhe.titulo}</span>
        </div>

        <div style={{ padding: '32px', maxWidth: '860px', margin: '0 auto' }}>

          {/* Título */}
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: C.text, margin: '0 0 28px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            {cursoDetalhe.titulo}
          </h1>

          {/* Card live */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: '#fff', background: C.blue, borderRadius: '4px', padding: '2px 8px', fontWeight: 700 }}>
                {cursoDetalhe.status}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} color={C.muted} />
                <span style={{ fontSize: '13px', color: C.text }}>{cursoDetalhe.live.data}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color={C.muted} />
                <span style={{ fontSize: '13px', color: C.text }}>{cursoDetalhe.live.hora}</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{cursoDetalhe.live.titulo}</p>
          </div>

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
              <span style={{ fontSize: '13px', color: C.muted }}>Período de estudo: {cursoDetalhe.calendario.periodo}</span>
              <ChevronRight size={16} color={C.blue} />
            </div>
          </div>

          {/* Progresso em aula */}
          <div
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '8px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              <span style={{ color: C.blue, fontWeight: 700 }}>{cursoDetalhe.progresso}%</span>
              <span style={{ color: C.text }}> Progresso em aula</span>
            </span>
          </div>

          {/* Apresentação da disciplina */}
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
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{cursoDetalhe.pontuacao} pontos de {cursoDetalhe.pontuacaoMax}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, color: C.text, flex: 1 }}>
                    {mod.titulo}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '120px', background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '5px' }}>
                      <div style={{ background: C.blue, height: '5px', borderRadius: '4px', width: `${mod.progresso}%` }} />
                    </div>
                    <span style={{ fontSize: '12px', color: C.muted, minWidth: '28px' }}>{mod.progresso}%</span>
                    {mod.aberto
                      ? <ChevronUp size={16} color={C.blue} />
                      : <ChevronDown size={16} color={C.blue} />
                    }
                  </div>
                </div>

                {/* Aulas do módulo */}
                {mod.aberto && (
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>

                    {/* Botão baixar PDF */}
                    <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: C.text }}>Conteúdo disponível em PDF</span>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1.5px solid ${C.blue}`, borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: C.blue, cursor: 'pointer' }}>
                        <Download size={13} /> Baixar PDF
                      </button>
                    </div>

                    {/* Lista de aulas */}
                    {mod.aulas.map((aula, idx) => (
                      <div
                        key={aula.id}
                        style={{
                          padding: '14px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          borderBottom: idx < mod.aulas.length - 1 ? `1px solid ${C.border}` : 'none',
                          cursor: 'pointer',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={() => abrirAula(mod, aula)}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '2px' }}>
                            Aula {aula.num}
                          </div>
                          <div style={{ fontSize: '12px', color: C.muted }}>{aula.titulo}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                          <span style={{ fontSize: '12px', color: C.muted }}>{aula.status}</span>
                          <div style={{ width: '100px', background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '4px' }}>
                            <div style={{ background: C.blue, height: '4px', borderRadius: '4px', width: `${aula.progresso}%` }} />
                          </div>
                          <span style={{ fontSize: '12px', color: C.muted, minWidth: '28px' }}>{aula.progresso}%</span>
                          <span
                            onClick={e => { e.stopPropagation(); abrirAula(mod, aula) }}
                            style={{ fontSize: '13px', fontWeight: 600, color: C.blue, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                          >
                            Acessar aula <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gravações de Lives */}
          <div
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Play size={16} color="#fff" style={{ marginLeft: '2px' }} />
            </div>
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: C.text }}>Gravações de Lives</span>
            <ChevronRight size={16} color={C.blue} />
          </div>

          {/* Prova online */}
          <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', opacity: 0.7 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={16} color={C.muted} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '3px' }}>Prova online</div>
              <div style={{ fontSize: '12px', color: C.muted }}>Você está fora do período de realização, entre 23/05/2026 e 30/05/2026.</div>
            </div>
            <Lock size={18} color={C.muted} style={{ marginLeft: 'auto', flexShrink: 0 }} />
          </div>

        </div>
      </div>
    </LayoutAdmin>
  )
}
