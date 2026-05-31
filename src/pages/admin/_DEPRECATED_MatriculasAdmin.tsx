import { useState, useMemo } from 'react'
import {
  Plus, Search, Filter, ChevronDown,
  ChevronLeft, ChevronRight, Eye, Edit,
  Trash2, Upload, Camera, Check,
  Users, UserCheck, UserX, Clock,
  Mail, Download, User
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

interface Colaborador {
  id: string
  nome: string
  email: string
  matricula: string
  observacoes: string
  celular: string
  ramalInterfone: string
  cargo: string
  setor: string
  dataAdmissao: string
  status: 'Ativo' | 'Inativo' | 'Pendente'
  foto: null
}

const colaboradoresMock: Colaborador[] = [
  { id:'1000001', nome:'João Silva Santos',        email:'joaosilva@edeconsil.com.br',       matricula:'MAT-001', observacoes:'',                  celular:'+55 98 99201-3456', ramalInterfone:'101', cargo:'Operador de Escavadeira',   setor:'Terraplanagem',          dataAdmissao:'15/03/2022', status:'Ativo',    foto:null },
  { id:'1000002', nome:'Maria Santos Oliveira',    email:'mariasantos@edeconsil.com.br',     matricula:'MAT-002', observacoes:'Turno noturno',       celular:'+55 98 99312-4567', ramalInterfone:'102', cargo:'Engenheira de Obras',       setor:'Obras e Infraestrutura', dataAdmissao:'01/06/2021', status:'Ativo',    foto:null },
  { id:'1000003', nome:'Carlos Eduardo Mendes',    email:'carloseduardo@edeconsil.com.br',   matricula:'MAT-003', observacoes:'',                  celular:'+55 98 99423-5678', ramalInterfone:'103', cargo:'Técnico de Segurança',      setor:'Segurança do Trabalho',  dataAdmissao:'10/09/2020', status:'Ativo',    foto:null },
  { id:'1000004', nome:'Ana Paula Rodrigues',      email:'anapaula@edeconsil.com.br',        matricula:'MAT-004', observacoes:'Horário flexível',    celular:'+55 98 99534-6789', ramalInterfone:'104', cargo:'Assistente Administrativa', setor:'Administrativo',         dataAdmissao:'05/01/2023', status:'Ativo',    foto:null },
  { id:'1000005', nome:'Marcos Vinicius Lima',     email:'marcosvinicius@edeconsil.com.br',  matricula:'MAT-005', observacoes:'',                  celular:'+55 98 99645-7890', ramalInterfone:'105', cargo:'Encarregado de Obras',      setor:'Obras e Infraestrutura', dataAdmissao:'20/07/2019', status:'Ativo',    foto:null },
  { id:'1000006', nome:'Juliana Ferreira Costa',   email:'julianaferreira@edeconsil.com.br', matricula:'MAT-006', observacoes:'',                  celular:'+55 98 99756-8901', ramalInterfone:'106', cargo:'Coordenadora de QSMS',      setor:'Segurança do Trabalho',  dataAdmissao:'12/04/2022', status:'Ativo',    foto:null },
  { id:'1000007', nome:'Roberto Silva Pereira',    email:'robertosilva@edeconsil.com.br',    matricula:'MAT-007', observacoes:'Em férias até 30/06', celular:'+55 98 99867-9012', ramalInterfone:'107', cargo:'Motorista',                setor:'Terraplanagem',          dataAdmissao:'08/11/2020', status:'Ativo',    foto:null },
  { id:'1000008', nome:'Pedro Almeida Souza',      email:'pedroalmeida@edeconsil.com.br',    matricula:'MAT-008', observacoes:'Afastado INSS',       celular:'+55 98 99978-0123', ramalInterfone:'108', cargo:'Auxiliar de Serviços',      setor:'Administrativo',         dataAdmissao:'03/03/2021', status:'Inativo',  foto:null },
  { id:'1000009', nome:'Lucas Ferreira Nunes',     email:'lucasferreira@edeconsil.com.br',   matricula:'MAT-009', observacoes:'',                  celular:'+55 98 98089-1234', ramalInterfone:'109', cargo:'Operador de Máquinas',      setor:'Equipamentos',           dataAdmissao:'17/08/2022', status:'Ativo',    foto:null },
  { id:'1000010', nome:'Fernanda Lima Castro',     email:'fernandalima@edeconsil.com.br',    matricula:'MAT-010', observacoes:'',                  celular:'+55 98 98190-2345', ramalInterfone:'110', cargo:'Engenheira Ambiental',      setor:'Obras e Infraestrutura', dataAdmissao:'22/02/2023', status:'Pendente', foto:null },
]

const setores = [
  'Obras e Infraestrutura', 'Gestão e Suprimentos', 'Terraplanagem',
  'Pavimentação', 'Equipamentos', 'Segurança do Trabalho',
  'Administrativo', 'Manutenção Elétrica', 'Manutenção Mecânica',
]

const cargos = [
  'Engenheiro Civil', 'Engenheira de Obras', 'Engenheira Ambiental',
  'Técnico de Segurança', 'Técnica de Segurança', 'Operador de Escavadeira',
  'Operador de Máquinas', 'Encarregado de Obras', 'Motorista',
  'Assistente Administrativa', 'Auxiliar de Serviços', 'Coordenadora de QSMS',
  'Topógrafo', 'Eletricista', 'Mecânico de Equipamentos', 'Outro',
]

const abasFormulario = [
  'Geral', 'Informações Adicionais', 'Documentos', 'Grupos e Empresas',
  'Senhas', 'Cartões', 'Digitais', 'Facial', 'QR Code',
  'Cadastro Remoto', 'Veículos', 'Vagas', 'iDLock',
]

const ITENS_POR_PAGINA = 10

const coresAvatar = ['#1a56ff', '#10b981', '#8b5cf6', '#f59e0b', '#db2777', '#059669', '#0891b2', '#dc2626', '#7c3aed', '#d97706']

function gerarId() {
  return `100${Math.floor(Math.random() * 9000 + 1000)}`
}

function getIniciais(nome: string) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function corAvatar(id: string) {
  return coresAvatar[parseInt(id.slice(-1)) % coresAvatar.length]
}

function corStatus(s: string) {
  return ({
    'Ativo':    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    'Inativo':  { color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)'  },
    'Pendente': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  } as Record<string, { color: string; bg: string; border: string }>)[s] ?? { color: '#6b7280', bg: 'transparent', border: '#6b7280' }
}

type FormState = {
  nome: string; email: string; matricula: string; id: string
  observacoes: string; celular: string; ramalInterfone: string
  cargo: string; setor: string; dataAdmissao: string
  status: 'Ativo' | 'Inativo' | 'Pendente'
}

function formVazio(): FormState {
  return {
    nome: '', email: '', matricula: '', id: gerarId(),
    observacoes: '', celular: '', ramalInterfone: '',
    cargo: '', setor: '', dataAdmissao: '', status: 'Ativo',
  }
}

export function MatriculasAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()

  const [busca, setBusca] = useState('')
  const [setorFiltro, setSetorFiltro] = useState('Todos os setores')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [paginaAtual, setPaginaAtual] = useState(1)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('Geral')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(formVazio)

  const setF = (patch: Partial<FormState>) => setForm(f => ({ ...f, ...patch }))

  const resetForm = () => {
    setForm(formVazio())
    setAbaAtiva('Geral')
    setEditandoId(null)
  }

  const abrirFormulario = (col?: Colaborador) => {
    if (col) {
      setForm({
        nome: col.nome, email: col.email, matricula: col.matricula,
        id: col.id, observacoes: col.observacoes, celular: col.celular,
        ramalInterfone: col.ramalInterfone, cargo: col.cargo,
        setor: col.setor, dataAdmissao: col.dataAdmissao, status: col.status,
      })
      setEditandoId(col.id)
    } else {
      resetForm()
    }
    setMostrarFormulario(true)
    setAbaAtiva('Geral')
  }

  const fecharFormulario = () => { setMostrarFormulario(false); resetForm() }

  const colaboradoresFiltrados = useMemo(() => {
    return colaboradoresMock.filter(c => {
      const matchBusca  = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
                          c.email.toLowerCase().includes(busca.toLowerCase()) ||
                          c.matricula.toLowerCase().includes(busca.toLowerCase())
      const matchSetor  = setorFiltro === 'Todos os setores' || c.setor === setorFiltro
      const matchStatus = statusFiltro === 'Todos' || c.status === statusFiltro
      return matchBusca && matchSetor && matchStatus
    })
  }, [busca, setorFiltro, statusFiltro])

  const totalPaginas = Math.ceil(colaboradoresFiltrados.length / ITENS_POR_PAGINA)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const colsPagina = colaboradoresFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const totalAtivos    = colaboradoresMock.filter(c => c.status === 'Ativo').length
  const totalInativos  = colaboradoresMock.filter(c => c.status === 'Inativo').length
  const totalPendentes = colaboradoresMock.filter(c => c.status === 'Pendente').length

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const,
    padding: '10px 14px', background: C.surface2,
    border: `1px solid ${C.border}`, borderRadius: '8px',
    fontSize: '13px', color: C.text, outline: 'none',
  }

  // ── FORMULÁRIO ──
  if (mostrarFormulario) {
    return (
      <LayoutAdmin
        paginaAtiva="matriculasAdmin"
        onNavigate={onNavigate}
        onLogout={onLogout}
        topbarTitulo={editandoId ? 'Editar Colaborador' : 'Adicionar Nova Pessoa'}
        topbarSubtitulo="Preencha os dados do colaborador nos campos abaixo."
      >
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={fecharFormulario} style={{ fontSize: '13px', color: C.blue, cursor: 'pointer', fontWeight: 500 }}>
              Matrículas
            </span>
            <span style={{ fontSize: '13px', color: C.muted }}>›</span>
            <span style={{ fontSize: '13px', color: C.text, fontWeight: 600 }}>
              {editandoId ? 'Editar Colaborador' : 'Adicionar Nova Pessoa'}
            </span>
          </div>

          {/* Card do formulário */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden' }}>

            {/* Título */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: 0 }}>
                {editandoId ? 'Editar Colaborador' : 'Adicionar Nova Pessoa'}
              </h2>
            </div>

            {/* Corpo */}
            <div style={{ padding: '28px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px', alignItems: 'start' }}>

                {/* Coluna esquerda — avatar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '160px', height: '160px', borderRadius: '50%',
                    background: C.surface2, border: `2px dashed ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {form.nome ? (
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `${C.blue}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 700, color: C.blue }}>
                        {getIniciais(form.nome)}
                      </div>
                    ) : (
                      <User size={52} color={C.muted} strokeWidth={1.2} />
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { icon: Upload, cor: C.blue,    title: 'Upload foto'  },
                      { icon: Camera, cor: '#10b981', title: 'Câmera'       },
                      { icon: Check,  cor: '#6b7280', title: 'Confirmar'    },
                      { icon: Trash2, cor: '#ef4444', title: 'Remover foto' },
                    ].map((btn, i) => (
                      <button
                        key={i}
                        title={btn.title}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'none', border: `1.5px solid ${btn.cor}`, color: btn.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 150ms' }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${btn.cor}15` }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                      >
                        <btn.icon size={15} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coluna direita — campos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                  {/* Nome */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>
                      Nome <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      value={form.nome}
                      onChange={e => setF({ nome: e.target.value })}
                      placeholder="Nome completo"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>
                      E-mail <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      value={form.email}
                      onChange={e => setF({ email: e.target.value })}
                      placeholder="email@edeconsil.com.br"
                      type="email"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Matrícula */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Matrícula</label>
                    <input
                      value={form.matricula}
                      onChange={e => setF({ matricula: e.target.value })}
                      placeholder="MAT-000"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* ID readonly */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>ID</label>
                    <input
                      value={form.id}
                      readOnly
                      style={{ ...inputStyle, color: C.muted, cursor: 'not-allowed' }}
                    />
                  </div>

                  {/* Observações */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Observações</label>
                    <input
                      value={form.observacoes}
                      onChange={e => setF({ observacoes: e.target.value })}
                      placeholder="Observações gerais"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Celular */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Número de Celular</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '16px' }}>🇧🇷</span>
                        <ChevronDown size={12} color={C.muted} />
                        <span style={{ fontSize: '12px', color: C.muted }}>+55</span>
                      </div>
                      <input
                        value={form.celular}
                        onChange={e => setF({ celular: e.target.value })}
                        placeholder="(00) 00000-0000"
                        style={{ flex: 1, padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = C.blue}
                        onBlur={e => e.target.style.borderColor = C.border}
                      />
                    </div>
                  </div>

                  {/* Ramal — meia largura via inline */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Ramal Interfone</label>
                    <input
                      value={form.ramalInterfone}
                      onChange={e => setF({ ramalInterfone: e.target.value })}
                      placeholder="Ramal Interfone"
                      style={{ ...inputStyle, width: '48%' }}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>
                      Cargo <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={form.cargo}
                        onChange={e => setF({ cargo: e.target.value })}
                        style={{ appearance: 'none', width: '100%', padding: '10px 36px 10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: form.cargo ? C.text : C.muted, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="">Selecione o cargo</option>
                        {cargos.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Setor */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>
                      Setor <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={form.setor}
                        onChange={e => setF({ setor: e.target.value })}
                        style={{ appearance: 'none', width: '100%', padding: '10px 36px 10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: form.setor ? C.text : C.muted, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="">Selecione o setor</option>
                        {setores.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                  {/* Data de admissão */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Data de Admissão</label>
                    <input
                      type="date"
                      value={form.dataAdmissao}
                      onChange={e => setF({ dataAdmissao: e.target.value })}
                      style={{ ...inputStyle, colorScheme: 'dark' }}
                      onFocus={e => e.target.style.borderColor = C.blue}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px' }}>Status</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={form.status}
                        onChange={e => setF({ status: e.target.value as FormState['status'] })}
                        style={{ appearance: 'none', width: '100%', padding: '10px 36px 10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                        <option value="Pendente">Pendente</option>
                      </select>
                      <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Abas inferiores */}
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', overflowX: 'auto', padding: '0 24px', borderBottom: `1px solid ${C.border}` }}>
                {abasFormulario.map(aba => (
                  <button
                    key={aba}
                    onClick={() => setAbaAtiva(aba)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '12px 16px', whiteSpace: 'nowrap',
                      fontSize: '13px',
                      fontWeight: abaAtiva === aba ? 600 : 400,
                      color: abaAtiva === aba ? C.blue : C.muted,
                      borderBottom: abaAtiva === aba ? `2px solid ${C.blue}` : '2px solid transparent',
                      marginBottom: '-1px',
                      transition: 'all 150ms',
                    }}
                  >
                    {aba}
                  </button>
                ))}
              </div>

              <div style={{ padding: '24px' }}>
                {abaAtiva === 'Geral' ? (
                  <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
                    Preencha os campos acima com as informações gerais do colaborador.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '10px', background: C.surface2, borderRadius: '10px', border: `1px dashed ${C.border}` }}>
                    <span style={{ fontSize: '28px' }}>🔒</span>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: 0 }}>Módulo: {abaAtiva}</p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Este módulo estará disponível em breve.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: '10px', background: C.surface2 }}>
              <button
                onClick={fecharFormulario}
                style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', fontWeight: 500, color: C.text, cursor: 'pointer', transition: 'border-color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.muted}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                Cancelar
              </button>
              <button
                onClick={fecharFormulario}
                style={{ padding: '10px 24px', background: C.blue, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer', transition: 'opacity 150ms' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {editandoId ? 'Salvar alterações' : 'Cadastrar colaborador'}
              </button>
            </div>
          </div>
        </div>
      </LayoutAdmin>
    )
  }

  // ── LISTAGEM PRINCIPAL ──
  return (
    <LayoutAdmin
      paginaAtiva="matriculasAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Matrículas"
      topbarSubtitulo="Gerencie o cadastro de colaboradores da plataforma."
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Matrículas</h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {colaboradoresFiltrados.length} de {colaboradoresMock.length} colaboradores
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              <Download size={14} /> Exportar
            </button>
            <button
              onClick={() => abrirFormulario()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={14} /> Adicionar Nova Pessoa
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total Matriculados', valor: colaboradoresMock.length, icon: Users,     cor: C.blue    },
            { label: 'Ativos',             valor: totalAtivos,              icon: UserCheck, cor: '#10b981' },
            { label: 'Inativos',           valor: totalInativos,            icon: UserX,     cor: '#ef4444' },
            { label: 'Pendentes',          valor: totalPendentes,           icon: Clock,     cor: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <m.icon size={18} color={m.cor} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{m.valor}</div>
                <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: C.muted, flexShrink: 0 }}>
            <Filter size={14} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Filtros:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 12px', flex: 1, minWidth: '200px' }}>
            <Search size={13} color={C.muted} />
            <input
              value={busca}
              onChange={e => { setBusca(e.target.value); setPaginaAtual(1) }}
              placeholder="Buscar por nome, e-mail ou matrícula..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, minWidth: 0 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={setorFiltro} onChange={e => { setSetorFiltro(e.target.value); setPaginaAtual(1) }} style={{ appearance: 'none', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px', color: C.text, cursor: 'pointer', outline: 'none', minWidth: '200px' }}>
              <option>Todos os setores</option>
              {setores.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={statusFiltro} onChange={e => { setStatusFiltro(e.target.value); setPaginaAtual(1) }} style={{ appearance: 'none', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px', color: C.text, cursor: 'pointer', outline: 'none', minWidth: '130px' }}>
              {['Todos', 'Ativo', 'Inativo', 'Pendente'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          {(busca || setorFiltro !== 'Todos os setores' || statusFiltro !== 'Todos') && (
            <button onClick={() => { setBusca(''); setSetorFiltro('Todos os setores'); setStatusFiltro('Todos'); setPaginaAtual(1) }} style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Limpar
            </button>
          )}
        </div>

        {/* Tabela */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 1.2fr 120px 80px 100px', background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
            {['Nome / Cargo', 'Setor', 'Matrícula', 'E-mail', 'Admissão', 'Status', 'Ações'].map((h, i) => (
              <div key={h} style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: i < 6 ? `1px solid ${C.border}` : 'none' }}>
                {h}
              </div>
            ))}
          </div>

          {colsPagina.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhum colaborador encontrado</p>
              <button onClick={() => { setBusca(''); setSetorFiltro('Todos os setores'); setStatusFiltro('Todos') }} style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Limpar filtros
              </button>
            </div>
          ) : colsPagina.map((col, idx) => {
            const cs = corStatus(col.status)
            return (
              <div
                key={col.id}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 1.2fr 120px 80px 100px', borderBottom: idx < colsPagina.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Nome / Cargo */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRight: `1px solid ${C.border}` }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, background: `${corAvatar(col.id)}22`, border: `1.5px solid ${corAvatar(col.id)}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: corAvatar(col.id) }}>
                    {getIniciais(col.nome)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.nome}</div>
                    <div style={{ fontSize: '11px', color: C.muted }}>{col.cargo}</div>
                  </div>
                </div>
                {/* Setor */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted2 }}>{col.setor}</span>
                </div>
                {/* Matrícula */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.blue, background: 'rgba(26,86,255,0.10)', border: '0.5px solid rgba(26,86,255,0.25)', borderRadius: '6px', padding: '3px 8px' }}>{col.matricula}</span>
                </div>
                {/* Email */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '5px', borderRight: `1px solid ${C.border}`, minWidth: 0 }}>
                  <Mail size={11} color={C.muted} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.email}</span>
                </div>
                {/* Admissão */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted2 }}>{col.dataAdmissao}</span>
                </div>
                {/* Status */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: cs.color, background: cs.bg, border: `0.5px solid ${cs.border}`, borderRadius: '6px', padding: '2px 8px' }}>
                    {col.status}
                  </span>
                </div>
                {/* Ações */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  {([Eye, Edit, Trash2] as const).map((Icon, i) => (
                    <button
                      key={i}
                      onClick={() => { if (i < 2) abrirFormulario(col) }}
                      style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                      onMouseEnter={e => { e.currentTarget.style.background = i === 2 ? 'rgba(239,68,68,0.10)' : 'rgba(26,86,255,0.10)'; e.currentTarget.style.borderColor = i === 2 ? '#ef4444' : C.blue }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                    >
                      <Icon size={12} color={i === 2 ? '#ef4444' : C.muted} />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: C.muted }}>
              Mostrando <strong style={{ color: C.text }}>{inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, colaboradoresFiltrados.length)}</strong> de <strong style={{ color: C.text }}>{colaboradoresFiltrados.length}</strong> colaboradores
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${C.border}`, background: paginaAtual === 1 ? C.surface2 : C.surface, color: paginaAtual === 1 ? C.muted : C.text, cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPaginaAtual(p)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${p === paginaAtual ? C.blue : C.border}`, background: p === paginaAtual ? C.blue : C.surface, color: p === paginaAtual ? '#fff' : C.text, fontWeight: p === paginaAtual ? 700 : 400, cursor: 'pointer', fontSize: '13px', transition: 'all 150ms' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${C.border}`, background: paginaAtual === totalPaginas ? C.surface2 : C.surface, color: paginaAtual === totalPaginas ? C.muted : C.text, cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>
    </LayoutAdmin>
  )
}
