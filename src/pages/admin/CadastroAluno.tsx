import { useState } from 'react'
import { usuariosAPI } from '../../services/api'
import { useTheme } from '../../contexts/ThemeContext'

interface CadastroAlunoProps {
  onFechar: () => void
  onSucesso: (usuario: any) => void
}

const TURMAS = [
  'Coordenação de Suprimentos',
  'Recursos Humanos',
  'Segurança do Trabalho',
  'Serviços Gerais',
  'Comunicação',
  'Engenharia',
  'Manutenções - Oficina',
  'Tecnologia da Informação',
]

export function CadastroAluno({ onFechar, onSucesso }: CadastroAlunoProps) {
  const { C } = useTheme()
  const [form, setForm] = useState({
    nome: '', cpf: '', data_nascimento: '',
    matricula: '', cargo: '', setor: '',
    centro_custo: '', ramal: '', celular: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro]         = useState('')
  const [sucesso, setSucesso]   = useState<any>(null)

  const set = (key: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const handleSalvar = async () => {
    setErro('')
    const cpfLimpo = form.cpf.replace(/\D/g, '')
    if (!form.nome.trim())     { setErro('Nome é obrigatório'); return }
    if (cpfLimpo.length !== 11){ setErro('CPF deve ter 11 dígitos'); return }
    if (!form.data_nascimento) { setErro('Data de nascimento é obrigatória'); return }
    if (!form.cargo)           { setErro('Selecione a turma'); return }

    setSalvando(true)
    try {
      const resultado = await usuariosAPI.criar({ ...form, cpf: cpfLimpo }) as any
      setSucesso(resultado)
      onSucesso(resultado.usuario)
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao cadastrar aluno')
    } finally {
      setSalvando(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', background: C.surface2,
    border: `1px solid ${C.border}`, borderRadius: '8px',
    fontSize: '13px', color: C.text, outline: 'none',
  }

  const Campo = ({
    label, field, type = 'text', placeholder = '', required = false,
  }: { label: string; field: keyof typeof form; type?: string; placeholder?: string; required?: boolean }) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = C.blue)}
        onBlur={e  => (e.target.style.borderColor = C.border)}
      />
    </div>
  )

  if (sucesso) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
          Aluno cadastrado com sucesso!
        </h3>
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '16px', margin: '16px 0', textAlign: 'left' }}>
          <p style={{ fontSize: '13px', color: C.text, margin: '0 0 6px' }}><strong>Nome:</strong> {sucesso.usuario.nome}</p>
          <p style={{ fontSize: '13px', color: C.text, margin: '0 0 6px' }}><strong>CPF:</strong> {sucesso.usuario.cpf}</p>
          <p style={{ fontSize: '13px', color: C.text, margin: '0 0 6px' }}><strong>Turma:</strong> {sucesso.usuario.cargo}</p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: C.blue, margin: 0 }}><strong>Senha inicial:</strong> {sucesso.senha_inicial}</p>
          <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>{sucesso.instrucoes}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => { setSucesso(null); setForm({ nome: '', cpf: '', data_nascimento: '', matricula: '', cargo: '', setor: '', centro_custo: '', ramal: '', celular: '' }) }}
            style={{ padding: '10px 20px', background: C.blue, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
          >
            Cadastrar outro
          </button>
          <button
            onClick={onFechar}
            style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {erro && (
        <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ef4444', marginBottom: '14px' }}>
          ⚠️ {erro}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Campo label="Nome completo" field="nome" placeholder="Nome do colaborador" required />
        </div>
        <Campo label="CPF (apenas números)" field="cpf" placeholder="00000000000" required />
        <Campo label="Data de nascimento" field="data_nascimento" type="date" required />
        <Campo label="Matrícula" field="matricula" placeholder="Ex: MAT-001" />
        <div style={{ gridColumn: '1/-1', marginBottom: '14px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: C.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Turma / Cargo <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={form.cargo}
            onChange={e => set('cargo', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer', color: form.cargo ? C.text : C.muted }}
          >
            <option value="">Selecione a turma</option>
            {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Campo label="Setor" field="setor" placeholder="Setor do colaborador" />
        <Campo label="Ramal" field="ramal" placeholder="Ex: 1234" />
        <Campo label="Celular" field="celular" placeholder="Ex: 85999999999" />
        <div style={{ gridColumn: '1/-1' }}>
          <Campo label="Centro de custo" field="centro_custo" placeholder="Ex: CC-001" />
        </div>
      </div>

      <div style={{ background: 'rgba(26,86,255,0.06)', border: '1px solid rgba(26,86,255,0.20)', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
        <p style={{ fontSize: '12px', color: C.blue, margin: 0, fontWeight: 600 }}>
          💡 Senha inicial gerada automaticamente
        </p>
        <p style={{ fontSize: '12px', color: C.muted, margin: '4px 0 0' }}>
          A senha será a data de nascimento no formato DDMMAAAA. Matrículas nos cursos da turma são criadas automaticamente.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onFechar}
          style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>
          Cancelar
        </button>
        <button onClick={handleSalvar} disabled={salvando}
          style={{ padding: '10px 24px', background: C.blue, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.7 : 1, fontFamily: "'Inter',sans-serif" }}>
          {salvando ? 'Cadastrando...' : '✓ Cadastrar aluno'}
        </button>
      </div>
    </div>
  )
}
