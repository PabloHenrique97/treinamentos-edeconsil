import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { instrutoresAPI } from '../../services/api'

const TURMAS = [
  'Coordenação de Suprimentos',
  'Recursos Humanos',
  'Segurança do Trabalho',
  'Serviços Gerais',
  'Comunicação',
  'Engenharia',
  'Manutenções - Oficina',
  'Tecnologia da Informação',
  'Coordenação de Pessoal',
  'Coordenação de Qualidade',
  'Gerência Financeira',
  'Gerência Jurídica e Compliance',
  'Gerência de Auditoria',
  'Gerência de Controladoria',
  'Gerência de Gestão de Pessoas',
  'Saúde Ocupacional',
  'Patrimônio',
]

interface EditarInstrutorProps {
  instrutor?: any
  onFechar:   () => void
  onSucesso:  (instrutor: any) => void
}

export function EditarInstrutor({ instrutor, onFechar, onSucesso }: EditarInstrutorProps) {
  const { C } = useTheme()
  const ehEdicao = !!instrutor

  const [nome,          setNome]          = useState('')
  const [email,         setEmail]         = useState('')
  const [telefone,      setTelefone]      = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [bio,           setBio]           = useState('')
  const [status,        setStatus]        = useState('ativo')
  const [salvando,      setSalvando]      = useState(false)
  const [erro,          setErro]          = useState('')
  const [sucesso,       setSucesso]       = useState(false)

  useEffect(() => {
    if (!instrutor) return
    setNome(instrutor.nome                ?? '')
    setEmail(instrutor.email              ?? '')
    setTelefone(instrutor.telefone        ?? '')
    setEspecialidade(instrutor.especialidade ?? '')
    setBio(instrutor.bio                  ?? '')
    setStatus(instrutor.status            ?? 'ativo')
  }, [instrutor])

  const stopKeys = useCallback((e: React.KeyboardEvent) => e.stopPropagation(), [])

  const handleSalvar = async () => {
    setErro('')
    if (!nome.trim())          { setErro('Nome é obrigatório.'); return }
    if (!especialidade.trim()) { setErro('Selecione a Especialidade / Turma.'); return }
    setSalvando(true)
    try {
      const payload = {
        nome:          nome.trim(),
        email:         email.trim()         || null,
        telefone:      telefone.trim()      || null,
        especialidade: especialidade.trim() || null,
        bio:           bio.trim()           || null,
        status,
      }
      const resultado = ehEdicao
        ? await instrutoresAPI.atualizar(instrutor.id, payload) as any
        : await instrutoresAPI.criar(payload) as any
      setSucesso(true)
      onSucesso(resultado.instrutor)
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px',
    background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    fontSize: '13px', color: C.text,
    outline: 'none', fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: C.muted,
    display: 'block', marginBottom: '5px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  }
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = C.blue)
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = C.border)

  if (sucesso) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
          Instrutor {ehEdicao ? 'atualizado' : 'cadastrado'} com sucesso!
        </h3>
        <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 24px' }}>
          Os dados de <strong style={{ color: C.text }}>{nome}</strong> foram salvos.
        </p>
        <button onClick={onFechar} style={{
          padding: '10px 28px', background: C.blue, border: 'none',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700,
          color: '#fff', cursor: 'pointer',
        }}>
          Fechar
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {erro && (
        <div style={{
          background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '8px', padding: '10px 14px',
          fontSize: '13px', color: '#ef4444', marginBottom: '16px',
        }}>
          ⚠️ {erro}
        </div>
      )}

      {/* Nome */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>
          Nome completo <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text" value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
          placeholder="Nome do instrutor"
          style={inputStyle} autoComplete="off"
        />
      </div>

      {/* Email + Telefone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            placeholder="email@edeconsil.com.br"
            style={inputStyle} autoComplete="off"
          />
        </div>
        <div>
          <label style={labelStyle}>Telefone</label>
          <input
            type="text" value={telefone}
            onChange={e => setTelefone(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            placeholder="Ex: 98999999999"
            style={inputStyle} autoComplete="off"
          />
        </div>
      </div>

      {/* Especialidade + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>
            Turma / Especialidade <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={especialidade}
            onChange={e => setEspecialidade(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">Selecione uma turma...</option>
            {TURMAS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Biografia / Descrição</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
          placeholder="Descreva a experiência e formação do instrutor..."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
        />
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onFechar} style={{
          padding: '10px 20px', background: 'none',
          border: `1.5px solid ${C.border}`, borderRadius: '8px',
          fontSize: '13px', color: C.text, cursor: 'pointer',
        }}>
          Cancelar
        </button>
        <button onClick={handleSalvar} disabled={salvando} style={{
          padding: '10px 24px', background: C.blue, border: 'none',
          borderRadius: '8px', fontSize: '13px', fontWeight: 700,
          color: '#fff', cursor: salvando ? 'not-allowed' : 'pointer',
          opacity: salvando ? 0.7 : 1,
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {salvando ? (
            <>
              <div style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Salvando...
            </>
          ) : `✓ ${ehEdicao ? 'Salvar alterações' : 'Cadastrar instrutor'}`}
        </button>
      </div>
    </div>
  )
}
