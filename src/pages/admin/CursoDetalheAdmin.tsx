import { useState, useEffect } from 'react'
import {
  ChevronDown, ChevronUp,
  BookOpen, Users, Clock, ArrowLeft,
  Play, Edit, Check, TrendingUp, Pencil,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { cursosAPI, questoesAPI } from '../../services/api'

interface CursoDetalheAdminProps {
  cursoId: string
  onNavigate: (page: string) => void
  onLogout: () => void
  onVoltar: () => void
}

export function CursoDetalheAdmin({ cursoId, onNavigate, onLogout, onVoltar }: CursoDetalheAdminProps) {
  const { C } = useTheme()
  const [curso, setCurso] = useState<any>(null)
  const [modulosAbertos, setModulosAbertos] = useState<Set<number>>(new Set([0]))
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [questaoEditando, setQuestaoEditando] = useState<null | {
    id: string
    enunciado: string
    alternativas: { A: string; B: string; C: string; D: string }
    gabarito: string
    explicacao: string
  }>(null)
  const [salvandoQuestao, setSalvandoQuestao] = useState(false)

  useEffect(() => {
    setCarregando(true)
    setErro('')
    cursosAPI.buscarPorSlug(cursoId as any)
      .then((data: any) => {
        setCurso(data)
        if (data.modulos?.length) setModulosAbertos(new Set([data.modulos[0].id]))
        setCarregando(false)
      })
      .catch((err: any) => {
        setErro(err.message ?? 'Erro ao carregar curso')
        setCarregando(false)
      })
  }, [cursoId])

  const toggleModulo = (id: number) => {
    setModulosAbertos(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSalvarQuestao = async () => {
    if (!questaoEditando) return
    setSalvandoQuestao(true)
    try {
      const atualizada: any = await questoesAPI.atualizar(questaoEditando.id, {
        enunciado:    questaoEditando.enunciado,
        alternativas: questaoEditando.alternativas,
        gabarito:     questaoEditando.gabarito,
        explicacao:   questaoEditando.explicacao,
      })
      setCurso((prev: any) => ({
        ...prev,
        questoes: prev.questoes.map((q: any) =>
          q.id === questaoEditando.id ? atualizada : q
        ),
      }))
      setQuestaoEditando(null)
    } catch (err: any) {
      alert(err.message ?? 'Erro ao salvar questão')
    } finally {
      setSalvandoQuestao(false)
    }
  }

  if (carregando) return (
    <LayoutAdmin paginaAtiva="cursosAdmin" onNavigate={onNavigate} onLogout={onLogout}
      topbarTitulo="Gestão de Cursos" topbarSubtitulo="Carregando...">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
        <div style={{ width: '28px', height: '28px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: '14px', color: C.muted }}>Carregando curso...</span>
      </div>
    </LayoutAdmin>
  )

  if (erro || !curso) return (
    <LayoutAdmin paginaAtiva="cursosAdmin" onNavigate={onNavigate} onLogout={onLogout}
      topbarTitulo="Gestão de Cursos" topbarSubtitulo="Erro">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
        <span style={{ fontSize: '40px' }}>⚠️</span>
        <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>
          {erro || 'Curso não encontrado'}
        </p>
        <button onClick={onVoltar}
          style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
          Voltar
        </button>
      </div>
    </LayoutAdmin>
  )

  const totalAulas         = parseInt(curso.total_aulas) || 0
  const totalAlunos        = parseInt(curso.total_alunos_matriculados) || 0
  const totalConcluidos    = parseInt(curso.total_concluidos) || 0
  const progressoMedio     = parseInt(curso.progresso_medio) || 0
  const corCurso           = curso.cor ?? '#1a56ff'
  const statusLabel        = curso.status === 'ativo' ? 'Ativo' : curso.status === 'rascunho' ? 'Rascunho' : 'Arquivado'
  const corStatus          = curso.status === 'ativo'
    ? { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' }
    : curso.status === 'rascunho'
    ? { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' }
    : { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', border: 'rgba(107,114,128,0.25)' }

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
        <div style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <ArrowLeft size={14} color={C.blue} style={{ cursor: 'pointer' }} onClick={onVoltar} />
          <span onClick={onVoltar} style={{ fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Cursos</span>
          <span style={{ fontSize: '13px', color: C.muted }}>›</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{curso.titulo}</span>
        </div>

        <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>

          {/* Header do curso */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${corCurso}18`, border: `1px solid ${corCurso}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
              {curso.icone ?? '📚'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, background: corStatus.bg, color: corStatus.color, border: `0.5px solid ${corStatus.border}`, borderRadius: '6px', padding: '2px 8px' }}>
                  {statusLabel}
                </span>
                {curso.categoria && (
                  <span style={{ fontSize: '10px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.10)', border: '0.5px solid rgba(26,86,255,0.20)', borderRadius: '6px', padding: '2px 8px' }}>
                    {curso.categoria}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.text, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {curso.titulo}
              </h1>
              <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 8px', lineHeight: 1.5 }}>{curso.subtitulo}</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {curso.instrutor && <span style={{ fontSize: '12px', color: C.muted }}>👤 <strong style={{ color: C.text }}>{curso.instrutor}</strong></span>}
                {curso.carga_horaria && <span style={{ fontSize: '12px', color: C.muted }}>⏱ <strong style={{ color: C.text }}>{curso.carga_horaria}</strong></span>}
                {curso.nota_minima && <span style={{ fontSize: '12px', color: C.muted }}>🎯 Nota mínima: <strong style={{ color: C.text }}>{curso.nota_minima}%</strong></span>}
              </div>
            </div>
            <button
              onClick={() => onVoltar()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: `1.5px solid ${C.blue}`, borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, color: C.blue, cursor: 'pointer', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.blue }}
            >
              <Edit size={13} /> Editar curso
            </button>
          </div>

          {/* Cards de estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { Icon: BookOpen,   val: totalAulas,       label: 'Total de aulas',        cor: C.blue    },
              { Icon: Users,      val: totalAlunos,      label: 'Alunos matriculados',   cor: '#f59e0b' },
              { Icon: Check,      val: totalConcluidos,  label: 'Concluíram o curso',    cor: '#10b981' },
              { Icon: TrendingUp, val: `${progressoMedio}%`, label: 'Progresso médio',  cor: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${s.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.Icon size={18} color={s.cor} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Descrição */}
          {curso.descricao && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: C.muted2, lineHeight: 1.7, margin: 0 }}>{curso.descricao}</p>
            </div>
          )}

          {/* Módulos */}
          {curso.modulos?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 12px' }}>
                Conteúdo do Curso — {curso.modulos.length} módulo{curso.modulos.length !== 1 ? 's' : ''}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {curso.modulos.map((mod: any, idx: number) => {
                  const aberto = modulosAbertos.has(mod.id)
                  const aulas: any[] = mod.aulas ?? []
                  return (
                    <div key={mod.id}>
                      <div
                        onClick={() => toggleModulo(mod.id)}
                        style={{
                          background: C.surface, border: `1px solid ${C.border}`,
                          borderLeft: `4px solid ${corCurso}`,
                          borderRadius: aberto ? '10px 10px 0 0' : '10px',
                          padding: '14px 20px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '16px',
                          transition: 'background 150ms',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = C.surface}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${corCurso}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: corCurso }}>{idx + 1}</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: C.text, flex: 1 }}>{mod.titulo}</span>
                        <span style={{ fontSize: '12px', color: C.muted }}>{aulas.length} aula{aulas.length !== 1 ? 's' : ''}</span>
                        {aberto ? <ChevronUp size={16} color={C.blue} /> : <ChevronDown size={16} color={C.blue} />}
                      </div>

                      {aberto && (
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                          {aulas.map((aula: any, aulaIdx: number) => (
                            <div
                              key={aula.id}
                              style={{
                                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '14px',
                                borderBottom: aulaIdx < aulas.length - 1 ? `1px solid ${C.border}` : 'none',
                                transition: 'background 150ms',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.04)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: aula.video_disponivel ? C.blue : C.surface2, border: `1px solid ${aula.video_disponivel ? C.blue : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {aula.video_disponivel
                                  ? <Play size={10} color="#fff" style={{ marginLeft: '1px' }} />
                                  : <Clock size={10} color={C.muted} />
                                }
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  Aula {aula.ordem ?? aulaIdx + 1} — {aula.titulo}
                                </p>
                                {aula.descricao && (
                                  <p style={{ fontSize: '11px', color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {aula.descricao}
                                  </p>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                {aula.duracao && (
                                  <span style={{ fontSize: '11px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={10} /> {aula.duracao}
                                  </span>
                                )}
                                <span style={{
                                  fontSize: '10px', fontWeight: 600, borderRadius: '6px', padding: '2px 8px',
                                  ...(aula.video_disponivel
                                    ? { background: 'rgba(26,86,255,0.10)', color: C.blue, border: '0.5px solid rgba(26,86,255,0.25)' }
                                    : { background: C.surface2, color: C.muted, border: `0.5px solid ${C.border}` })
                                }}>
                                  {aula.video_disponivel ? 'Vídeo' : 'Em breve'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Questões da prova */}
          {curso.questoes?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '0 0 12px' }}>
                Questões da Prova — {curso.questoes.length} questão{curso.questoes.length !== 1 ? 's' : ''}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {curso.questoes.map((q: any, i: number) => (
                  <div key={q.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: 0, flex: 1 }}>
                        {i + 1}. {q.enunciado}
                      </p>
                      <button
                        onClick={() => setQuestaoEditando({
                          id:           q.id,
                          enunciado:    q.enunciado,
                          alternativas: {
                            A: q.alternativas?.A ?? '',
                            B: q.alternativas?.B ?? '',
                            C: q.alternativas?.C ?? '',
                            D: q.alternativas?.D ?? '',
                          },
                          gabarito:   q.gabarito ?? 'A',
                          explicacao: q.explicacao ?? '',
                        })}
                        title="Editar questão"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '4px 8px', fontSize: '11px', color: C.muted, cursor: 'pointer', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                      >
                        <Pencil size={11} /> Editar
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {(['A', 'B', 'C', 'D'] as const).map(letra => {
                        const op = q.alternativas?.[letra]
                        if (!op) return null
                        const certa = q.gabarito === letra
                        return (
                          <div key={letra} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '6px', background: certa ? 'rgba(16,185,129,0.08)' : 'transparent', border: certa ? '0.5px solid rgba(16,185,129,0.25)' : '0.5px solid transparent' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: certa ? '#10b981' : C.muted, minWidth: '16px' }}>{letra})</span>
                            <span style={{ fontSize: '12px', color: certa ? C.text : C.muted2 }}>{op}</span>
                            {certa && <Check size={12} color="#10b981" style={{ marginLeft: 'auto' }} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal de edição de questão */}
      {questaoEditando && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) setQuestaoEditando(null) }}
        >
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 20px' }}>Editar Questão</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.muted, marginBottom: '6px' }}>Enunciado</label>
              <textarea
                value={questaoEditando.enunciado}
                onChange={e => setQuestaoEditando(prev => prev ? { ...prev, enunciado: e.target.value } : null)}
                rows={3}
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: C.text, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            {(['A', 'B', 'C', 'D'] as const).map(letra => (
              <div key={letra} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.muted, marginBottom: '4px' }}>{letra})</label>
                <input
                  type="text"
                  value={questaoEditando.alternativas[letra]}
                  onChange={e => setQuestaoEditando(prev => prev ? { ...prev, alternativas: { ...prev.alternativas, [letra]: e.target.value } } : null)}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', color: C.text, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.muted, marginBottom: '6px' }}>Resposta correta</label>
              <select
                value={questaoEditando.gabarito}
                onChange={e => setQuestaoEditando(prev => prev ? { ...prev, gabarito: e.target.value } : null)}
                style={{ padding: '8px 12px', fontSize: '13px', color: C.text, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {['A', 'B', 'C', 'D'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: C.muted, marginBottom: '6px' }}>
                Explicação <span style={{ fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                value={questaoEditando.explicacao}
                onChange={e => setQuestaoEditando(prev => prev ? { ...prev, explicacao: e.target.value } : null)}
                rows={2}
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', color: C.text, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setQuestaoEditando(null)}
                disabled={salvandoQuestao}
                style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, color: C.muted, background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarQuestao}
                disabled={salvandoQuestao}
                style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, color: '#fff', background: salvandoQuestao ? C.muted : C.blue, border: 'none', borderRadius: '8px', cursor: salvandoQuestao ? 'not-allowed' : 'pointer' }}
              >
                {salvandoQuestao ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  )
}
