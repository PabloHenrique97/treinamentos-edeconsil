import { useState, useEffect } from 'react'
import { Users, BookOpen, Award, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI, certificadosAPI, usuariosAPI } from '../../services/api'
import apiRequest from '../../services/api'

interface Indicadores {
  totalAlunos: number
  alunosAtivos: number
  totalCursos: number
  totalCertificados: number
  turma: any
}

export function IndicadoresInstrutor() {
  const { C } = useTheme()
  const [dados, setDados] = useState<Indicadores | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [alunosList, setAlunosList] = useState<any[]>([])

  useEffect(() => {
    async function carregar() {
      try {
        const turma = await instrutorAPI.minhaTurma() as any
        if (!turma?.id) { setErro('Nenhuma turma vinculada.'); setCarregando(false); return }

        const [alunosData, certsData, cursosData] = await Promise.allSettled([
          usuariosAPI.listar({ turma_id: String(turma.id), perfil: 'colaborador', limite: '500' }),
          certificadosAPI.listarAdmin({ turma_id: String(turma.id), limite: '1' }),
          apiRequest<any[]>(`/turmas/${turma.id}/cursos`),
        ])

        const alunosRaw   = alunosData.status   === 'fulfilled' ? alunosData.value   as any : {}
        const certsRaw    = certsData.status    === 'fulfilled' ? certsData.value    as any : {}
        const cursosRaw   = cursosData.status   === 'fulfilled' ? cursosData.value   as any : []

        const lista: any[] = Array.isArray(alunosRaw) ? alunosRaw : (alunosRaw?.usuarios ?? [])
        setAlunosList(lista)

        setDados({
          totalAlunos:       turma.total_alunos    ?? lista.length,
          alunosAtivos:      lista.filter((a: any) => a.status === 'ativo').length || (turma.total_alunos ?? 0),
          totalCursos:       turma.total_cursos    ?? (Array.isArray(cursosRaw) ? cursosRaw.length : 0),
          totalCertificados: certsRaw?.total       ?? 0,
          turma,
        })
      } catch {
        setErro('Não foi possível carregar os indicadores.')
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

  if (erro || !dados) return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
      <AlertCircle size={40} color={C.muted} />
      <div style={{ fontSize: '16px', color: C.text }}>{erro || 'Sem dados disponíveis.'}</div>
    </div>
  )

  const metricas = [
    { label: 'Total de Alunos',    valor: dados.totalAlunos,       icon: Users,      cor: '#1a56ff' },
    { label: 'Alunos Ativos',      valor: dados.alunosAtivos,      icon: TrendingUp, cor: '#10b981' },
    { label: 'Cursos Vinculados',  valor: dados.totalCursos,       icon: BookOpen,   cor: '#f59e0b' },
    { label: 'Certificados',       valor: dados.totalCertificados, icon: Award,      cor: '#8b5cf6' },
  ]

  const cor = dados.turma?.cor || '#1a56ff'

  return (
    <div style={{ padding: '28px 24px', maxWidth: '900px' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
          Indicadores da Turma
        </h1>
        <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
          {dados.turma?.cargo_grupo || dados.turma?.nome} — Dados em tempo real
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {metricas.map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={m.cor} />
                </div>
                <span style={{ fontSize: '12px', color: C.muted, lineHeight: 1.3 }}>{m.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: C.text }}>{m.valor}</div>
            </div>
          )
        })}
      </div>

      {/* Alunos Ativos — barra */}
      {alunosList.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 16px' }}>
            Status dos Alunos ({alunosList.length})
          </h2>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Ativos',   cor: '#10b981', count: alunosList.filter((a: any) => a.status === 'ativo').length   },
              { label: 'Inativos', cor: '#ef4444', count: alunosList.filter((a: any) => a.status !== 'ativo').length   },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.cor }} />
                <span style={{ fontSize: '13px', color: C.text, fontWeight: 600 }}>{s.count}</span>
                <span style={{ fontSize: '12px', color: C.muted }}>{s.label}</span>
              </div>
            ))}
          </div>
          {/* barra proporcional */}
          <div style={{ height: '8px', borderRadius: '4px', background: `${C.border}`, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px', background: '#10b981',
              width: `${Math.round(alunosList.filter((a: any) => a.status === 'ativo').length / Math.max(1, alunosList.length) * 100)}%`,
              transition: 'width 0.5s',
            }} />
          </div>
        </div>
      )}

      {/* Turma detalhes */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ borderTop: `4px solid ${cor}` }} />
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 16px' }}>Informações da Turma</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Nome', valor: dados.turma?.nome },
              { label: 'Cargo / Grupo', valor: dados.turma?.cargo_grupo },
              { label: 'Setor', valor: dados.turma?.setor },
              { label: 'Responsável', valor: dados.turma?.responsavel },
              { label: 'Status', valor: dados.turma?.status },
            ].filter(i => i.valor).map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '14px', color: C.text, fontWeight: 500 }}>{item.valor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
