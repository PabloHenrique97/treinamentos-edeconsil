import { useState } from 'react'
import {
  Building2, Monitor, Bell, Shield, Award,
  Users, BookOpen, Palette, Link2, Database,
  Lock, Save, RefreshCw,
  Eye, EyeOff, Check, AlertTriangle,
  Upload, Download
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

type SecaoConfig =
  | 'perfil' | 'plataforma' | 'notificacoes' | 'seguranca'
  | 'certificados' | 'matriculas' | 'treinamentos' | 'aparencia'
  | 'integracao' | 'backup' | 'permissoes'

const secoes = [
  { key: 'perfil',       label: 'Perfil da Empresa',   grupo: 'GERAL'       },
  { key: 'plataforma',   label: 'Plataforma',           grupo: 'GERAL'       },
  { key: 'aparencia',    label: 'Aparência',            grupo: 'GERAL'       },
  { key: 'notificacoes', label: 'Notificações',         grupo: 'COMUNICAÇÃO' },
  { key: 'seguranca',    label: 'Segurança e Acesso',   grupo: 'SEGURANÇA'   },
  { key: 'permissoes',   label: 'Permissões e Perfis',  grupo: 'SEGURANÇA'   },
  { key: 'matriculas',   label: 'Matrículas',           grupo: 'GESTÃO'      },
  { key: 'treinamentos', label: 'Treinamentos',         grupo: 'GESTÃO'      },
  { key: 'certificados', label: 'Certificados',         grupo: 'GESTÃO'      },
  { key: 'integracao',   label: 'Integrações',          grupo: 'SISTEMA'     },
  { key: 'backup',       label: 'Backup e Dados',       grupo: 'SISTEMA'     },
]

const gruposNav = ['GERAL', 'COMUNICAÇÃO', 'SEGURANÇA', 'GESTÃO', 'SISTEMA']

// ── Toggle switch ──
function Toggle({ ativo, onChange, cor }: { ativo: boolean; onChange: (v: boolean) => void; cor?: string }) {
  const { C } = useTheme()
  const corAtivo = cor ?? C.blue
  return (
    <button
      onClick={() => onChange(!ativo)}
      style={{ width: '44px', height: '24px', borderRadius: '12px', background: ativo ? corAtivo : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0 }}
    >
      <div style={{ position: 'absolute', top: '2px', left: ativo ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff', transition: 'left 200ms', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
    </button>
  )
}

// ── Linha com toggle ──
function LinhaToggle({ label, desc, ativo, onChange, cor }: { label: string; desc?: string; ativo: boolean; onChange: (v: boolean) => void; cor?: string }) {
  const { C } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: C.muted, margin: 0, lineHeight: 1.4 }}>{desc}</p>}
      </div>
      <Toggle ativo={ativo} onChange={onChange} cor={cor} />
    </div>
  )
}

// ── Campo input ──
function CampoInput({ label, value, onChange, placeholder, type = 'text', desc }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; desc?: string
}) {
  const { C } = useTheme()
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none' }}
        onFocus={e => e.target.style.borderColor = C.blue}
        onBlur={e => e.target.style.borderColor = C.border}
      />
      {desc && <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>{desc}</p>}
    </div>
  )
}

// ── Card de seção ──
function CardSecao({ titulo, children, desc }: { titulo: string; children: React.ReactNode; desc?: string }) {
  const { C } = useTheme()
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>{titulo}</p>
        {desc && <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{desc}</p>}
      </div>
      <div style={{ padding: '4px 20px 16px' }}>{children}</div>
    </div>
  )
}

// ── Botão salvar com feedback ──
function BotaoSalvar({ onClick }: { onClick: () => void }) {
  const { C } = useTheme()
  const [salvo, setSalvo] = useState(false)
  const handleClick = () => {
    onClick()
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
      <button
        onClick={handleClick}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: salvo ? '#10b981' : C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 200ms' }}
      >
        {salvo ? <Check size={14} /> : <Save size={14} />}
        {salvo ? 'Salvo!' : 'Salvar alterações'}
      </button>
    </div>
  )
}

// ── Componente principal ──
export function ConfiguracoesAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C, isDark, toggleTheme } = useTheme()
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoConfig>('perfil')

  // Perfil
  const [nomeEmpresa, setNomeEmpresa] = useState('Edeconsil Construtora')
  const [nomePortal, setNomePortal] = useState('Universidade Corporativa Edeconsil')
  const [emailSuporte, setEmailSuporte] = useState('suporte@edeconsil.com.br')
  const [telefone, setTelefone] = useState('+55 (98) 3334-8000')
  const [endereco, setEndereco] = useState('Av. José Sarney, nº 500, Jardim São Cristóvão')
  const [site, setSite] = useState('https://www.edeconsil.com.br')
  const [cnpj, setCnpj] = useState('00.000.000/0001-00')
  const [descricaoEmpresa, setDescricaoEmpresa] = useState('Empresa de construção civil com foco em obras de infraestrutura.')

  // Plataforma
  const [idioma, setIdioma] = useState('Português (Brasil)')
  const [fusoHorario, setFusoHorario] = useState('America/Sao_Paulo (UTC-3)')
  const [formatoData, setFormatoData] = useState('DD/MM/AAAA')
  const [itensLista, setItensLista] = useState('10')
  const [manutencao, setManutencao] = useState(false)
  const [registroPublico, setRegistroPublico] = useState(false)
  const [loginGoogle, setLoginGoogle] = useState(true)
  const [loginMicrosoft, setLoginMicrosoft] = useState(true)

  // Notificações
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSistema, setNotifSistema] = useState(true)
  const [notifWhatsapp, setNotifWhatsapp] = useState(false)
  const [notifCertVencendo, setNotifCertVencendo] = useState(true)
  const [notifNovoCurso, setNotifNovoCurso] = useState(true)
  const [notifNovaMatricula, setNotifNovaMatricula] = useState(true)
  const [notifConclusao, setNotifConclusao] = useState(true)
  const [notifPendencias, setNotifPendencias] = useState(true)
  const [diasAntecedenciaVenc, setDiasAntecedenciaVenc] = useState('30')

  // Segurança
  const [senhaMinCaracteres, setSenhaMinCaracteres] = useState('8')
  const [senhaLetraMaiuscula, setSenhaLetraMaiuscula] = useState(true)
  const [senhaNumerica, setSenhaNumerica] = useState(true)
  const [senhaEspecial, setSenhaEspecial] = useState(false)
  const [expiraSenha, setExpiraSenha] = useState(false)
  const [diasExpiracaoSenha, setDiasExpiracaoSenha] = useState('90')
  const [autenticacaoDupla, setAutenticacaoDupla] = useState(false)
  const [sessaoTimeout, setSessaoTimeout] = useState('480')
  const [ipWhitelist, setIpWhitelist] = useState(false)
  const [logAcessos, setLogAcessos] = useState(true)
  const [tentativasLogin, setTentativasLogin] = useState('5')

  // Treinamentos
  const [aprovacaoMinima, setAprovacaoMinima] = useState('70')
  const [tentativasProva, setTentativasProva] = useState('3')
  const [certAutoEmissao, setCertAutoEmissao] = useState(true)
  const [progressoObrigatorio, setProgressoObrigatorio] = useState(true)
  const [ordemObrigatoria, setOrdemObrigatoria] = useState(false)
  const [comentariosAtivos, setComentariosAtivos] = useState(true)
  const [avaliacaoAtiva, setAvaliacaoAtiva] = useState(true)
  const [pausaVideo, setPausaVideo] = useState(false)
  const [velocidadeVideo, setVelocidadeVideo] = useState(true)
  const [qualidadeDefault, setQualidadeDefault] = useState('720p')

  // Certificados
  const [validadePadrao, setValidadePadrao] = useState('12')
  const [assinaturaDigital, setAssinaturaDigital] = useState(true)
  const [codigoVerificacao, setCodigoVerificacao] = useState(true)
  const [downloadPDF, setDownloadPDF] = useState(true)
  const [compartilharLinkedin, setCompartilharLinkedin] = useState(true)
  const [nomeAssinante, setNomeAssinante] = useState('Pablo Henrique — Diretor de RH')
  const [rodapeCert, setRodapeCert] = useState('Edeconsil Universidade Corporativa')

  // Matrículas
  const [aprovacaoMatricula, setAprovacaoMatricula] = useState(false)
  const [limiteAlunos, setLimiteAlunos] = useState('')
  const [campoCpf, setCampoCpf] = useState(true)
  const [campoFoto, setCampoFoto] = useState(true)
  const [campoRamal, setCampoRamal] = useState(true)
  const [campoVeiculo, setCampoVeiculo] = useState(false)
  const [emailBoasVindas, setEmailBoasVindas] = useState(true)
  const [crAutomatico, setCrAutomatico] = useState(true)

  // Aparência
  const [corPrimaria, setCorPrimaria] = useState('#0d2550')
  const [corDestaque, setCorDestaque] = useState('#F5C400')

  // Integrações
  const [integracaoGoogleWorkspace, setIntegracaoGoogleWorkspace] = useState(false)
  const [integracaoMicrosoft365, setIntegracaoMicrosoft365] = useState(false)
  const [integracaoLinkedin, setIntegracaoLinkedin] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [apiKey] = useState('sk-edeconsil-••••••••••••••••')
  const [mostrarApiKey, setMostrarApiKey] = useState(false)

  const iconePorSecao: Record<SecaoConfig, React.ReactNode> = {
    perfil:       <Building2 size={15} />,
    plataforma:   <Monitor size={15} />,
    aparencia:    <Palette size={15} />,
    notificacoes: <Bell size={15} />,
    seguranca:    <Shield size={15} />,
    permissoes:   <Lock size={15} />,
    matriculas:   <Users size={15} />,
    treinamentos: <BookOpen size={15} />,
    certificados: <Award size={15} />,
    integracao:   <Link2 size={15} />,
    backup:       <Database size={15} />,
  }

  const selectStyle = {
    width: '100%', padding: '10px 14px',
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: '8px', fontSize: '13px', color: C.text,
    outline: 'none', cursor: 'pointer',
  }

  const renderConteudo = () => {
    switch (secaoAtiva) {

      case 'perfil':
        return (
          <>
            <CardSecao titulo="Identidade da Empresa" desc="Informações que aparecem em toda a plataforma">
              <div style={{ height: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <CampoInput label="Nome da Empresa"   value={nomeEmpresa}   onChange={setNomeEmpresa}   placeholder="Ex: Edeconsil Construtora" />
                <CampoInput label="Nome do Portal"    value={nomePortal}    onChange={setNomePortal}    placeholder="Ex: Universidade Corporativa" />
                <CampoInput label="CNPJ"              value={cnpj}          onChange={setCnpj}          placeholder="00.000.000/0001-00" />
                <CampoInput label="Site"              value={site}          onChange={setSite}          placeholder="https://www.empresa.com.br" />
                <CampoInput label="Telefone"          value={telefone}      onChange={setTelefone}      placeholder="+55 (98) 3334-8000" />
                <CampoInput label="E-mail de Suporte" value={emailSuporte}  onChange={setEmailSuporte}  type="email" placeholder="suporte@empresa.com.br" />
              </div>
              <CampoInput label="Endereço" value={endereco} onChange={setEndereco} placeholder="Endereço completo" />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descrição da Empresa</label>
                <textarea
                  value={descricaoEmpresa}
                  onChange={e => setDescricaoEmpresa(e.target.value)}
                  rows={3}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Logo e Identidade Visual" desc="Imagem que aparece no cabeçalho do sistema">
              <div style={{ height: '8px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: C.surface2, borderRadius: '10px', border: `1px solid ${C.border}`, marginBottom: '12px' }}>
                <div style={{ width: '80px', height: '40px', background: C.surface, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '11px', color: C.muted }}>Logo atual</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>logo-edeconsil.png</p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>PNG ou SVG recomendado · Fundo transparente</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: C.blue, color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  <Upload size={13} /> Trocar logo
                </button>
              </div>
            </CardSecao>
          </>
        )

      case 'plataforma':
        return (
          <>
            <CardSecao titulo="Configurações Regionais">
              <div style={{ height: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Idioma</label>
                  <select value={idioma} onChange={e => setIdioma(e.target.value)} style={selectStyle}>
                    <option>Português (Brasil)</option>
                    <option>English (US)</option>
                    <option>Español</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fuso Horário</label>
                  <select value={fusoHorario} onChange={e => setFusoHorario(e.target.value)} style={selectStyle}>
                    <option>America/Sao_Paulo (UTC-3)</option>
                    <option>America/Manaus (UTC-4)</option>
                    <option>America/Belem (UTC-3)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Formato de Data</label>
                  <select value={formatoData} onChange={e => setFormatoData(e.target.value)} style={selectStyle}>
                    <option>DD/MM/AAAA</option>
                    <option>MM/DD/AAAA</option>
                    <option>AAAA-MM-DD</option>
                  </select>
                </div>
                <CampoInput label="Itens por página (listas)" value={itensLista} onChange={setItensLista} placeholder="10" desc="Padrão de itens exibidos nas tabelas" />
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Acesso e Login" desc="Configurações de acesso ao portal">
              <LinhaToggle label="Modo de Manutenção"   desc="Bloqueia o acesso de colaboradores ao portal enquanto ativo"  ativo={manutencao}       onChange={setManutencao}       cor="#ef4444" />
              <LinhaToggle label="Registro público"     desc="Permite que colaboradores se cadastrem sem convite"            ativo={registroPublico}  onChange={setRegistroPublico}  />
              <LinhaToggle label="Login com Google"     desc="Permite autenticação via conta Google corporativa"             ativo={loginGoogle}      onChange={setLoginGoogle}      />
              <LinhaToggle label="Login com Microsoft"  desc="Permite autenticação via conta Microsoft 365"                  ativo={loginMicrosoft}   onChange={setLoginMicrosoft}   />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'aparencia':
        return (
          <>
            <CardSecao titulo="Tema do Sistema" desc="Controle a aparência global da plataforma">
              <div style={{ height: '8px' }} />
              <LinhaToggle label="Modo escuro (Dark Mode)" desc="Ativar tema escuro para toda a plataforma" ativo={isDark} onChange={() => toggleTheme()} />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Cores da Plataforma" desc="Cores principais usadas em botões, links e destaques">
              <div style={{ height: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                {[
                  { label: 'Cor Primária',   value: corPrimaria,  onChange: setCorPrimaria,  desc: 'Usada em botões, links e destaques' },
                  { label: 'Cor de Destaque', value: corDestaque, onChange: setCorDestaque,  desc: 'Usada em badges, alertas e ícones'  },
                ].map(c => (
                  <div key={c.label}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input type="color" value={c.value} onChange={e => c.onChange(e.target.value)} style={{ width: '44px', height: '40px', borderRadius: '8px', border: `1px solid ${C.border}`, cursor: 'pointer', background: 'none', padding: '2px' }} />
                      <input value={c.value} onChange={e => c.onChange(e.target.value)} style={{ flex: 1, padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', fontFamily: 'monospace' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: C.muted, margin: '6px 0 0' }}>{c.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: C.surface2, borderRadius: '10px', padding: '16px', marginBottom: '12px', border: `1px solid ${C.border}` }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pré-visualização</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button style={{ padding: '8px 16px', background: corPrimaria, color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Botão primário</button>
                  <button style={{ padding: '8px 16px', background: corDestaque, color: corPrimaria, border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Destaque</button>
                  <span style={{ padding: '5px 12px', background: `${corPrimaria}18`, color: corPrimaria, borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: `0.5px solid ${corPrimaria}40` }}>Badge</span>
                  <span style={{ fontSize: '13px', color: corPrimaria, fontWeight: 600, padding: '8px 0' }}>Link de ação →</span>
                </div>
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'notificacoes':
        return (
          <>
            <CardSecao titulo="Canais de Notificação" desc="Defina como os colaboradores receberão avisos">
              <LinhaToggle label="Notificações por E-mail"     desc="Envia e-mails automáticos para eventos importantes"                     ativo={notifEmail}    onChange={setNotifEmail}    />
              <LinhaToggle label="Notificações no sistema"     desc="Exibe alertas dentro da plataforma (sino no cabeçalho)"                 ativo={notifSistema}  onChange={setNotifSistema}  />
              <LinhaToggle label="Notificações via WhatsApp"   desc="Integração com WhatsApp Business para mensagens automáticas"            ativo={notifWhatsapp} onChange={setNotifWhatsapp} />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Eventos de Notificação" desc="Escolha quais eventos disparam notificações">
              <LinhaToggle label="Certificado vencendo"        desc="Alerta quando um certificado está prestes a vencer"                     ativo={notifCertVencendo}    onChange={setNotifCertVencendo}    />
              <LinhaToggle label="Novo curso disponível"       desc="Avisa quando um novo curso for publicado"                               ativo={notifNovoCurso}       onChange={setNotifNovoCurso}       />
              <LinhaToggle label="Nova matrícula realizada"    desc="Notifica o admin quando um colaborador for matriculado"                  ativo={notifNovaMatricula}   onChange={setNotifNovaMatricula}   />
              <LinhaToggle label="Curso concluído"             desc="Notifica quando um colaborador concluir um curso"                       ativo={notifConclusao}       onChange={setNotifConclusao}       />
              <LinhaToggle label="Lembrete de pendências"      desc="Envia lembretes semanais de cursos não concluídos"                      ativo={notifPendencias}      onChange={setNotifPendencias}      />
              <div style={{ height: '8px' }} />
              <CampoInput label="Antecedência para alerta de vencimento (dias)" value={diasAntecedenciaVenc} onChange={setDiasAntecedenciaVenc} placeholder="30" desc="Quantos dias antes do vencimento o alerta será disparado" />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'seguranca':
        return (
          <>
            <CardSecao titulo="Política de Senhas" desc="Regras para criação de senhas dos colaboradores">
              <div style={{ height: '8px' }} />
              <CampoInput label="Mínimo de caracteres" value={senhaMinCaracteres} onChange={setSenhaMinCaracteres} placeholder="8" desc="Número mínimo de caracteres exigidos" />
              <LinhaToggle label="Exigir letra maiúscula"     desc="A senha deve conter pelo menos uma letra maiúscula"         ativo={senhaLetraMaiuscula} onChange={setSenhaLetraMaiuscula} />
              <LinhaToggle label="Exigir número"              desc="A senha deve conter pelo menos um número"                    ativo={senhaNumerica}       onChange={setSenhaNumerica}       />
              <LinhaToggle label="Exigir caractere especial"  desc="A senha deve conter símbolos como !@#$%"                     ativo={senhaEspecial}       onChange={setSenhaEspecial}       />
              <LinhaToggle label="Expiração de senha"         desc="Força a troca periódica de senhas"                           ativo={expiraSenha}         onChange={setExpiraSenha}         />
              {expiraSenha && <CampoInput label="Dias para expiração" value={diasExpiracaoSenha} onChange={setDiasExpiracaoSenha} placeholder="90" />}
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Controle de Acesso" desc="Configurações de sessão e autenticação">
              <div style={{ height: '8px' }} />
              <LinhaToggle label="Autenticação em dois fatores (2FA)" desc="Exige código adicional além da senha no login"           ativo={autenticacaoDupla} onChange={setAutenticacaoDupla} />
              <LinhaToggle label="Whitelist de IPs"                   desc="Permite acesso apenas de endereços IP específicos"       ativo={ipWhitelist}       onChange={setIpWhitelist}       />
              <LinhaToggle label="Log de acessos"                     desc="Registra todos os logins e acessos ao sistema"           ativo={logAcessos}        onChange={setLogAcessos}        />
              <div style={{ height: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <CampoInput label="Timeout de sessão (minutos)"              value={sessaoTimeout}    onChange={setSessaoTimeout}    placeholder="480" desc="Tempo até deslogar automaticamente" />
                <CampoInput label="Tentativas antes do bloqueio"             value={tentativasLogin}  onChange={setTentativasLogin}  placeholder="5"   />
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'treinamentos':
        return (
          <>
            <CardSecao titulo="Regras de Avaliação" desc="Critérios para aprovação nos cursos">
              <div style={{ height: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <CampoInput label="Nota mínima para aprovação (%)"  value={aprovacaoMinima} onChange={setAprovacaoMinima} placeholder="70" desc="Percentual mínimo para concluir o curso" />
                <CampoInput label="Tentativas máximas na prova"     value={tentativasProva} onChange={setTentativasProva} placeholder="3"  desc="Número de vezes que o aluno pode tentar a avaliação" />
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Comportamento dos Cursos" desc="Como os cursos funcionam para os colaboradores">
              <LinhaToggle label="Progresso obrigatório"      desc="O aluno deve assistir 100% da aula antes de avançar"                       ativo={progressoObrigatorio} onChange={setProgressoObrigatorio} />
              <LinhaToggle label="Ordem obrigatória"          desc="As aulas devem ser feitas na ordem definida pelo instrutor"                  ativo={ordemObrigatoria}     onChange={setOrdemObrigatoria}     />
              <LinhaToggle label="Comentários habilitados"    desc="Permite que alunos comentem nas aulas"                                       ativo={comentariosAtivos}    onChange={setComentariosAtivos}    />
              <LinhaToggle label="Avaliação de aulas"         desc="Alunos podem avaliar cada aula com estrelas"                                  ativo={avaliacaoAtiva}       onChange={setAvaliacaoAtiva}       />
              <LinhaToggle label="Pausar vídeo ao perder foco"desc="O vídeo pausa automaticamente quando o aluno sai da aba"                     ativo={pausaVideo}           onChange={setPausaVideo}           />
              <LinhaToggle label="Controle de velocidade"     desc="Alunos podem alterar a velocidade do vídeo (0.5x a 2x)"                      ativo={velocidadeVideo}      onChange={setVelocidadeVideo}      />
              <div style={{ height: '8px' }} />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qualidade de Vídeo Padrão</label>
                <select value={qualidadeDefault} onChange={e => setQualidadeDefault(e.target.value)} style={{ ...selectStyle, width: '200px' }}>
                  {['1080p', '720p', '480p', '360p', 'Auto'].map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'certificados':
        return (
          <>
            <CardSecao titulo="Configurações de Emissão" desc="Como os certificados são gerados e distribuídos">
              <div style={{ height: '8px' }} />
              <CampoInput label="Validade padrão (meses)" value={validadePadrao} onChange={setValidadePadrao} placeholder="12" desc="Validade aplicada quando não definida no curso" />
              <LinhaToggle label="Emissão automática"       desc="O certificado é gerado automaticamente ao concluir o curso"         ativo={certAutoEmissao}      onChange={setCertAutoEmissao}      />
              <LinhaToggle label="Assinatura digital"       desc="Inclui assinatura eletrônica no certificado"                        ativo={assinaturaDigital}    onChange={setAssinaturaDigital}    />
              <LinhaToggle label="Código de verificação"    desc="Gera um QR Code/código para validar o certificado"                  ativo={codigoVerificacao}    onChange={setCodigoVerificacao}    />
              <LinhaToggle label="Download em PDF"          desc="Permite que o colaborador baixe o certificado"                      ativo={downloadPDF}          onChange={setDownloadPDF}          />
              <LinhaToggle label="Compartilhar no LinkedIn" desc="Botão para publicar o certificado no perfil do LinkedIn"            ativo={compartilharLinkedin} onChange={setCompartilharLinkedin} />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Modelo do Certificado" desc="Informações exibidas no certificado emitido">
              <div style={{ height: '8px' }} />
              <CampoInput label="Nome do assinante"     value={nomeAssinante} onChange={setNomeAssinante} placeholder="Nome — Cargo" />
              <CampoInput label="Rodapé do certificado" value={rodapeCert}    onChange={setRodapeCert}    placeholder="Edeconsil Universidade Corporativa" />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'matriculas':
        return (
          <>
            <CardSecao titulo="Processo de Matrícula" desc="Como novos colaboradores são cadastrados">
              <LinhaToggle label="Aprovação manual de matrículas" desc="Admin precisa aprovar cada nova matrícula antes de liberar o acesso" ativo={aprovacaoMatricula} onChange={setAprovacaoMatricula} />
              <LinhaToggle label="CR automático"                  desc="Gera o código CR automaticamente ao cadastrar o colaborador"         ativo={crAutomatico}       onChange={setCrAutomatico}       />
              <LinhaToggle label="E-mail de boas-vindas"          desc="Envia e-mail automático ao colaborador ao ser matriculado"           ativo={emailBoasVindas}    onChange={setEmailBoasVindas}    />
              <div style={{ height: '8px' }} />
              <CampoInput label="Limite de alunos por turma (deixe vazio para ilimitado)" value={limiteAlunos} onChange={setLimiteAlunos} placeholder="Ex: 30" />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="Campos do Formulário" desc="Quais campos aparecem no cadastro de colaboradores">
              <LinhaToggle label="Campo CPF"          desc="Solicita o CPF do colaborador no cadastro"        ativo={campoCpf}     onChange={setCampoCpf}     />
              <LinhaToggle label="Campo foto"         desc="Permite upload de foto de perfil"                  ativo={campoFoto}    onChange={setCampoFoto}    />
              <LinhaToggle label="Campo ramal/interfone" desc="Solicita o ramal do colaborador"               ativo={campoRamal}   onChange={setCampoRamal}   />
              <LinhaToggle label="Campo veículos"     desc="Permite cadastrar veículos do colaborador"         ativo={campoVeiculo} onChange={setCampoVeiculo} />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'permissoes':
        return (
          <>
            <CardSecao titulo="Perfis de Acesso" desc="Níveis de permissão disponíveis no sistema">
              <div style={{ height: '8px' }} />
              {[
                { perfil: 'Administrador', desc: 'Acesso total ao sistema, incluindo configurações e relatórios', cor: '#ef4444', perms: ['Dashboard Admin', 'Gestão de Cursos', 'Gestão de Alunos', 'Configurações', 'Relatórios', 'Matrículas'] },
                { perfil: 'Instrutor',     desc: 'Pode criar e gerenciar seus próprios cursos e turmas',         cor: '#7c3aed', perms: ['Meus Cursos', 'Turmas', 'Alunos do curso', 'Relatórios básicos'] },
                { perfil: 'Colaborador',   desc: 'Acesso ao portal de aprendizado e certificados',               cor: '#10b981', perms: ['Dashboard colaborador', 'Meus Cursos', 'Certificados', 'Trilhas', 'Biblioteca'] },
              ].map(p => (
                <div key={p.perfil} style={{ background: C.surface2, borderRadius: '10px', padding: '14px', border: `1px solid ${C.border}`, marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', background: p.cor, borderRadius: '6px', padding: '3px 10px' }}>{p.perfil}</span>
                    <span style={{ fontSize: '12px', color: C.muted }}>{p.desc}</span>
                    <button style={{ marginLeft: 'auto', background: 'none', border: `1px solid ${C.border}`, borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: C.muted, cursor: 'pointer' }}>
                      Editar permissões
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {p.perms.map(perm => (
                      <span key={perm} style={{ fontSize: '11px', color: p.cor, background: `${p.cor}12`, border: `0.5px solid ${p.cor}30`, borderRadius: '5px', padding: '2px 8px' }}>
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'integracao':
        return (
          <>
            <CardSecao titulo="Integrações Externas" desc="Conecte a plataforma a outros sistemas">
              <LinhaToggle label="Google Workspace"  desc="Sincroniza usuários e autenticação com o Google"         ativo={integracaoGoogleWorkspace} onChange={setIntegracaoGoogleWorkspace} />
              <LinhaToggle label="Microsoft 365"     desc="Sincroniza usuários e autenticação com a Microsoft"      ativo={integracaoMicrosoft365}    onChange={setIntegracaoMicrosoft365}    />
              <LinhaToggle label="LinkedIn Learning" desc="Exibe certificados diretamente no perfil do LinkedIn"    ativo={integracaoLinkedin}        onChange={setIntegracaoLinkedin}        />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>

            <CardSecao titulo="API e Webhooks" desc="Integre sistemas externos via API REST">
              <div style={{ height: '8px' }} />
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.muted, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chave de API</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={mostrarApiKey ? 'text' : 'password'}
                    value={apiKey}
                    readOnly
                    style={{ flex: 1, padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, outline: 'none', fontFamily: 'monospace' }}
                  />
                  <button onClick={() => setMostrarApiKey(!mostrarApiKey)} style={{ padding: '10px 12px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {mostrarApiKey ? <EyeOff size={15} color={C.muted} /> : <Eye size={15} color={C.muted} />}
                  </button>
                  <button style={{ padding: '10px 12px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: C.muted }}>
                    <RefreshCw size={13} /> Regenerar
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: C.muted, margin: '4px 0 0' }}>Mantenha esta chave em segredo. Use nas requisições como Bearer Token.</p>
              </div>
              <CampoInput label="URL do Webhook (opcional)" value={webhookUrl} onChange={setWebhookUrl} placeholder="https://seusite.com/webhook" desc="Receba eventos da plataforma em tempo real via POST" />
              <BotaoSalvar onClick={() => {}} />
            </CardSecao>
          </>
        )

      case 'backup':
        return (
          <>
            <CardSecao titulo="Exportação de Dados" desc="Baixe os dados do sistema em diferentes formatos">
              <div style={{ height: '8px' }} />
              {[
                { label: 'Exportar lista de alunos',           desc: 'Nome, e-mail, matrícula, status e progresso',    icone: '👥' },
                { label: 'Exportar histórico de cursos',       desc: 'Todos os cursos concluídos com datas e notas',   icone: '📚' },
                { label: 'Exportar certificados emitidos',     desc: 'Lista completa de certificados com validade',    icone: '🏅' },
                { label: 'Exportar relatório de treinamentos', desc: 'Horas de treinamento por colaborador e setor',   icone: '📊' },
                { label: 'Backup completo do sistema',         desc: 'Exporta todos os dados em formato JSON/ZIP',     icone: '💾' },
              ].map(op => (
                <div key={op.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: C.surface2, borderRadius: '10px', border: `1px solid ${C.border}`, marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{op.icone}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{op.label}</p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{op.desc}</p>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: C.blue, color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                    <Download size={13} /> Exportar CSV
                  </button>
                </div>
              ))}
            </CardSecao>

            <CardSecao titulo="Zona de Perigo" desc="Ações irreversíveis — execute com cuidado">
              <div style={{ height: '8px' }} />
              {[
                { label: 'Limpar histórico de acessos', desc: 'Remove todos os logs de login do sistema',                              cor: '#f59e0b' },
                { label: 'Redefinir configurações',     desc: 'Restaura todas as configurações para o padrão de fábrica',              cor: '#ef4444' },
              ].map(acao => (
                <div key={acao.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px', background: `${acao.cor}08`, borderRadius: '10px', border: `1px solid ${acao.cor}30`, marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={18} color={acao.cor} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{acao.label}</p>
                      <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{acao.desc}</p>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: `1.5px solid ${acao.cor}`, color: acao.cor, borderRadius: '7px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                    Executar
                  </button>
                </div>
              ))}
            </CardSecao>
          </>
        )

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>🔧</span>
            <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>Seção em desenvolvimento</p>
          </div>
        )
    }
  }

  return (
    <LayoutAdmin
      paginaAtiva="configuracoesAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Configurações"
      topbarSubtitulo="Gerencie as configurações gerais da plataforma."
    >
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar das configurações */}
        <div style={{ width: '240px', flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, overflowY: 'auto', padding: '16px 8px' }}>
          {gruposNav.map(grupo => {
            const itensGrupo = secoes.filter(s => s.grupo === grupo)
            return (
              <div key={grupo} style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: C.muted, letterSpacing: '1px', padding: '4px 12px 6px', margin: 0, textTransform: 'uppercase' }}>
                  {grupo}
                </p>
                {itensGrupo.map(secao => {
                  const ativa = secaoAtiva === secao.key
                  return (
                    <button
                      key={secao.key}
                      onClick={() => setSecaoAtiva(secao.key as SecaoConfig)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px', borderRadius: '8px',
                        background: ativa ? 'rgba(26,86,255,0.12)' : 'transparent',
                        border: 'none',
                        borderLeft: ativa ? `3px solid ${C.blue}` : '3px solid transparent',
                        cursor: 'pointer', transition: 'all 150ms',
                        color: ativa ? C.blue : C.muted2,
                        fontSize: '13px', fontWeight: ativa ? 700 : 400,
                        textAlign: 'left', marginBottom: '2px',
                      }}
                      onMouseEnter={e => { if (!ativa) e.currentTarget.style.background = 'rgba(26,86,255,0.06)' }}
                      onMouseLeave={e => { if (!ativa) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ color: ativa ? C.blue : C.muted, flexShrink: 0 }}>
                        {iconePorSecao[secao.key as SecaoConfig]}
                      </span>
                      {secao.label}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Conteúdo da seção */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {renderConteudo()}
        </div>
      </div>
    </LayoutAdmin>
  )
}
