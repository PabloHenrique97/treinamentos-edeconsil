import { useState, useEffect } from 'react'
import { Pencil, X, Save, RefreshCw, AlertCircle } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutorAPI, turmasAPI } from '../../services/api'

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

export function TurmaInstrutor() {
  const { C } = useTheme()
  const [turma, setTurma] = useState<Turma | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({
    nome: '', cargo_grupo: '', setor: '', responsavel: '',
    icone: '🏢', cor: '#0d2550', status: 'ativa',
  })

  useEffect(() => {
    instrutorAPI.minhaTurma()
      .then((t: Turma) => {
        setTurma(t)
        if (t) setForm({
          nome:         t.nome         || '',
          cargo_grupo:  t.cargo_grupo  || '',
          setor:        t.setor        || '',
          responsavel:  t.responsavel  || '',
          icone:        t.icone        || '🏢',
          cor:          t.cor          || '#0d2550',
          status:       t.status       || 'ativa',
        })
      })
      .catch(() => setErro('Não foi possível carregar a turma.'))
      .finally(() => setCarregando(false))
  }, [])

  async function salvar() {
    if (!turma) return
    setSalvando(true)
    try {
      await turmasAPI.atualizar(turma.id, { ...form, instrutor_id: turma.instrutor_id })
      setTurma({ ...turma, ...form })
      setModalAberto(false)
    } catch {
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCw size={24} color={C.blue} style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (erro || !turma) return (
    <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
      <AlertCircle size={40} color={C.muted} />
      <div style={{ fontSize: '18px', fontWeight: 600, color: C.text }}>
        {erro || 'Nenhuma turma vinculada'}
      </div>
      <div style={{ fontSize: '14px', color: C.muted, maxWidth: '360px' }}>
        Entre em contato com o administrador para vincular uma turma à sua conta.
      </div>
    </div>
  )

  return (
    <div style={{ padding: '32px', maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: 0 }}>Minha Turma</h1>
          <p style={{ fontSize: '13px', color: C.muted, margin: '4px 0 0' }}>Detalhes e edição da sua turma</p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', background: C.blue, color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
          }}
        >
          <Pencil size={14} /> Editar
        </button>
      </div>

      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '16px',
            background: `${turma.cor || '#1a56ff'}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px',
          }}>
            {turma.icone || '🏢'}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
              {turma.cargo_grupo || turma.nome}
            </h2>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
              background: turma.status === 'ativa' ? '#10b98118' : '#6b728018',
              color: turma.status === 'ativa' ? '#10b981' : C.muted,
              border: `1px solid ${turma.status === 'ativa' ? '#10b98133' : '#6b728033'}`,
              textTransform: 'uppercase' as const,
            }}>
              {turma.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {[
            { label: 'Nome interno', valor: turma.nome },
            { label: 'Cargo / Grupo', valor: turma.cargo_grupo },
            { label: 'Setor', valor: turma.setor },
            { label: 'Responsável', valor: turma.responsavel },
            { label: 'Alunos ativos', valor: String(turma.total_alunos) },
            { label: 'Cursos vinculados', valor: String(turma.total_cursos) },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '15px', color: C.text }}>{item.valor || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal editar */}
      {modalAberto && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '500px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: C.text }}>Editar Turma</h3>
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} color={C.muted} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {([ ['nome', 'Nome Interno'], ['cargo_grupo', 'Cargo / Grupo'], ['setor', 'Setor'], ['responsavel', 'Responsável'] ] as const).map(([campo, label]) => (
                <div key={campo}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase' as const }}>
                    {label}
                  </label>
                  <input
                    value={form[campo]}
                    onChange={e => setForm(f => ({ ...f, [campo]: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: '8px', padding: '10px 12px',
                      color: C.text, fontSize: '14px', outline: 'none',
                    }}
                  />
                </div>
              ))}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase' as const }}>
                    Ícone
                  </label>
                  <input
                    value={form.icone}
                    onChange={e => setForm(f => ({ ...f, icone: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: '8px', padding: '10px 12px',
                      color: C.text, fontSize: '20px', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase' as const }}>
                    Cor
                  </label>
                  <input
                    type="color"
                    value={form.cor}
                    onChange={e => setForm(f => ({ ...f, cor: e.target.value }))}
                    style={{
                      width: '100%', height: '42px', boxSizing: 'border-box',
                      background: C.bg, border: `1px solid ${C.border}`,
                      borderRadius: '8px', cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase' as const }}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{
                    width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                    borderRadius: '8px', padding: '10px 12px',
                    color: C.text, fontSize: '14px', outline: 'none',
                  }}
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalAberto(false)}
                style={{
                  padding: '10px 18px', background: 'transparent',
                  border: `1px solid ${C.border}`, borderRadius: '8px',
                  color: C.muted, cursor: 'pointer', fontSize: '13px',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px', background: C.blue, color: '#fff',
                  border: 'none', borderRadius: '8px', cursor: salvando ? 'not-allowed' : 'pointer',
                  fontSize: '13px', fontWeight: 600, opacity: salvando ? 0.7 : 1,
                }}
              >
                <Save size={14} /> {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
