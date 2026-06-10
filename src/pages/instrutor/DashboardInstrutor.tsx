import { useState, useEffect } from 'react'
import { Users, BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI } from '../../services/api'
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
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    instrutorAPI.minhaTurma()
      .then(t => setTurma(t))
      .catch(() => setErro('Não foi possível carregar os dados.'))
      .finally(() => setCarregando(false))
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

  const cards = [
    {
      label: 'Alunos na Turma',
      valor: turma.total_alunos,
      icon: <Users size={20} color="#1a56ff" />,
      cor: '#1a56ff',
      page: 'alunosInstrutor',
    },
    {
      label: 'Cursos Vinculados',
      valor: turma.total_cursos,
      icon: <BookOpen size={20} color="#10b981" />,
      cor: '#10b981',
      page: 'cursosInstrutor',
    },
  ]

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>
          Olá, {primeiroNome}!
        </h1>
        <p style={{ fontSize: '14px', color: C.muted, margin: '4px 0 0' }}>
          Painel do Instrutor — {turma.cargo_grupo}
        </p>
      </div>

      {/* Cards de métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div
            key={card.label}
            onClick={() => onNavigate(card.page)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = card.cor}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: C.muted, fontWeight: 500 }}>{card.label}</span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: `${card.cor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: C.text }}>{card.valor}</div>
          </div>
        ))}
      </div>

      {/* Card da turma */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '12px',
            background: `${turma.cor || '#1a56ff'}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>
            {turma.icone || '🏢'}
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.text, margin: 0 }}>
              {turma.cargo_grupo || turma.nome}
            </h2>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '2px 8px',
              borderRadius: '4px', background: turma.status === 'ativa' ? '#10b98118' : '#6b728018',
              color: turma.status === 'ativa' ? '#10b981' : C.muted,
              border: `1px solid ${turma.status === 'ativa' ? '#10b98133' : '#6b728033'}`,
              textTransform: 'uppercase' as const,
            }}>
              {turma.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Setor', valor: turma.setor },
            { label: 'Responsável', valor: turma.responsavel },
            { label: 'Alunos ativos', valor: String(turma.total_alunos) },
            { label: 'Cursos', valor: String(turma.total_cursos) },
          ].filter(i => i.valor).map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase' as const }}>
                {item.label}
              </div>
              <div style={{ fontSize: '14px', color: C.text }}>{item.valor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
