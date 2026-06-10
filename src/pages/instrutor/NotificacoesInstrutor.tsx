import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI, notificacoesAPI, usuariosAPI } from '../../services/api'

const TIPO_CFG: Record<string, { label: string; icone: string; cor: string; bg: string }> = {
  curso_concluido:     { label: 'Curso Concluído', icone: '🎓', cor: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
  certificado_emitido: { label: 'Certificado',     icone: '🏆', cor: '#1a56ff', bg: 'rgba(26,86,255,0.10)'   },
  reprovado:           { label: 'Reprovado',       icone: '❌', cor: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
  aluno_concluiu:      { label: 'Aluno Concluiu',  icone: '⭐', cor: '#d97706', bg: 'rgba(245,196,0,0.14)'   },
}

const FILTROS = [
  { value: 'todos',               label: 'Todos'           },
  { value: 'aluno_concluiu',      label: 'Aluno Concluiu'  },
  { value: 'curso_concluido',     label: 'Curso Concluído' },
  { value: 'certificado_emitido', label: 'Certificado'     },
  { value: 'reprovado',           label: 'Reprovado'       },
]

function tipoCfg(tipo: string) {
  return TIPO_CFG[tipo] ?? { label: tipo, icone: '🔔', cor: '#6b7280', bg: 'rgba(107,114,128,0.10)' }
}

function formatarData(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function NotificacoesInstrutor() {
  const { C } = useTheme()

  const [alunoIds, setAlunoIds] = useState<Set<string>>(new Set())
  const [todasNotif, setTodasNotif] = useState<any[]>([])
  const [notificacoes, setNotificacoes] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const LIMITE = 30

  const aplicarFiltro = useCallback((lista: any[], tipo: string, ids: Set<string>, pag: number) => {
    let filtrado = lista.filter((n: any) => ids.size === 0 || ids.has(String(n.usuario_id)))
    if (tipo !== 'todos') filtrado = filtrado.filter((n: any) => n.tipo === tipo)
    setTotal(filtrado.length)
    const inicio = (pag - 1) * LIMITE
    setNotificacoes(filtrado.slice(inicio, inicio + LIMITE))
    setPagina(pag)
  }, [LIMITE])

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const turma = await instrutorAPI.minhaTurma() as any
      let ids = new Set<string>()

      if (turma?.id) {
        try {
          const alunosData = await usuariosAPI.listar({ turma_id: String(turma.id), perfil: 'colaborador', limite: '500' }) as any
          const lista: any[] = Array.isArray(alunosData) ? alunosData : (alunosData?.usuarios ?? [])
          ids = new Set(lista.map((a: any) => String(a.id)))
          setAlunoIds(ids)
        } catch { /* usa lista vazia */ }
      }

      const data = await notificacoesAPI.adminHistorico({ tipo: 'todos', pagina: 1, limite: 500 }) as any
      const todas = data.notificacoes ?? []
      setTodasNotif(todas)
      aplicarFiltro(todas, filtroTipo, ids, 1)
    } catch {
      setErro('Erro ao carregar notificações.')
    } finally {
      setCarregando(false)
    }
  }, [filtroTipo, aplicarFiltro])

  useEffect(() => { carregar() }, [])

  useEffect(() => {
    if (todasNotif.length > 0) {
      aplicarFiltro(todasNotif, filtroTipo, alunoIds, 1)
    }
  }, [filtroTipo])

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE))

  return (
    <div style={{ padding: '28px 24px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
            Notificações da Turma
          </h1>
          <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
            {carregando ? '…' : `${total} evento${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={carregar}
          disabled={carregando}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'none',
            border: `1px solid ${C.border}`, borderRadius: '8px',
            fontSize: '12px', color: C.muted, cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} style={{ animation: carregando ? 'spin 0.8s linear infinite' : 'none' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const ativo = filtroTipo === f.value
          return (
            <button
              key={f.value}
              onClick={() => setFiltroTipo(f.value)}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px',
                fontWeight: ativo ? 700 : 500, cursor: 'pointer',
                background: ativo ? C.blue : C.surface,
                color: ativo ? '#fff' : C.muted,
                border: `1px solid ${ativo ? C.blue : C.border}`,
                transition: 'all 150ms',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Erro */}
      {erro && (
        <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          ⚠️ {erro}
          <button onClick={carregar} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Tabela */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: (C as any).surface2 ?? C.surface }}>
              {['Tipo', 'Aluno', 'Mensagem', 'Data', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: C.muted, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ width: '24px', height: '24px', margin: '0 auto 10px', border: `3px solid ${C.border}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Carregando...</p>
                </td>
              </tr>
            ) : notificacoes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '56px', textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔔</div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: '0 0 4px' }}>
                    Nenhuma notificação encontrada
                  </p>
                  <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>
                    {filtroTipo !== 'todos' ? 'Tente outro filtro.' : 'Os eventos dos alunos da turma aparecerão aqui.'}
                  </p>
                </td>
              </tr>
            ) : notificacoes.map((n, idx) => {
              const cfg = tipoCfg(n.tipo)
              return (
                <tr key={n.id} style={{ borderBottom: idx < notificacoes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: cfg.bg, color: cfg.cor, border: `1px solid ${cfg.cor}33` }}>
                      {cfg.icone} {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {n.usuario_nome ? (
                      <>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{n.usuario_nome}</p>
                        {n.usuario_setor && <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{n.usuario_setor}</p>}
                      </>
                    ) : (
                      <span style={{ fontSize: '12px', color: C.muted }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '300px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.titulo}</p>
                    {n.mensagem && <p style={{ fontSize: '11px', color: C.muted, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.mensagem}</p>}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', fontSize: '12px', color: C.muted }}>
                    {formatarData(n.criado_em)}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: n.lida ? 'rgba(107,114,128,0.10)' : 'rgba(26,86,255,0.10)', color: n.lida ? '#6b7280' : '#1a56ff', border: `1px solid ${n.lida ? 'rgba(107,114,128,0.20)' : 'rgba(26,86,255,0.20)'}` }}>
                      {n.lida ? 'Lida' : 'Não lida'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => aplicarFiltro(todasNotif, filtroTipo, alunoIds, pagina - 1)}
            disabled={pagina <= 1}
            style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '13px', cursor: pagina <= 1 ? 'not-allowed' : 'pointer', color: pagina <= 1 ? C.muted : C.text }}
          >
            ← Anterior
          </button>
          <span style={{ fontSize: '13px', color: C.muted }}>
            Página <strong style={{ color: C.text }}>{pagina}</strong> de {totalPaginas}
          </span>
          <button
            onClick={() => aplicarFiltro(todasNotif, filtroTipo, alunoIds, pagina + 1)}
            disabled={pagina >= totalPaginas}
            style={{ padding: '8px 16px', background: C.blue, border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#fff', opacity: pagina >= totalPaginas ? 0.5 : 1 }}
          >
            Próxima →
          </button>
        </div>
      )}

    </div>
  )
}
