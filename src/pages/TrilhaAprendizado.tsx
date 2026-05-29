import { useState } from 'react'
import {
  ChevronRight,
  Calendar, Trophy,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { MobileMenu } from '../components/MobileMenu'
import { Topbar } from '../components/Topbar'
import { useTheme } from '../contexts/ThemeContext'
import { useResponsive } from '../hooks/useResponsive'
import { useUsuarioLogado } from '../hooks/useUsuarioLogado'
import { useDadosReaisAluno } from '../hooks/useDadosReaisAluno'
import { getUsuario } from '../services/authStorage'

const abasStatus = ['Aprovadas', 'Reprovadas', 'Futuras']

interface TrilhaAprendizadoProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function TrilhaAprendizado({ onNavigate, onLogout }: TrilhaAprendizadoProps) {
  const { C } = useTheme()
  const { isMobile, isTablet } = useResponsive()
  const isSmall = isMobile || isTablet
  const { nome, iniciais, perfil: perfilUsuario } = useUsuarioLogado()
  const roleDisplay = perfilUsuario === 'admin' ? 'Administrador' : 'Colaborador'
  const [abaAtiva, setAbaAtiva] = useState('Aprovadas')
  const [telaRotina, setTelaRotina] = useState(false)
  const [modalRotina, setModalRotina] = useState(false)
  const [diasSemana, setDiasSemana] = useState(5)
  const [rotinaSalva, setRotinaSalva] = useState(false)
  const dados = useDadosReaisAluno()
  const usuarioLogado = getUsuario<{ setor?: string | null }>()
  const cursosAndamento = dados.cursos.filter(c =>
    (c.progresso_usuario ?? 0) < 100 && c.aprovado !== true
  )
  const cursosAprovadas = dados.cursos.filter(c => {
    const nota = c.nota_obtida ?? null
    const notaMin = c.nota_minima ?? 70
    return ((c.progresso_usuario ?? 0) >= 100) || (nota !== null && nota >= notaMin)
  })
  const cursosReprovadas = dados.cursos.filter(c => {
    const nota = c.nota_obtida ?? null
    const notaMin = c.nota_minima ?? 70
    return nota !== null && nota < notaMin
  })
  const cursosFuturas = dados.cursos.filter(c =>
    (c.progresso_usuario ?? 0) === 0 && (c.nota_obtida ?? null) === null
  )

  function ModalDefinirRotina({
    dias,
    onChangeDias,
    onSalvar,
    onFechar,
    C,
  }: {
    dias: number
    onChangeDias: (d: number) => void
    onSalvar: () => void
    onFechar: () => void
    C: Record<string, string>
  }) {
    return (
      <div
        onClick={onFechar}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: C.surface,
            borderRadius: '16px',
            width: '100%',
            maxWidth: '380px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            border: `1px solid ${C.border}`,
          }}
        >
          {/* Header modal */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: C.text,
              margin: 0,
            }}>
              Definir rotina de estudos
            </h2>
            <button
              onClick={onFechar}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: C.muted,
                fontSize: '20px',
                lineHeight: 1,
                padding: '2px 6px',
                borderRadius: '6px',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${C.border}`}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              ×
            </button>
          </div>

          {/* Corpo */}
          <div style={{ padding: '24px' }}>
            <p style={{
              fontSize: '14px',
              color: C.text,
              margin: '0 0 20px',
              fontWeight: 500,
            }}>
              Quantos dias na semana você pretende estudar?
            </p>

            {/* Contador de dias */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <button
                onClick={() => onChangeDias(Math.max(1, dias - 1))}
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '10px',
                  border: `1.5px solid ${C.border}`,
                  background: C.surface2,
                  color: C.text,
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 300,
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                −
              </button>

              <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                color: C.text,
              }}>
                {dias} dia{dias !== 1 ? 's' : ''} na semana
              </div>

              <button
                onClick={() => onChangeDias(Math.min(7, dias + 1))}
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '10px',
                  border: `1.5px solid ${C.border}`,
                  background: C.surface2,
                  color: C.text,
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 300,
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                +
              </button>
            </div>

            {/* Caixa de info */}
            <div style={{
              background: `rgba(26,86,255,0.08)`,
              border: `1px solid rgba(26,86,255,0.20)`,
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
            }}>
              <div style={{ flexShrink: 0, marginTop: '1px' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#1a56ff" strokeWidth="1.5"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="#1a56ff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{
                fontSize: '12px',
                color: C.muted2,
                margin: 0,
                lineHeight: 1.6,
              }}>
                Defina uma meta para sua rotina de estudos e transforme o aprendizado em um hábito!
                Seu progresso será contabilizado a partir do estudo dos conteúdos da disciplina.
                Se não houver nenhuma disponível, aguarde o lançamento de uma.
              </p>
            </div>

            {/* Botão salvar */}
            <button
              onClick={onSalvar}
              style={{
                width: '100%',
                padding: '14px',
                background: C.blue,
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'opacity 150ms',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Salvar rotina de estudos
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background: C.bg, color: C.text, display:'flex', height:'100vh', overflow:'hidden' }}>

      {/* SIDEBAR — apenas desktop */}
      {!isSmall && (
        <Sidebar paginaAtiva="trilha" onNavigate={onNavigate} onLogout={onLogout} />
      )}

      {/* MENU MOBILE/TABLET */}
      {isSmall && (
        <MobileMenu
          paginaAtiva="trilha"
          onNavigate={onNavigate}
          onLogout={onLogout}
          userName={nome}
          userRole={roleDisplay}
          userInitials={iniciais}
        />
      )}

      {/* MAIN */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', marginTop: isSmall ? '56px' : '0' }}>

        {/* TOPBAR — apenas desktop */}
        {!isSmall && (
          <Topbar
            navItems={[
              { label: 'Meus Cursos',  ativo: false, onClick: () => onNavigate('meusCursos') },
              { label: 'Certificados', ativo: false },
              { label: 'Biblioteca',   ativo: false },
              { label: 'Trilhas',      ativo: !telaRotina, onClick: () => setTelaRotina(false) },
            ]}
            userName="João Silva"
            userRole="Aluno"
            userInitials="JS"
            notificacoes={3}
          />
        )}

        {/* CONTEÚDO COM SCROLL */}
        <div style={{ flex:1, overflowY:'auto' }}>

          {telaRotina ? (

            /* ── TELA ROTINA DE ESTUDOS ── */
            <div>

              {/* Breadcrumb */}
              <div style={{
                padding: '12px 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: `1px solid ${C.border}`,
                background: C.surface,
              }}>
                <span
                  onClick={() => setTelaRotina(false)}
                  style={{ fontSize: '13px', color: C.muted, cursor: 'pointer', transition: 'color 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.blue}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}
                >
                  Início
                </span>
                <span style={{ fontSize: '13px', color: C.muted }}>›</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>
                  Rotina de estudos
                </span>
              </div>

              {/* Conteúdo centralizado */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 32px',
                minHeight: 'calc(100vh - 120px)',
              }}>
                {rotinaSalva ? (
                  <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                      Minha rotina de estudos
                    </h1>
                    <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 32px' }}>
                      Cadastre suas metas, acompanhe seu progresso e mantenha-se motivado.
                    </p>
                    <div style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: '12px',
                      padding: '20px 24px',
                      marginBottom: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 4px' }}>Sua meta atual</p>
                        <p style={{ fontSize: '20px', fontWeight: 700, color: C.blue, margin: 0 }}>
                          {diasSemana} dia{diasSemana !== 1 ? 's' : ''} por semana
                        </p>
                      </div>
                      <button
                        onClick={() => setModalRotina(true)}
                        style={{
                          background: 'none',
                          border: `1.5px solid ${C.border}`,
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: C.blue,
                          cursor: 'pointer',
                        }}
                      >
                        Editar
                      </button>
                    </div>
                    <button
                      onClick={() => setModalRotina(true)}
                      style={{
                        background: C.blue,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '14px 32px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(26,86,255,0.30)',
                      }}
                    >
                      + Atualizar rotina de estudos
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                      Minha rotina de estudos
                    </h1>
                    <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 32px' }}>
                      Cadastre suas metas, acompanhe seu progresso e mantenha-se motivado.
                    </p>
                    <div style={{ fontSize: '72px', marginBottom: '24px', lineHeight: 1 }}>
                      📚
                    </div>
                    <div style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      marginBottom: '32px',
                    }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 10px' }}>
                        Configure sua rotina com facilidade
                      </h3>
                      <p style={{ fontSize: '13px', color: C.muted2, margin: '0 0 16px', lineHeight: 1.6 }}>
                        Clique em "Definir rotina de estudos", escolha quantos dias na semana
                        pretende estudar e salve. Pronto! Agora seu progresso será contabilizado.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{
                            width: i === 0 ? '20px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === 0 ? C.blue : C.border,
                          }} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setModalRotina(true)}
                      style={{
                        background: C.blue,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '14px 32px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(26,86,255,0.35)',
                        transition: 'opacity 150ms',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      + Definir rotina de estudos
                    </button>
                  </div>
                )}
              </div>
            </div>

          ) : (

            /* ── CONTEÚDO NORMAL DA TRILHA ── */
            <div style={{ padding: isSmall ? '16px' : '32px 40px' }}>

          {/* Cabeçalho */}
          <div style={{ marginBottom:'24px' }}>
            <h1 style={{ fontSize:'28px', fontWeight:700, color:C.text, margin:'0 0 4px' }}>
              Minhas Disciplinas
            </h1>
            <p style={{ fontSize:'13px', fontWeight:700, color:C.muted, margin:0, letterSpacing:'0.5px', textTransform:'uppercase' }}>
              {usuarioLogado?.setor ?? 'Minha Trilha'}
            </p>
          </div>

          {/* Progresso */}
          <div style={{
            display:'flex', alignItems:'center', gap:'16px',
            marginBottom:'28px',
            padding:'16px 20px',
            background: C.surface,
            border:`1px solid ${C.border}`,
            borderRadius:'12px',
            width:'fit-content',
          }}>
            {/* Donut */}
            <div style={{ position:'relative', width:'52px', height:'52px', flexShrink:0 }}>
              <svg viewBox="0 0 52 52" style={{ transform:'rotate(-90deg)', width:'52px', height:'52px' }}>
                <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(26,86,255,0.12)" strokeWidth="6" />
                <circle cx="26" cy="26" r="20" fill="none" stroke={C.blue} strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*20*dados.percentual/100} ${2*Math.PI*20*(1-dados.percentual/100)}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:C.blue }}>
                {dados.percentual}%
              </div>
            </div>
            <div>
              <div style={{ fontSize:'12px', color:C.muted, marginBottom:'2px' }}>Progresso no curso</div>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text }}>
                {dados.cursosConcluidos} de {dados.totalCursos} curso{dados.totalCursos !== 1 ? 's' : ''} concluído{dados.cursosConcluidos !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Atalhos */}
          <div style={{ display:'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap:'12px', marginBottom:'36px', maxWidth:'700px' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'16px 20px',
              background: C.surface,
              border:`1px solid ${C.border}`,
              borderRadius:'10px', cursor:'pointer', transition:'all 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,255,0.4)'; e.currentTarget.style.background='rgba(26,86,255,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}
            >
              <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'rgba(26,86,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Calendar size={18} color={C.blue} />
              </div>
              <span style={{ fontSize:'14px', fontWeight:500, color:C.text }}>Calendário</span>
            </div>

            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'16px 20px',
              background: C.surface,
              border:`1px solid ${C.border}`,
              borderRadius:'10px', cursor:'pointer', transition:'all 150ms',
            }}
            onClick={() => setTelaRotina(true)}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,255,0.4)'; e.currentTarget.style.background='rgba(26,86,255,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'rgba(26,86,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Trophy size={18} color={C.blue} />
                </div>
                <span style={{ fontSize:'14px', fontWeight:500, color:C.text }}>Minha rotina de estudos</span>
              </div>
              <ChevronRight size={16} color={C.blue} />
            </div>
          </div>

          {/* DISCIPLINAS EM ANDAMENTO */}
          <div style={{ marginBottom:'40px' }}>
            <h2 style={{ fontSize: isSmall ? '18px' : '22px', fontWeight:700, color:C.text, margin:'0 0 20px' }}>
              Disciplinas em andamento
            </h2>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'12px' }}>
              {dados.carregando ? (
                <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                  Carregando...
                </div>
              ) : cursosAndamento.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                  Nenhum curso em andamento
                </div>
              ) : cursosAndamento.map(c => {
                const totalAulas      = (c as any).total_aulas      ?? 0
                const aulasConcluidas = (c as any).aulas_concluidas ?? Math.round(totalAulas * c.progresso_usuario / 100)
                const progresso       = c.progresso_usuario ?? 0
                const cor             = c.cor ?? '#1a56ff'
                return (
                  <div key={c.id} style={{
                    background: C.surface,
                    border:`1px solid ${C.border}`,
                    borderRadius:'12px', padding:'20px 24px',
                    cursor:'pointer', transition:'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,255,0.40)'; e.currentTarget.style.background='rgba(26,86,255,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}
                  onClick={() => onNavigate('meusCursos')}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: 'rgba(26,86,255,0.10)',
                        color: cor,
                        border: `1px solid ${cor}40`,
                      }}>
                        Cursando
                      </span>
                    </div>

                    <p style={{
                      fontSize:'13px', fontWeight:700, color:C.text,
                      margin:'0 0 6px', textTransform:'uppercase',
                      letterSpacing:'0.4px', lineHeight:1.4,
                    }}>
                      {c.titulo}
                    </p>

                    {((c as any).instrutor || (c as any).carga_horaria) && (
                      <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 12px' }}>
                        {(c as any).instrutor && `👤 ${(c as any).instrutor}`}
                        {(c as any).instrutor && (c as any).carga_horaria && ' · '}
                        {(c as any).carga_horaria && `⏱️ ${(c as any).carga_horaria}`}
                      </p>
                    )}

                    <div style={{ background:'rgba(26,86,255,0.10)', borderRadius:'6px', height:'6px', overflow:'hidden', marginBottom:'6px' }}>
                      <div style={{
                        background: progresso > 0 ? cor : 'rgba(26,86,255,0.15)',
                        height:'6px', borderRadius:'6px',
                        width:`${Math.min(progresso, 100)}%`,
                        minWidth: progresso > 0 ? '4px' : '0',
                        transition:'width 0.5s ease',
                      }} />
                    </div>

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:'11px', color:C.muted }}>
                        {aulasConcluidas}/{totalAulas} aulas concluídas
                      </span>
                      <span style={{ fontSize:'13px', fontWeight:700, color: progresso > 0 ? cor : C.muted }}>
                        {progresso}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* DISCIPLINAS CONCLUÍDAS */}
          <div>
            {/* Abas */}
            <div style={{ display:'flex', borderBottom:`1px solid ${C.border}`, marginBottom:'20px' }}>
              {abasStatus.map(aba => (
                <button key={aba}
                  onClick={() => setAbaAtiva(aba)}
                  style={{
                    background:'none', border:'none', cursor:'pointer',
                    padding:'10px 20px',
                    fontSize:'14px', fontWeight: abaAtiva===aba ? 700 : 400,
                    color: abaAtiva===aba ? C.blue : C.muted,
                    borderBottom: abaAtiva===aba ? `2px solid ${C.blue}` : '2px solid transparent',
                    marginBottom:'-1px', transition:'all 150ms',
                  }}
                >
                  {aba}
                </button>
              ))}
            </div>

            {abaAtiva === 'Aprovadas' && (
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:'12px', paddingBottom:'32px' }}>
                {cursosAprovadas.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: '20px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                    Nenhuma disciplina concluída ainda
                  </div>
                ) : cursosAprovadas.map(c => (
                  <div key={c.id} style={{
                    background: C.surface,
                    border:`1px solid rgba(16,185,129,0.25)`,
                    borderLeft:`4px solid #10b981`,
                    borderRadius:'10px', padding:'18px 20px',
                  }}>
                    <div style={{
                      display:'inline-flex', alignItems:'center',
                      background:'rgba(16,185,129,0.12)',
                      border:'0.5px solid rgba(16,185,129,0.30)',
                      borderRadius:'6px', padding:'3px 10px',
                      marginBottom:'10px',
                    }}>
                      <span style={{ fontSize:'10px', fontWeight:700, color:C.green }}>✅ Aprovado</span>
                    </div>

                    <p style={{
                      fontSize:'13px', fontWeight:700, color:C.text,
                      margin:'0 0 6px', textTransform:'uppercase',
                      letterSpacing:'0.4px', lineHeight:1.4,
                    }}>
                      {c.titulo}
                    </p>

                    <p style={{ fontSize:'11px', color:C.green, margin:'0 0 12px' }}>
                      {c.nota_obtida != null ? `Nota: ${c.nota_obtida}%` : 'Concluído'}
                    </p>

                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ flex:1, background:'rgba(16,185,129,0.10)', borderRadius:'4px', height:'5px' }}>
                        <div style={{
                          background: C.green,
                          height:'5px', borderRadius:'4px',
                          width:`${c.nota_obtida ?? c.progresso_usuario}%`,
                          transition:'width 0.5s ease',
                        }} />
                      </div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:C.green, minWidth:'32px', textAlign:'right' }}>
                        {c.nota_obtida != null ? `${c.nota_obtida}%` : `${c.progresso_usuario}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {abaAtiva === 'Reprovadas' && (
              <div style={{ paddingBottom:'32px' }}>
                {cursosReprovadas.length === 0 ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'120px', color:C.muted, fontSize:'14px' }}>
                    Nenhuma reprovação registrada
                  </div>
                ) : cursosReprovadas.map(c => (
                  <div key={c.id} style={{
                    background: C.surface,
                    border: `1px solid rgba(239,68,68,0.25)`,
                    borderLeft: `4px solid #ef4444`,
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <span style={{ fontSize:'20px' }}>❌</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:'13px', fontWeight:700, color:C.text, margin:'0 0 2px', textTransform:'uppercase' }}>
                        {c.titulo}
                      </p>
                      <p style={{ fontSize:'11px', color:'#ef4444', margin:0 }}>
                        Reprovado · Nota: {c.nota_obtida}% · Mínimo: {c.nota_minima ?? 70}%
                      </p>
                    </div>
                    <span style={{ fontSize:'18px', fontWeight:800, color:'#ef4444' }}>
                      {c.nota_obtida}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {abaAtiva === 'Futuras' && (
              <div style={{ paddingBottom:'32px' }}>
                {cursosFuturas.length === 0 ? (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'120px', color:C.muted, fontSize:'14px' }}>
                    Todos os cursos foram iniciados
                  </div>
                ) : cursosFuturas.map(c => (
                  <div key={c.id} style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderLeft: `4px solid ${C.muted}`,
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    opacity: 0.75,
                  }}>
                    <span style={{ fontSize:'20px' }}>🔒</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:'13px', fontWeight:700, color:C.text, margin:'0 0 2px', textTransform:'uppercase' }}>
                        {c.titulo}
                      </p>
                      <p style={{ fontSize:'11px', color:C.muted, margin:0 }}>
                        Disponível · Não iniciado
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            </div>
          )}

        </div>
      </main>

      {/* Modal de definir rotina — sobre tudo */}
      {modalRotina && (
        <ModalDefinirRotina
          dias={diasSemana}
          onChangeDias={setDiasSemana}
          onSalvar={() => {
            setRotinaSalva(true)
            setModalRotina(false)
          }}
          onFechar={() => setModalRotina(false)}
          C={C as Record<string, string>}
        />
      )}
    </div>
  )
}
