import { useState } from 'react'
import {
  ChevronRight, Bell, Search,
  Calendar, Trophy,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'

const C = {
  bg:      '#050d1a',
  surface: '#070f1e',
  surface2:'#0a1628',
  surface3:'#0d1e35',
  border:  'rgba(26,86,255,0.15)',
  blue:    '#1a56ff',
  green:   '#10b981',
  amber:   '#f59e0b',
  purple:  '#8b5cf6',
  text:    '#ffffff',
  muted:   '#4a6080',
  muted2:  '#6b80a0',
}

const cursoDados = {
  nome: 'Gestão de Obras e Construção Civil',
  totalDisciplinas: 44,
  concluidas: 12,
  progresso: 27,
}

const disciplinasAndamento = [
  { id: 1,  titulo: 'NR-35 — Trabalho em Altura',              status: 'Cursando', pct: 68  },
  { id: 2,  titulo: 'SIPAT — Segurança no Canteiro de Obras',  status: 'Cursando', pct: 35  },
  { id: 3,  titulo: 'Gestão da Qualidade ISO 9001',            status: 'Cursando', pct: 12  },
  { id: 4,  titulo: 'Liderança em Obras e Canteiros',          status: 'Cursando', pct: 0   },
  { id: 5,  titulo: 'NR-18 — Condições e Meio Ambiente',       status: 'Cursando', pct: 0   },
  { id: 6,  titulo: 'Gestão Ambiental em Obras',               status: 'Cursando', pct: 0   },
]

const disciplinasConcluidas = [
  { id: 7,  titulo: 'Introdução à Construção Civil',           status: 'Aprovada', pct: 100, cor: C.green },
  { id: 8,  titulo: 'Fundamentos de Terraplanagem',            status: 'Aprovada', pct: 100, cor: C.green },
  { id: 9,  titulo: 'Materiais e Equipamentos de Obra',        status: 'Aprovada', pct: 96,  cor: C.green },
  { id: 10, titulo: 'Normas Técnicas ABNT para Construção',    status: 'Aprovada', pct: 84,  cor: C.green },
  { id: 11, titulo: 'Segurança Básica no Trabalho',            status: 'Aprovada', pct: 83,  cor: C.green },
  { id: 12, titulo: 'Planejamento de Obras',                   status: 'Aprovada', pct: 100, cor: C.green },
  { id: 13, titulo: 'Leitura de Projetos — Nível Básico',      status: 'Aprovada', pct: 96,  cor: C.green },
  { id: 14, titulo: 'Topografia Aplicada',                     status: 'Aprovada', pct: 91,  cor: C.green },
  { id: 15, titulo: 'Controle de Qualidade em Obras',          status: 'Aprovada', pct: 88,  cor: C.green },
  { id: 16, titulo: 'Fundamentos de Pavimentação',             status: 'Aprovada', pct: 79,  cor: C.green },
  { id: 17, titulo: 'Equipamentos de Terraplanagem',           status: 'Aprovada', pct: 85,  cor: C.green },
  { id: 18, titulo: 'Gestão de Resíduos em Obras',             status: 'Aprovada', pct: 93,  cor: C.green },
]

const abasStatus = ['Aprovadas', 'Reprovadas', 'Futuras']

interface TrilhaAprendizadoProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function TrilhaAprendizado({ onNavigate, onLogout }: TrilhaAprendizadoProps) {
  const [abaAtiva, setAbaAtiva] = useState('Aprovadas')

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background: C.bg, color: C.text, display:'flex', height:'100vh', overflow:'hidden' }}>

      {/* SIDEBAR */}
      <Sidebar
        paginaAtiva="trilha"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* MAIN */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* TOPBAR */}
        <div style={{
          height:'56px', flexShrink:0,
          background: C.surface,
          borderBottom:`1px solid ${C.border}`,
          display:'flex', alignItems:'center',
          padding:'0 24px', gap:'20px',
        }}>
          {['Meus Cursos','Certificados','Biblioteca','Trilhas'].map(t => (
            <span key={t} style={{
              fontSize:'13px',
              fontWeight: t === 'Trilhas' ? 600 : 400,
              color: t === 'Trilhas' ? C.text : C.muted,
              cursor:'pointer', padding:'4px 0',
              borderBottom: t === 'Trilhas' ? `2px solid ${C.blue}` : '2px solid transparent',
            }}>
              {t}
            </span>
          ))}

          {/* Busca */}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px', padding:'7px 14px', width:'240px' }}>
            <Search size={13} color={C.muted} />
            <span style={{ fontSize:'12px', color:C.muted, flex:1 }}>Buscar disciplinas...</span>
            <span style={{ fontSize:'10px', color:C.muted, background:C.surface, padding:'1px 5px', borderRadius:'4px' }}>⌘ K</span>
          </div>

          {/* Ícones */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ position:'relative', cursor:'pointer', padding:'6px' }}>
              <Bell size={17} color={C.muted} />
              <div style={{ position:'absolute', top:'3px', right:'3px', width:'14px', height:'14px', background:C.blue, borderRadius:'50%', fontSize:'8px', fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>3</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', padding:'4px 8px', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:'8px' }}>
              <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:C.blue, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:'#fff' }}>JS</div>
              <div>
                <div style={{ fontSize:'11px', fontWeight:600, color:C.text }}>João Silva</div>
                <div style={{ fontSize:'9px', color:C.green }}>● Aluno</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTEÚDO COM SCROLL */}
        <div style={{ flex:1, overflowY:'auto', padding:'32px 40px' }}>

          {/* Cabeçalho */}
          <div style={{ marginBottom:'24px' }}>
            <h1 style={{ fontSize:'28px', fontWeight:700, color:C.text, margin:'0 0 4px' }}>
              Minhas Disciplinas
            </h1>
            <p style={{ fontSize:'13px', fontWeight:700, color:C.muted, margin:0, letterSpacing:'0.5px', textTransform:'uppercase' }}>
              {cursoDados.nome}
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
                  strokeDasharray={`${2*Math.PI*20*cursoDados.progresso/100} ${2*Math.PI*20*(1-cursoDados.progresso/100)}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:C.blue }}>
                {cursoDados.progresso}%
              </div>
            </div>
            <div>
              <div style={{ fontSize:'12px', color:C.muted, marginBottom:'2px' }}>Progresso no curso</div>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text }}>
                {cursoDados.concluidas} de {cursoDados.totalDisciplinas} disciplinas concluídas
              </div>
            </div>
          </div>

          {/* Atalhos */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'36px', maxWidth:'700px' }}>
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
            <h2 style={{ fontSize:'22px', fontWeight:700, color:C.text, margin:'0 0 20px' }}>
              Disciplinas em andamento
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {disciplinasAndamento.map(d => (
                <div key={d.id} style={{
                  background: C.surface,
                  border:`1px solid ${C.border}`,
                  borderRadius:'10px', padding:'18px 20px',
                  cursor:'pointer', transition:'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(26,86,255,0.40)'; e.currentTarget.style.background='rgba(26,86,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}
                >
                  <div style={{
                    display:'inline-flex', alignItems:'center',
                    background:'rgba(26,86,255,0.12)',
                    border:'0.5px solid rgba(26,86,255,0.3)',
                    borderRadius:'6px', padding:'3px 10px',
                    marginBottom:'10px',
                  }}>
                    <span style={{ fontSize:'10px', fontWeight:700, color:C.blue }}>{d.status}</span>
                  </div>

                  <p style={{
                    fontSize:'13px', fontWeight:700, color:C.text,
                    margin:'0 0 14px', textTransform:'uppercase',
                    letterSpacing:'0.4px', lineHeight:1.4,
                    minHeight:'36px',
                    display:'-webkit-box',
                    WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical' as const,
                    overflow:'hidden',
                  }}>
                    {d.titulo}
                  </p>

                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <div style={{ flex:1, background:'rgba(26,86,255,0.10)', borderRadius:'4px', height:'5px' }}>
                      <div style={{
                        background: d.pct > 0 ? C.blue : 'rgba(26,86,255,0.15)',
                        height:'5px', borderRadius:'4px',
                        width:`${d.pct}%`,
                        minWidth: d.pct > 0 ? '4px' : '0',
                        transition:'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{ fontSize:'11px', fontWeight:600, color: d.pct > 0 ? C.blue : C.muted, minWidth:'28px', textAlign:'right' }}>
                      {d.pct}%
                    </span>
                  </div>
                </div>
              ))}
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
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', paddingBottom:'32px' }}>
                {disciplinasConcluidas.map(d => (
                  <div key={d.id} style={{
                    background: C.surface,
                    border:`1px solid ${C.border}`,
                    borderRadius:'10px', padding:'18px 20px',
                    cursor:'pointer', transition:'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(16,185,129,0.35)'; e.currentTarget.style.background='rgba(16,185,129,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}
                  >
                    <div style={{
                      display:'inline-flex', alignItems:'center',
                      background:'rgba(16,185,129,0.12)',
                      border:'0.5px solid rgba(16,185,129,0.30)',
                      borderRadius:'6px', padding:'3px 10px',
                      marginBottom:'10px',
                    }}>
                      <span style={{ fontSize:'10px', fontWeight:700, color:C.green }}>{d.status}</span>
                    </div>

                    <p style={{
                      fontSize:'13px', fontWeight:700, color:C.text,
                      margin:'0 0 14px', textTransform:'uppercase',
                      letterSpacing:'0.4px', lineHeight:1.4,
                      minHeight:'36px',
                      display:'-webkit-box',
                      WebkitLineClamp:2,
                      WebkitBoxOrient:'vertical' as const,
                      overflow:'hidden',
                    }}>
                      {d.titulo}
                    </p>

                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ flex:1, background:'rgba(16,185,129,0.10)', borderRadius:'4px', height:'5px' }}>
                        <div style={{
                          background: C.green,
                          height:'5px', borderRadius:'4px',
                          width:`${d.pct}%`,
                          transition:'width 0.5s ease',
                        }} />
                      </div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:C.green, minWidth:'32px', textAlign:'right' }}>
                        {d.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {abaAtiva === 'Reprovadas' && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'120px', color:C.muted, fontSize:'14px' }}>
                Nenhuma disciplina reprovada
              </div>
            )}

            {abaAtiva === 'Futuras' && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'120px', color:C.muted, fontSize:'14px' }}>
                Disciplinas futuras serão exibidas aqui
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
