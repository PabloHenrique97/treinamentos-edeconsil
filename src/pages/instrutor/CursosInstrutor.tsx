import { useState, useEffect } from 'react'
import { BookOpen, RefreshCw, AlertCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI } from '../../services/api'
import apiRequest from '../../services/api'

interface Curso {
  id: string
  slug: string
  titulo: string
  descricao: string
  carga_horaria: number
  status: string
  total_aulas: number
}

interface CursosInstrutorProps {
  onAbrirCurso: (slug: string) => void
}

export function CursosInstrutor({ onAbrirCurso }: CursosInstrutorProps) {
  const { C } = useTheme()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const turma = await instrutorAPI.minhaTurma()
        if (!turma) { setErro('Nenhuma turma vinculada.'); return }
        const data = await apiRequest<Curso[]>(`/turmas/${turma.id}/cursos`)
        setCursos(Array.isArray(data) ? data : [])
      } catch {
        setErro('Não foi possível carregar os cursos.')
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
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
      <AlertCircle size={40} color={C.muted} />
      <div style={{ fontSize: '16px', color: C.text }}>{erro}</div>
    </div>
  )

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Cursos da Turma</h1>
        <p style={{ fontSize: '13px', color: C.muted, margin: '4px 0 0' }}>
          {cursos.length} curso{cursos.length !== 1 ? 's' : ''} vinculado{cursos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {cursos.length === 0 ? (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px', padding: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          textAlign: 'center',
        }}>
          <BookOpen size={40} color={C.muted} />
          <div style={{ fontSize: '15px', color: C.muted }}>Nenhum curso vinculado à turma.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {cursos.map(curso => (
            <div
              key={curso.id || curso.slug}
              onClick={() => onAbrirCurso(curso.slug)}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'all 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.blue
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'rgba(26,86,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <BookOpen size={20} color={C.blue} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
                {curso.titulo}
              </h3>
              {curso.descricao && (
                <p style={{
                  fontSize: '12px', color: C.muted, margin: '0 0 12px',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {curso.descricao}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: C.muted }}>
                  {curso.total_aulas} aula{curso.total_aulas !== 1 ? 's' : ''}
                  {curso.carga_horaria ? ` · ${curso.carga_horaria}h` : ''}
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
                  background: curso.status === 'publicado' ? '#10b98118' : '#f59e0b18',
                  color: curso.status === 'publicado' ? '#10b981' : '#f59e0b',
                }}>
                  {curso.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
