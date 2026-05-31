import { useState, useMemo, useEffect } from 'react'
import {
  Search, Filter, ChevronDown, ChevronLeft,
  ChevronRight, X, Download, Heart,
  BookOpen, Star, Plus,
  FileText, BookMarked, Newspaper,
  ClipboardList, Tablet
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { bibliotecaAPI } from '../../services/api'

type TipoMaterial = 'Livro' | 'Artigo' | 'Manual' | 'Norma' | 'E-book'

interface Material {
  id: string
  titulo: string
  autor: string
  tipo: TipoMaterial
  categoria: string
  ano: number
  paginas: number
  descricao: string
  cor: string
  url: string | null
  downloads: number
  favoritos: number
  status: 'Disponível' | 'Em revisão'
  destaque: boolean
}

const tipos: TipoMaterial[] = ['Livro', 'Artigo', 'Manual', 'Norma', 'E-book']
const ITENS_POR_PAGINA = 12

const ICONE_TIPO: Record<TipoMaterial, string> = {
  'Livro':  '📖',
  'Artigo': '📄',
  'Manual': '📋',
  'Norma':  '📜',
  'E-book': '💻',
}

function CapaLivroSVG({ mat, mini = false }: { mat: Material; mini?: boolean }) {
  const W = mini ? 120 : 280
  const H = mini ? 160 : 380
  const iconeTipo = ICONE_TIPO[mat.tipo] ?? '📚'

  const maxChars = mini ? 18 : 28
  const words = mat.titulo.split(' ')
  const lines: string[] = []
  let currentLine = ''
  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine) lines.push(currentLine)
  const maxLines = mini ? 3 : 4
  const displayLines = lines.slice(0, maxLines)
  if (lines.length > maxLines) displayLines[maxLines - 1] += '...'
  const lineH = mini ? 9 : 18
  const startY = mini ? 105 : 240

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${mat.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={mat.cor} />
          <stop offset="100%" stopColor={mat.cor} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Sombra */}
      <rect x={mini ? 6 : 14} y={mini ? 4 : 10} width={W - (mini ? 12 : 24)} height={H - (mini ? 8 : 16)} rx={mini ? 3 : 6} fill="rgba(0,0,0,0.35)" />

      {/* Capa principal */}
      <rect x={mini ? 2 : 4} y={mini ? 2 : 4} width={W - (mini ? 12 : 24)} height={H - (mini ? 8 : 16)} rx={mini ? 3 : 6} fill={`url(#grad-${mat.id})`} />

      {/* Lombada */}
      <rect x={W - (mini ? 12 : 24)} y={mini ? 2 : 4} width={mini ? 10 : 20} height={H - (mini ? 8 : 16)} rx={mini ? 2 : 4} fill={mat.cor} opacity="0.6" />
      <line x1={W - (mini ? 12 : 24)} y1={mini ? 2 : 4} x2={W - (mini ? 12 : 24)} y2={H - (mini ? 6 : 12)} stroke="rgba(0,0,0,0.2)" strokeWidth={mini ? 0.5 : 1} />

      {/* Decoração de fundo */}
      <circle cx={W * 0.3} cy={H * 0.2} r={mini ? 20 : 50} fill="white" opacity="0.04" />
      <circle cx={W * 0.7} cy={H * 0.8} r={mini ? 25 : 60} fill="white" opacity="0.04" />
      <rect x={mini ? 4 : 8} y={mini ? 8 : 18} width={W - (mini ? 20 : 48)} height={H - (mini ? 16 : 36)} rx={mini ? 2 : 4} fill="none" stroke="white" strokeWidth={mini ? 0.3 : 0.6} opacity="0.15" strokeDasharray={mini ? "3 2" : "6 4"} />

      {/* Badge tipo */}
      <rect x={mini ? 6 : 12} y={mini ? 8 : 18} width={mini ? 28 : 56} height={mini ? 10 : 20} rx={mini ? 2 : 4} fill="rgba(0,0,0,0.3)" />
      <text x={mini ? 20 : 40} y={mini ? 15 : 32} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 9} fontWeight="700" fill="white" textAnchor="middle" letterSpacing={mini ? 0.5 : 1}>
        {mat.tipo.toUpperCase()}
      </text>

      {/* Ícone central */}
      <text x={(W - (mini ? 12 : 24)) / 2} y={mini ? 72 : 168} fontFamily="sans-serif" fontSize={mini ? 28 : 64} textAnchor="middle">
        {iconeTipo}
      </text>

      {/* Linha separadora */}
      <line x1={mini ? 10 : 20} y1={mini ? 95 : 220} x2={W - (mini ? 20 : 44)} y2={mini ? 95 : 220} stroke="white" strokeWidth={mini ? 0.4 : 0.8} opacity="0.3" />

      {/* Linhas de título */}
      {displayLines.map((line, i) => (
        <text key={i} x={(W - (mini ? 12 : 24)) / 2} y={startY + i * lineH} fontFamily="Inter,sans-serif" fontSize={mini ? 7 : 13} fontWeight="700" fill="white" textAnchor="middle" opacity="0.95">
          {line}
        </text>
      ))}

      {/* Autor */}
      <text x={(W - (mini ? 12 : 24)) / 2} y={mini ? 140 : 330} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 10} fill="white" textAnchor="middle" opacity="0.6">
        {mat.autor.length > (mini ? 20 : 35) ? mat.autor.substring(0, mini ? 20 : 35) + '...' : mat.autor}
      </text>

      {/* Ano */}
      <text x={(W - (mini ? 12 : 24)) / 2} y={mini ? 150 : 350} fontFamily="Inter,sans-serif" fontSize={mini ? 5 : 9} fill="white" textAnchor="middle" opacity="0.5">
        {mat.ano}
      </text>
    </svg>
  )
}

function IconeTipo({ tipo, size = 14, color }: { tipo: TipoMaterial; size?: number; color: string }) {
  const map: Record<TipoMaterial, React.ElementType> = {
    'Livro':  BookOpen,
    'Artigo': Newspaper,
    'Manual': ClipboardList,
    'Norma':  FileText,
    'E-book': Tablet,
  }
  const Icon = map[tipo] ?? BookOpen
  return <Icon size={size} color={color} />
}

function ModalMaterial({ mat, onFechar, C }: { mat: Material; onFechar: () => void; C: Record<string, string> }) {
  return (
    <div onClick={onFechar} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.80)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, borderRadius: '16px', width: '100%', maxWidth: '760px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', border: `1px solid ${C.border}` }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '20px', background: mat.cor, borderRadius: '2px' }} />
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: mat.cor, background: `${mat.cor}18`, borderRadius: '4px', padding: '2px 8px', marginBottom: '4px', display: 'inline-block' }}>{mat.tipo}</span>
              <p style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: '2px 0 0' }}>{mat.titulo}</p>
            </div>
          </div>
          <button onClick={onFechar} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color={C.muted} />
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
          {/* Capa */}
          <div style={{ background: C.surface2, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
            <div style={{ width: '140px' }}>
              <CapaLivroSVG mat={mat} mini={false} />
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: C.muted2, margin: 0, lineHeight: 1.7 }}>{mat.descricao}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Autor',     valor: mat.autor              },
                { label: 'Categoria', valor: mat.categoria          },
                { label: 'Ano',       valor: mat.ano.toString()     },
                { label: 'Páginas',   valor: `${mat.paginas} páginas` },
                { label: 'Downloads', valor: mat.downloads.toString() },
                { label: 'Favoritos', valor: mat.favoritos.toString() },
              ].map(info => (
                <div key={info.label} style={{ background: C.surface2, borderRadius: '8px', padding: '10px 12px', border: `0.5px solid ${C.border}` }}>
                  <div style={{ fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{info.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>{info.valor}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 500, color: C.text, cursor: 'pointer' }}>
                <Heart size={14} /> Favoritar
              </button>
              <button style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: mat.cor, border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                <Download size={14} /> Baixar material
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BibliotecaAdmin({ onNavigate, onLogout }: {
  onNavigate: (page: string) => void
  onLogout: () => void
}) {
  const { C } = useTheme()
  const [materiais, setMateriais] = useState<Material[]>([])
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas as categorias')
  const [tipoFiltro, setTipoFiltro] = useState<'Todos' | TipoMaterial>('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')
  const [apenasDestaques, setApenasDestaques] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [modalMat, setModalMat] = useState<Material | null>(null)
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid')

  useEffect(() => {
    ;(bibliotecaAPI.listar() as Promise<any[]>).then(rows => {
      setMateriais((rows ?? []).map((r: any) => ({
        id: r.id, titulo: r.titulo, autor: r.autor ?? '',
        tipo: r.tipo as TipoMaterial, categoria: r.categoria ?? '',
        ano: r.ano ?? 0, paginas: r.paginas ?? 0, descricao: r.descricao ?? '',
        cor: r.cor ?? '#1a56ff', url: r.url ?? null,
        downloads: r.downloads ?? 0, favoritos: r.favoritos ?? 0,
        status: r.status as 'Disponível' | 'Em revisão', destaque: r.destaque ?? false,
      })))
    }).catch(() => {})
  }, [])

  const categorias = useMemo(() => (
    ['Todas as categorias', ...Array.from(new Set(materiais.map(m => m.categoria))).sort()]
  ), [materiais])

  const materiaiFiltrados = useMemo(() => {
    return materiais.filter(m => {
      const matchBusca     = m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                             m.autor.toLowerCase().includes(busca.toLowerCase()) ||
                             m.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoriaFiltro === 'Todas as categorias' || m.categoria === categoriaFiltro
      const matchTipo      = tipoFiltro === 'Todos' || m.tipo === tipoFiltro
      const matchStatus    = statusFiltro === 'Todos' || m.status === statusFiltro
      const matchDestaque  = !apenasDestaques || m.destaque
      return matchBusca && matchCategoria && matchTipo && matchStatus && matchDestaque
    })
  }, [materiais, busca, categoriaFiltro, tipoFiltro, statusFiltro, apenasDestaques])

  const totalPaginas = Math.ceil(materiaiFiltrados.length / ITENS_POR_PAGINA)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const materiaisPagina = materiaiFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  const irPagina = (p: number) => { if (p >= 1 && p <= totalPaginas) setPaginaAtual(p) }

  const limparFiltros = () => {
    setBusca(''); setCategoriaFiltro('Todas as categorias')
    setTipoFiltro('Todos'); setStatusFiltro('Todos')
    setApenasDestaques(false); setPaginaAtual(1)
  }

  const totalDownloads = materiais.reduce((s, m) => s + m.downloads, 0)
  const totalFavoritos = materiais.reduce((s, m) => s + m.favoritos, 0)

  const corTipo = (t: string) => ({
    'Livro':  C.blue,    'Artigo': '#10b981',
    'Manual': '#f59e0b', 'Norma':  '#dc2626', 'E-book': '#8b5cf6',
  }[t] ?? C.blue)

  const hayFiltroAtivo = busca || categoriaFiltro !== 'Todas as categorias' || tipoFiltro !== 'Todos' || statusFiltro !== 'Todos' || apenasDestaques

  return (
    <LayoutAdmin
      paginaAtiva="bibliotecaAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Biblioteca Digital"
      topbarSubtitulo="Acervo de livros, artigos, manuais e normas para os colaboradores."
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Biblioteca Digital</h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {materiaiFiltrados.length} de {materiais.length} materiais
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
              <Plus size={14} /> Adicionar Material
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total de Materiais', valor: materiais.length,                                                                     icon: BookOpen,    cor: C.blue    },
            { label: 'Livros',             valor: materiais.filter(m => m.tipo === 'Livro').length,                                      icon: BookMarked,  cor: '#7c3aed' },
            { label: 'Artigos e Normas',   valor: materiais.filter(m => m.tipo === 'Artigo' || m.tipo === 'Norma').length,               icon: FileText,    cor: '#dc2626' },
            { label: 'Total Downloads',    valor: totalDownloads.toLocaleString(),                                                           icon: Download,    cor: '#10b981' },
            { label: 'Total Favoritos',    valor: totalFavoritos,                                                                            icon: Heart,       cor: '#f59e0b' },
          ].map(m => (
            <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${m.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <m.icon size={18} color={m.cor} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: C.text, lineHeight: 1 }}>{m.valor}</div>
                <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pills de tipo */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(['Todos', ...tipos] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTipoFiltro(t as typeof tipoFiltro); setPaginaAtual(1) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '20px',
                border: `1.5px solid ${tipoFiltro === t ? corTipo(t) : C.border}`,
                background: tipoFiltro === t ? `${corTipo(t)}15` : C.surface,
                color: tipoFiltro === t ? corTipo(t) : C.muted,
                fontSize: '12px', fontWeight: tipoFiltro === t ? 700 : 400,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {t !== 'Todos' && <IconeTipo tipo={t as TipoMaterial} size={12} color={tipoFiltro === t ? corTipo(t) : C.muted} />}
              {t}
            </button>
          ))}
          <button
            onClick={() => { setApenasDestaques(!apenasDestaques); setPaginaAtual(1) }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px',
              border: `1.5px solid ${apenasDestaques ? '#f59e0b' : C.border}`,
              background: apenasDestaques ? 'rgba(245,158,11,0.12)' : C.surface,
              color: apenasDestaques ? '#f59e0b' : C.muted,
              fontSize: '12px', fontWeight: apenasDestaques ? 700 : 400,
              cursor: 'pointer', transition: 'all 150ms', marginLeft: 'auto',
            }}
          >
            <Star size={12} color={apenasDestaques ? '#f59e0b' : C.muted} />
            Destaques
          </button>
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
              placeholder="Buscar por título, autor ou categoria..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1, minWidth: 0 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select value={categoriaFiltro} onChange={e => { setCategoriaFiltro(e.target.value); setPaginaAtual(1) }} style={{ appearance: 'none', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 32px 8px 12px', fontSize: '13px', color: C.text, cursor: 'pointer', outline: 'none', minWidth: '200px' }}>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} color={C.muted} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
          {hayFiltroAtivo && (
            <button onClick={limparFiltros} style={{ background: 'none', border: 'none', fontSize: '12px', color: C.blue, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Grid de livros */}
        {visualizacao === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {materiaisPagina.map(mat => (
              <div
                key={mat.id}
                onClick={() => setModalMat(mat)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'transform 200ms' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '4px 4px 12px rgba(0,0,0,0.3)' }}>
                  <CapaLivroSVG mat={mat} mini={true} />
                  {mat.destaque && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#f59e0b', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star size={10} color="#fff" fill="#fff" />
                    </div>
                  )}
                  {mat.status === 'Em revisão' && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '4px', textAlign: 'center' }}>
                      <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: 700 }}>EM REVISÃO</span>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                    <IconeTipo tipo={mat.tipo} size={10} color={corTipo(mat.tipo)} />
                    <span style={{ fontSize: '9px', fontWeight: 700, color: corTipo(mat.tipo), textTransform: 'uppercase', letterSpacing: '0.5px' }}>{mat.tipo}</span>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: C.text, margin: '0 0 2px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                    {mat.titulo}
                  </p>
                  <p style={{ fontSize: '10px', color: C.muted, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mat.autor}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: C.muted, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Download size={9} /> {mat.downloads}
                    </span>
                    <span style={{ fontSize: '10px', color: C.muted, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Heart size={9} /> {mat.favoritos}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Card adicionar */}
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: C.surface, border: `2px dashed ${C.border}`, borderRadius: '8px', padding: '20px 12px', cursor: 'pointer', transition: 'all 150ms', minHeight: '180px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = 'rgba(26,86,255,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(26,86,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} color={C.blue} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: C.blue, margin: 0, textAlign: 'center' }}>Adicionar material</p>
            </div>
          </div>
        )}

        {/* Visualização em lista */}
        {visualizacao === 'lista' && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 80px 80px 80px 80px 80px', background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
              {['', 'Título', 'Autor', 'Tipo', 'Páginas', 'Downloads', 'Favoritos', 'Status'].map((h, i) => (
                <div key={i} style={{ padding: '12px', fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: i < 7 ? `1px solid ${C.border}` : 'none' }}>
                  {h}
                </div>
              ))}
            </div>
            {materiaiFiltrados.map((mat, idx) => (
              <div
                key={mat.id}
                onClick={() => setModalMat(mat)}
                style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 80px 80px 80px 80px 80px', borderBottom: idx < materiaiFiltrados.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
                  <div style={{ width: '24px', height: '32px', borderRadius: '2px', background: mat.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {ICONE_TIPO[mat.tipo] ?? '📚'}
                  </div>
                </div>
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {mat.destaque && <Star size={10} color="#f59e0b" fill="#f59e0b" />}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mat.titulo}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: C.muted }}>{mat.categoria} · {mat.ano}</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  <span style={{ fontSize: '12px', color: C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mat.autor}</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: corTipo(mat.tipo), background: `${corTipo(mat.tipo)}15`, borderRadius: '6px', padding: '2px 8px' }}>{mat.tipo}</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: '12px', color: C.muted }}>{mat.paginas}p</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderRight: `1px solid ${C.border}` }}>
                  <Download size={11} color={C.muted} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{mat.downloads}</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', borderRight: `1px solid ${C.border}` }}>
                  <Heart size={11} color="#f59e0b" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{mat.favoritos}</span>
                </div>
                <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: mat.status === 'Disponível' ? '#10b981' : '#f59e0b', background: mat.status === 'Disponível' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', border: `0.5px solid ${mat.status === 'Disponível' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`, borderRadius: '6px', padding: '2px 8px' }}>
                    {mat.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {materiaiFiltrados.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '12px' }}>
            <span style={{ fontSize: '40px' }}>📚</span>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, margin: 0 }}>Nenhum material encontrado</p>
            <button onClick={limparFiltros} style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '4px' }}>
              Limpar filtros
            </button>
          </div>
        )}

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: C.muted }}>
              Mostrando <strong style={{ color: C.text }}>{inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, materiaiFiltrados.length)}</strong> de <strong style={{ color: C.text }}>{materiaiFiltrados.length}</strong> materiais
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => irPagina(paginaAtual - 1)} disabled={paginaAtual === 1} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${C.border}`, background: paginaAtual === 1 ? C.surface2 : C.surface, color: paginaAtual === 1 ? C.muted : C.text, cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => irPagina(p)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${p === paginaAtual ? C.blue : C.border}`, background: p === paginaAtual ? C.blue : C.surface, color: p === paginaAtual ? '#fff' : C.text, fontWeight: p === paginaAtual ? 700 : 400, cursor: 'pointer', fontSize: '13px', transition: 'all 150ms' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => irPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${C.border}`, background: paginaAtual === totalPaginas ? C.surface2 : C.surface, color: paginaAtual === totalPaginas ? C.muted : C.text, cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

      {modalMat && (
        <ModalMaterial
          mat={modalMat}
          onFechar={() => setModalMat(null)}
          C={C as Record<string, string>}
        />
      )}
    </LayoutAdmin>
  )
}
