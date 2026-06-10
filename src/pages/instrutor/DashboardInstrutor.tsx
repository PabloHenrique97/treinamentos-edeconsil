import { useState, useEffect } from 'react'
import { Users, BookOpen, Award, ArrowRight, MessageSquare, FileText, RefreshCw, AlertCircle, BarChart2, Bell } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI, certificadosAPI } from '../../services/api'
import { useUsuarioLogado } from '../../hooks/useUsuarioLogado'

interface Turma {
  id: string
  nome: string
  cargo_grupo: string
  setor: string
  responsavel: string
  icone: string
  cor: string
  status: string
  instrutor_id: string
  instrutor_nome: string
  total_alunos: number
  total_cursos: number
}

interface DashboardInstrutorProps {
  onNavigate: (page: string) => void
}

export function DashboardInstrutor({ onNavigate }: DashboardInstrutorProps) {
  const { C } = useTheme()
  const { primeiroNome } = useUsuarioLogado()
  const [turma, setTurma] = useState<Turma | null>(null)
  const [totalCerts, setTotalCerts] = useState<number>(0)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const t = await instrutorAPI.minhaTurma() as Turma
        setTurma(t)
        if (t?.id) {
          try {
            const data = await certificadosAPI.listarAdmin({ turma_id: String(t.id), limite: '1' }) as any
            setTotalCerts(data.total ?? 0)
          } catch { /* ok */ }
        }
      } catch {
        setErro('Não foi possível carregar os dados.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  if (carregando) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCw size={24} color={C.blue} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (erro) return (
    <div style={{ padding: '32px', color: C.muted, display: 'flex', gap: '8px', alignItems: 'center' }}>
      <AlertCircle size={18} /> {erro}
    </div>
  )

  if (!turma) return (
    <div style={{
      padding: '48px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '16px', textAlign: 'center',
    }}>
      <AlertCircle size={40} color={C.muted} />
      <div style={{ fontSize: '18px', fontWeight: 600, color: C.text }}>
        Nenhuma turma vinculada
      </div>
      <div style={{ fontSize: '14px', color: C.muted, maxWidth: '360px' }}>
        Entre em contato com o administrador para que uma turma seja vinculada à sua conta.
      </div>
    </div>
  )

  const cor = turma.cor || '#1a56ff'

  const metricas = [
    { label: 'Alunos na Turma',    valor: turma.total_alunos, icon: Users,    cor: '#1a56ff', page: 'alunosInstrutor'        },
    { label: 'Cursos Vinculados',  valor: turma.total_cursos, icon: BookOpen,  cor: '#10b981', page: 'cursosInstrutor'        },
    { label: 'Certificados',       valor: totalCerts,         icon: Award,     cor: '#8b5cf6', page: 'certificadosInstrutor'  },
  ]

  const acessoRapido = [
    { label: 'Alunos',       icon: Users,        page: 'alunosInstrutor',       cor: '#1a56ff' },
    { label: 'Cursos',       icon: BookOpen,      page: 'cursosInstrutor',       cor: '#10b981' },
    { label: 'Certificados', icon: Award,         page: 'certificadosInstrutor', cor: '#8b5cf6' },
    { label: 'Indicadores',  icon: BarChart2,     page: 'indicadoresInstrutor',  cor: '#f59e0b' },
    { label: 'Mensagens',    icon: MessageSquare, page: 'mensagensInstrutor',    cor: '#0d2550' },
    { label: 'Biblioteca',   icon: FileText,      page: 'bibliotecaInstrutor',   cor: '#6b7280' },
    { label: 'Notificações', icon: Bell,          page: 'notificacoesInstrutor', cor: '#ef4444' },
  ]

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>
          Olá, {primeiroNome}!
        </h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: '4px 0 0' }}>
          Painel do Instrutor — {turma.cargo_grupo || turma.nome}
        </p>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {metricas.map(m => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              onClick={() => onNavigate(m.page)}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.cor; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>{m.label}</span>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: `${m.cor}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={m.cor} />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: C.text }}>{m.valor}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: m.cor, fontWeight: 600 }}>Ver detalhes</span>
                <ArrowRight size={10} color={m.cor} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Card da Turma — visual TurmasAdmin */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', overflow: 'hidden', marginBottom: '28px',
      }}>
        <div style={{ borderTop: `4px solid ${cor}`, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: `${cor}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0,
              }}>
                {turma.icone || '🏢'}
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {turma.cargo_grupo || turma.nome}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '10px',
                    background: turma.status === 'ativa' ? '#10b98118' : '#6b728018',
                    color: turma.status === 'ativa' ? '#10b981' : C.muted,
                    border: `1px solid ${turma.status === 'ativa' ? '#10b98133' : '#6b728033'}`,
                    textTransform: 'uppercase' as const,
                  }}>
                    {turma.status}
                  </span>
                  {turma.setor && (
                    <span style={{ fontSize: '12px', color: C.muted }}>{turma.setor}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('turmaInstrutor')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', background: 'none',
                border: `1.5px solid ${cor}`, borderRadius: '8px',
                color: cor, fontSize: '12px', fontWeight: 700,
                cursor: 'pointer', transition: 'all 150ms', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = cor; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = cor }}
            >
              Ver Turma <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${C.border}`, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alunos</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{turma.total_alunos}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cursos</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{turma.total_cursos}</div>
            </div>
            {turma.responsavel && (
              <div>
                <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Responsável</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginTop: '2px' }}>{turma.responsavel}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acesso Rápido */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 14px' }}>Acesso Rápido</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {acessoRapido.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.page}
                onClick={() => onNavigate(item.page)}
                style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: '10px', padding: '16px 12px',
                  cursor: 'pointer', transition: 'all 150ms',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.cor; e.currentTarget.style.background = `${item.cor}08` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${item.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={item.cor} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
