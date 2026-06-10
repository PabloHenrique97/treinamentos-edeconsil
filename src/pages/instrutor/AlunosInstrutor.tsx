import { useState, useEffect } from 'react'
import { Search, RefreshCw, AlertCircle, User } from 'lucide-react'
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
        setAlunos(Array.isArray(data) ? data : [])
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
    a.cargo?.toLowerCase().includes(busca.toLowerCase())
  )

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
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Alunos da Turma</h1>
        <p style={{ fontSize: '13px', color: C.muted, margin: '4px 0 0' }}>
          {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} ativo{alunos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
        <Search size={15} color={C.muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou cargo..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px 10px 38px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', color: C.text, fontSize: '13px', outline: 'none',
          }}
        />
      </div>

      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Aluno', 'Cargo', 'Setor', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 700, color: C.muted,
                  textTransform: 'uppercase' as const, letterSpacing: '0.5px',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: '14px' }}>
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
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'rgba(26,86,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <User size={14} color={C.blue} />
                      </div>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>{aluno.nome}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{aluno.cargo || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: C.muted }}>{aluno.setor || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px',
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
