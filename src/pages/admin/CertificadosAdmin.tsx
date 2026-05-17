import { useState, useMemo } from 'react'
import {
  Search, Filter, ChevronDown, X,
  Download, Plus, Award, Users,
  Clock, Eye, Edit,
  CheckCircle
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'

interface Certificado {
  id: number
  curso: string
  categoria: string
  cargaHoraria: string
  validadeMeses: number
  totalEmitidos: number
  cor: string
  corSecundaria: string
  icone: string
  descricao: string
  status: 'Ativo' | 'Inativo'
  dataCriacao: string
}

const certificadosMock: Certificado[] = [
  { id:1,  curso:'NR-35 — Trabalho em Altura',              categoria:'Segurança do Trabalho',  cargaHoraria:'8h',  validadeMeses:12, totalEmitidos:342, cor:'#dc2626', corSecundaria:'#fca5a5', icone:'🪖', descricao:'Capacitação obrigatória para atividades em altura conforme norma regulamentadora NR-35.',          status:'Ativo',   dataCriacao:'10/01/2025' },
  { id:2,  curso:'SIPAT — Segurança no Canteiro de Obras',  categoria:'Segurança do Trabalho',  cargaHoraria:'6h',  validadeMeses:12, totalEmitidos:289, cor:'#d97706', corSecundaria:'#fcd34d', icone:'🛡️', descricao:'Semana Interna de Prevenção de Acidentes do Trabalho aplicada ao canteiro de obras.',             status:'Ativo',   dataCriacao:'15/01/2025' },
  { id:3,  curso:'Gestão da Qualidade ISO 9001',            categoria:'Gestão e Suprimentos',   cargaHoraria:'12h', validadeMeses:24, totalEmitidos:156, cor:'#7c3aed', corSecundaria:'#c4b5fd', icone:'📋', descricao:'Fundamentos do sistema de gestão da qualidade e aplicação na construção civil.',                  status:'Ativo',   dataCriacao:'20/01/2025' },
  { id:4,  curso:'Leitura e Interpretação de Projetos',     categoria:'Obras e Infraestrutura', cargaHoraria:'10h', validadeMeses:24, totalEmitidos:412, cor:'#1a56ff', corSecundaria:'#93c5fd', icone:'📐', descricao:'Interpretação de plantas topográficas, cortes, perfis e volumes com precisão técnica.',             status:'Ativo',   dataCriacao:'05/02/2025' },
  { id:5,  curso:'Operação de Escavadeiras Hidráulicas',    categoria:'Terraplanagem',          cargaHoraria:'16h', validadeMeses:12, totalEmitidos:98,  cor:'#059669', corSecundaria:'#6ee7b7', icone:'🏗️', descricao:'Treinamento prático para operadores de escavadeiras em obras de terraplanagem.',                  status:'Ativo',   dataCriacao:'10/02/2025' },
  { id:6,  curso:'Pavimentação Asfáltica — Fundamentos',    categoria:'Pavimentação',           cargaHoraria:'8h',  validadeMeses:12, totalEmitidos:134, cor:'#0891b2', corSecundaria:'#67e8f9', icone:'🛣️', descricao:'Técnicas e processos de pavimentação asfáltica para equipes de obra.',                           status:'Ativo',   dataCriacao:'15/02/2025' },
  { id:7,  curso:'Liderança em Obras e Canteiros',          categoria:'Obras e Infraestrutura', cargaHoraria:'10h', validadeMeses:24, totalEmitidos:201, cor:'#db2777', corSecundaria:'#f9a8d4', icone:'👷', descricao:'Desenvolvimento de habilidades de liderança e gestão de equipes em campo.',                      status:'Ativo',   dataCriacao:'20/02/2025' },
  { id:8,  curso:'Excel para Gestão de Obras',              categoria:'Gestão e Suprimentos',   cargaHoraria:'8h',  validadeMeses:24, totalEmitidos:178, cor:'#1a56ff', corSecundaria:'#93c5fd', icone:'📊', descricao:'Planilhas e ferramentas do Excel aplicadas ao controle de obras e orçamentos.',                  status:'Ativo',   dataCriacao:'01/03/2025' },
  { id:9,  curso:'NR-10 — Segurança em Instalações Elétricas',categoria:'Manutenção Elétrica', cargaHoraria:'40h', validadeMeses:24, totalEmitidos:87,  cor:'#f59e0b', corSecundaria:'#fde68a', icone:'⚡', descricao:'Segurança em instalações e serviços com eletricidade conforme NR-10.',                            status:'Ativo',   dataCriacao:'05/03/2025' },
  { id:10, curso:'NR-12 — Segurança em Máquinas',           categoria:'Manutenção Mecânica',    cargaHoraria:'20h', validadeMeses:24, totalEmitidos:64,  cor:'#16a34a', corSecundaria:'#86efac', icone:'⚙️', descricao:'Segurança no trabalho em máquinas e equipamentos conforme norma regulamentadora NR-12.',         status:'Ativo',   dataCriacao:'10/03/2025' },
  { id:11, curso:'Gestão Ambiental em Obras',               categoria:'Segurança do Trabalho',  cargaHoraria:'6h',  validadeMeses:12, totalEmitidos:112, cor:'#15803d', corSecundaria:'#4ade80', icone:'♻️', descricao:'Práticas sustentáveis e legislação ambiental aplicadas ao canteiro de obras.',                   status:'Ativo',   dataCriacao:'15/03/2025' },
  { id:12, curso:'Direção Defensiva para Motoristas',       categoria:'Segurança do Trabalho',  cargaHoraria:'8h',  validadeMeses:12, totalEmitidos:145, cor:'#6d28d9', corSecundaria:'#ddd6fe', icone:'🚛', descricao:'Técnicas de direção defensiva e prevenção de acidentes para motoristas da frota.',              status:'Ativo',   dataCriacao:'20/03/2025' },
  { id:13, curso:'Primeiros Socorros',                      categoria:'Segurança do Trabalho',  cargaHoraria:'8h',  validadeMeses:12, totalEmitidos:267, cor:'#dc2626', corSecundaria:'#fca5a5', icone:'🏥', descricao:'Procedimentos de primeiros socorros e atendimento de emergências no ambiente de trabalho.',       status:'Ativo',   dataCriacao:'01/04/2025' },
  { id:14, curso:'Combate a Incêndio',                      categoria:'Segurança do Trabalho',  cargaHoraria:'8h',  validadeMeses:12, totalEmitidos:198, cor:'#ea580c', corSecundaria:'#fdba74', icone:'🔥', descricao:'Técnicas de prevenção e combate a incêndios com uso correto de extintores e equipamentos.',     status:'Ativo',   dataCriacao:'05/04/2025' },
  { id:15, curso:'Topografia Aplicada à Construção',        categoria:'Obras e Infraestrutura', cargaHoraria:'12h', validadeMeses:24, totalEmitidos:76,  cor:'#0284c7', corSecundaria:'#7dd3fc', icone:'📏', descricao:'Fundamentos de topografia e sua aplicação prática em obras de infraestrutura.',                  status:'Inativo', dataCriacao:'10/04/2025' },
  { id:16, curso:'Terraplanagem na Prática',                categoria:'Terraplanagem',          cargaHoraria:'20h', validadeMeses:12, totalEmitidos:89,  cor:'#854d0e', corSecundaria:'#fde68a', icone:'🚜', descricao:'Fundamentos práticos de terraplanagem e movimentação de terra em obras.',                       status:'Ativo',   dataCriacao:'15/04/2025' },
]

const categorias = ['Todas as categorias', ...Array.from(new Set(certificadosMock.map(c => c.categoria))).sort()]
const statusOpcoes = ['Todos', 'Ativo', 'Inativo']

function CertificadoSVG({ cert, mini = false }: { cert: Certificado; mini?: boolean }) {
  const W = mini ? 320 : 640
  const H = mini ? 200 : 400

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: mini ? '0' : '8px' }}
    >
      <rect width={W} height={H} fill="#050d1a" rx={mini ? 4 : 8} />
      <rect width={W} height={mini ? 6 : 12} fill={cert.cor} rx={mini ? 4 : 8} />
      <rect y={mini ? 3 : 6} width={W} height={mini ? 3 : 6} fill={cert.cor} opacity="0.5" />
      <rect x={mini ? 8 : 16} y={mini ? 12 : 24} width={W - (mini ? 16 : 32)} height={H - (mini ? 20 : 40)} fill="none" stroke={cert.cor} strokeWidth={mini ? 0.5 : 1} strokeOpacity="0.3" rx={mini ? 3 : 6} strokeDasharray={mini ? "4 2" : "8 4"} />
      <circle cx={W * 0.85} cy={H * 0.25} r={mini ? 40 : 80} fill={cert.cor} opacity="0.05" />
      <circle cx={W * 0.15} cy={H * 0.75} r={mini ? 30 : 60} fill={cert.cor} opacity="0.04" />
      <circle cx={W * 0.85} cy={H * 0.25} r={mini ? 25 : 50} fill={cert.cor} opacity="0.04" />
      <text x={mini ? 20 : 40} y={mini ? 30 : 58} fontFamily="Inter,sans-serif" fontSize={mini ? 7 : 13} fontWeight="700" fill="#ffffff" opacity="0.9" letterSpacing={mini ? 1 : 2}>
        EDECONSIL
      </text>
      <text x={mini ? 20 : 40} y={mini ? 38 : 72} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 9} fill={cert.cor} letterSpacing={mini ? 1 : 2} opacity="0.9">
        UNIVERSIDADE CORPORATIVA
      </text>
      <line x1={mini ? 20 : 40} y1={mini ? 43 : 84} x2={W - (mini ? 20 : 40)} y2={mini ? 43 : 84} stroke={cert.cor} strokeWidth={mini ? 0.3 : 0.5} opacity="0.4" />
      <text x={W / 2} y={mini ? 65 : 128} fontFamily="Inter,sans-serif" fontSize={mini ? 8 : 15} fontWeight="300" fill="#ffffff" opacity="0.5" textAnchor="middle" letterSpacing={mini ? 3 : 6}>
        CERTIFICADO DE CONCLUSÃO
      </text>
      <text x={W / 2} y={mini ? 90 : 178} fontFamily="sans-serif" fontSize={mini ? 22 : 44} textAnchor="middle">
        {cert.icone}
      </text>
      {cert.curso.length > (mini ? 30 : 45) ? (
        <>
          <text x={W / 2} y={mini ? 108 : 214} fontFamily="Inter,sans-serif" fontSize={mini ? 8 : 16} fontWeight="700" fill="#ffffff" textAnchor="middle">
            {cert.curso.substring(0, mini ? 30 : 45)}
          </text>
          <text x={W / 2} y={mini ? 118 : 234} fontFamily="Inter,sans-serif" fontSize={mini ? 8 : 16} fontWeight="700" fill="#ffffff" textAnchor="middle">
            {cert.curso.substring(mini ? 30 : 45)}
          </text>
        </>
      ) : (
        <text x={W / 2} y={mini ? 112 : 222} fontFamily="Inter,sans-serif" fontSize={mini ? 9 : 18} fontWeight="700" fill="#ffffff" textAnchor="middle">
          {cert.curso}
        </text>
      )}
      <text x={W / 2} y={mini ? 127 : 252} fontFamily="Inter,sans-serif" fontSize={mini ? 6 : 12} fill={cert.cor} textAnchor="middle" opacity="0.9">
        {cert.categoria.toUpperCase()}
      </text>
      <line x1={W / 2 - (mini ? 30 : 60)} y1={mini ? 133 : 264} x2={W / 2 + (mini ? 30 : 60)} y2={mini ? 133 : 264} stroke={cert.cor} strokeWidth={mini ? 0.4 : 0.8} opacity="0.5" />
      <circle cx={W / 2} cy={mini ? 148 : 294} r={mini ? 10 : 20} fill={cert.cor} opacity="0.15" />
      <circle cx={W / 2} cy={mini ? 148 : 294} r={mini ? 7 : 14} fill={cert.cor} opacity="0.25" />
      <text x={W / 2} y={mini ? 152 : 301} fontFamily="sans-serif" fontSize={mini ? 8 : 15} textAnchor="middle">⭐</text>
      <text x={mini ? 24 : 48} y={mini ? 175 : 348} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 10} fill="#ffffff" opacity="0.4">
        Carga Horária: {cert.cargaHoraria}
      </text>
      <text x={W / 2} y={mini ? 175 : 348} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 10} fill="#ffffff" opacity="0.4" textAnchor="middle">
        Validade: {cert.validadeMeses} meses
      </text>
      <text x={W - (mini ? 24 : 48)} y={mini ? 175 : 348} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 10} fill="#ffffff" opacity="0.4" textAnchor="end">
        Emitidos: {cert.totalEmitidos}
      </text>
      <rect y={H - (mini ? 6 : 12)} width={W} height={mini ? 6 : 12} fill={cert.cor} opacity="0.6" rx={mini ? 4 : 8} />
    </svg>
  )
}

function ModalCertificado({ cert, onFechar, C }: { cert: Certificado; onFechar: () => void; C: Record<string, string> }) {
  return (
    <div
      onClick={onFechar}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.surface, borderRadius: '16px', width: '100%', maxWidth: '720px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: `1px solid ${C.border}` }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '20px', background: cert.cor, borderRadius: '2px' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: 0 }}>{cert.curso}</p>
              <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{cert.categoria}</p>
            </div>
          </div>
          <button onClick={onFechar} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color={C.muted} />
          </button>
        </div>
        <div style={{ background: '#050d1a' }}>
          <CertificadoSVG cert={cert} mini={false} />
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Carga Horária', valor: cert.cargaHoraria },
              { label: 'Validade',      valor: `${cert.validadeMeses} meses` },
              { label: 'Emitidos',      valor: cert.totalEmitidos.toString() },
              { label: 'Desde',         valor: cert.dataCriacao },
            ].map(i => (
              <div key={i.label}>
                <div style={{ fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{i.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{i.valor}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 500, color: C.text, cursor: 'pointer' }}>
              <Edit size={13} /> Editar
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: cert.cor, border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
              <Download size={13} /> Baixar modelo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CertificadosAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas as categorias')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [modalCert, setModalCert] = useState<Certificado | null>(null)
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid')

  const certsFiltrados = useMemo(() => {
    return certificadosMock.filter(c => {
      const matchBusca     = c.curso.toLowerCase().includes(busca.toLowerCase()) ||
                             c.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoriaFiltro === 'Todas as categorias' || c.categoria === categoriaFiltro
      const matchStatus    = statusFiltro === 'Todos' || c.status === statusFiltro
      return matchBusca && matchCategoria && matchStatus
    })
  }, [busca, categoriaFiltro, statusFiltro])

  const totalEmitidos = certificadosMock.reduce((s, c) => s + c.totalEmitidos, 0)
  const totalAtivos   = certificadosMock.filter(c => c.status === 'Ativo').length
  const mediaEmissoes = Math.round(totalEmitidos / certificadosMock.length)

  return (
    <LayoutAdmin
      paginaAtiva="certificadosAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Certificados"
      topbarSubtitulo="Gerencie os modelos de certificados emitidos pela plataforma."
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Certificados</h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {certsFiltrados.length} de {certificadosMock.length} modelos
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px', overflow: 'hidden' }}>
              {(['grid', 'lista'] as const).map(v => (
                <button key={v} onClick={() => setVisualizacao(v)} style={{ padding: '7px 14px', background: visualizacao === v ? C.blue : 'none', color: visualizacao === v ? '#fff' : C.muted, border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, transition: 'all 150ms' }}>
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
            <button
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 150ms' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Plus size={14} /> Novo Certificado
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Modelos de Certificado', valor: certificadosMock.length,            icon: Award,        cor: C.blue    },
            { label: 'Modelos Ativos',         valor: totalAtivos,                        icon: CheckCircle,  cor: '#10b981' },
            { label: 'Total Emitidos',         valor: totalEmitidos.toLocaleString(),     icon: Users,        cor: '#f59e0b' },
            { label: 'Média por Curso',        valor: mediaEmissoes,                      icon: Award,        cor: '#8b5cf6' },
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
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por curso ou categoria..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, minWidth: 0 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} style={{ appearance: 'none', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px', color: C.text, cursor: 'pointer', outline: 'none', minWidth: '200px' }}>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} style={{ appearance: 'none', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px', color: C.text, cursor: 'pointer', outline: 'none', minWidth: '130px' }}>
              {statusOpcoes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          {(busca || categoriaFiltro !== 'Todas as categorias' || statusFiltro !== 'Todos') && (
            <button onClick={() => { setBusca(''); setCategoriaFiltro('Todas as categorias'); setStatusFiltro('Todos') }} style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Grid de cards */}
        {visualizacao === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {certsFiltrados.map(cert => (
              <div
                key={cert.id}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 200ms, box-shadow 200ms' }}
                onClick={() => setModalCert(cert)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.20)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ background: '#050d1a', overflow: 'hidden', aspectRatio: '1.6/1' }}>
                  <CertificadoSVG cert={cert} mini={true} />
                </div>
                <div style={{ padding: '12px 14px', borderTop: `3px solid ${cert.cor}` }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {cert.curso}
                  </p>
                  <p style={{ fontSize: '11px', color: C.muted, margin: '0 0 10px' }}>{cert.categoria}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} color={C.muted} />
                        <span style={{ fontSize: '11px', color: C.muted }}>{cert.cargaHoraria}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Users size={11} color={C.muted} />
                        <span style={{ fontSize: '11px', color: C.muted }}>{cert.totalEmitidos}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      color: cert.status === 'Ativo' ? '#10b981' : '#ef4444',
                      background: cert.status === 'Ativo' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                      border: `0.5px solid ${cert.status === 'Ativo' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      borderRadius: '6px', padding: '2px 8px',
                    }}>
                      {cert.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{ background: C.surface, border: `2px dashed ${C.border}`, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '32px 16px', cursor: 'pointer', transition: 'all 150ms', minHeight: '220px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(26,86,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={22} color={C.blue} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: C.blue, margin: '0 0 4px' }}>Criar novo modelo</p>
                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Clique para adicionar</p>
              </div>
            </div>
          </div>
        )}

        {/* Visualização em lista */}
        {visualizacao === 'lista' && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 2fr 1.2fr 80px 80px 100px 80px 80px', background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
              {['', 'Curso', 'Categoria', 'Carga', 'Validade', 'Emitidos', 'Status', 'Ações'].map((h, i) => (
                <div key={i} style={{ padding: '12px 12px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: i < 7 ? `1px solid ${C.border}` : 'none' }}>
                  {h}
                </div>
              ))}
            </div>
            {certsFiltrados.map((cert, idx) => (
              <div
                key={cert.id}
                style={{ display: 'grid', gridTemplateColumns: '48px 2fr 1.2fr 80px 80px 100px 80px 80px', borderBottom: idx < certsFiltrados.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 150ms', cursor: 'pointer' }}
                onClick={() => setModalCert(cert)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: cert.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{cert.icone}</div>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{cert.curso}</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted2 }}>{cert.categoria}</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.text, fontWeight: 600 }}>{cert.cargaHoraria}</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted }}>{cert.validadeMeses}m</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: C.text }}>{cert.totalEmitidos}</span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: cert.status === 'Ativo' ? '#10b981' : '#ef4444', background: cert.status === 'Ativo' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)', border: `0.5px solid ${cert.status === 'Ativo' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: '6px', padding: '2px 8px' }}>
                    {cert.status}
                  </span>
                </div>
                <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[Eye, Edit].map((Icon, i) => (
                    <button
                      key={i}
                      onClick={e => { e.stopPropagation(); if (i === 0) setModalCert(cert) }}
                      style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'none', border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,86,255,0.10)'; e.currentTarget.style.borderColor = C.blue }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = C.border }}
                    >
                      <Icon size={12} color={C.muted} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {certsFiltrados.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>🔍</span>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhum certificado encontrado</p>
            <button
              onClick={() => { setBusca(''); setCategoriaFiltro('Todas as categorias'); setStatusFiltro('Todos') }}
              style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}
            >
              Limpar filtros
            </button>
          </div>
        )}

      </div>

      {modalCert && (
        <ModalCertificado
          cert={modalCert}
          onFechar={() => setModalCert(null)}
          C={C as Record<string, string>}
        />
      )}
    </LayoutAdmin>
  )
}
