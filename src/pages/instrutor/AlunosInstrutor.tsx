import { useState, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle, User, Users, TrendingUp, UserX } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI, usuariosAPI } from '../../services/api'

const BASE_URL = (import.meta.env.VITE_API_URL as string || '').replace(/\/api$/, '')

interface Aluno {
  id: string
  nome: string
  cpf: string
  cargo: string
  setor: string
  status: string
  foto_url: string | null
  turma_id: string
}

export function AlunosInstrutor() {
  const { C } = useTheme()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const turma = await instrutorAPI.minhaTurma()
        if (!turma) { setErro('Nenhuma turma vinculada.'); return }
        const data = await usuariosAPI.listar({
          turma_id: String(turma.id),
          perfil: 'colaborador',
          limite: '500',
        }) as Aluno[]
        const lista = Array.isArray(data) ? data : (data as any)?.usuarios ?? []
        setAlunos(lista)
      } catch {
        setErro('Não foi possível carregar os alunos.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const alunosFiltrados = alunos.filter(a =>
    !busca ||
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.cargo?.toLowerCase().includes(busca.toLowerCase()) ||
    a.cpf?.includes(busca)
  )

  const ativos   = alunos.filter(a => a.status === 'ativo').length
  const inativos = alunos.length - ativos

  if (carregando) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCw size={24} color={C.blue} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (erro) return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
      <AlertCircle size={40} color={C.muted} />
      <div style={{ fontSize: '16px', color: C.text }}>{erro}</div>
    </div>
  )

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Alunos da Turma</h1>
        <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
          {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} vinculado{alunos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total de Alunos', valor: alunos.length, icon: Users,     cor: '#1a56ff' },
          { label: 'Ativos',          valor: ativos,        icon: TrendingUp, cor: '#10b981' },
          { label: 'Inativos',        valor: inativos,      icon: UserX,      cor: '#ef4444' },
        ].map(m => {
          const Icon = m.icon
          return (
            <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={m.cor} />
                </div>
                <span style={{ fontSize: '12px', color: C.muted }}>{m.label}</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: C.text }}>{m.valor}</div>
            </div>
          )
        })}
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
        <Search size={15} color={C.muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome, cargo ou CPF..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px 10px 38px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', color: C.text, fontSize: '13px', outline: 'none',
          }}
        />
      </div>

      {/* Tabela */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: (C as any).surface2 ?? C.surface }}>
              {['Aluno', 'CR / CPF', 'Cargo', 'Setor', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 700, color: C.muted,
                  textTransform: 'uppercase' as const, letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>
                  Nenhum aluno encontrado.
                </td>
              </tr>
            ) : alunosFiltrados.map((aluno, i) => (
              <tr
                key={aluno.id}
                style={{
                  borderBottom: i < alunosFiltrados.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(26,86,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {aluno.foto_url ? (
                      <img
                        src={`${BASE_URL}${aluno.foto_url}`}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(26,86,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, color: C.blue,
                      }}>
                        {aluno.nome?.split(' ').slice(0, 2).map(n => n[0]).join('') || <User size={14} color={C.blue} />}
                      </div>
                    )}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{aluno.nome}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted, whiteSpace: 'nowrap' }}>
                  {aluno.cpf
                    ? aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                    : '—'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{aluno.cargo || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{aluno.setor || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                    background: aluno.status === 'ativo' ? '#10b98118' : '#ef444418',
                    color: aluno.status === 'ativo' ? '#10b981' : '#ef4444',
                    textTransform: 'capitalize' as const,
                  }}>
                    {aluno.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
