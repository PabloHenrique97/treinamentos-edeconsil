import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { bibliotecaAPI } from '../../services/api'

interface Props {
  onFechar:  () => void
  onSucesso: (material: any) => void
}

const CATEGORIAS = [
  'Gestão e Suprimentos', 'Segurança do Trabalho',
  'Obras e Infraestrutura', 'Administrativo',
  'Equipamentos', 'Tecnologia da Informação',
  'Recursos Humanos', 'Qualidade',
  'Jurídico e Compliance', 'Financeiro',
  'Gestão de Pessoas', 'Saúde Ocupacional',
  'Engenharia', 'Manutenção', 'Geral',
]

const CORES = [
  '#0d2550', '#1a56ff', '#10b981', '#ef4444',
  '#f59e0b', '#7c3aed', '#ec4899', '#0891b2',
]

export function ModalAdicionarMaterial({ onFechar, onSucesso }: Props) {
  const { C } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)

  const [arquivo,       setArquivo]       = useState<File | null>(null)
  const [titulo,        setTitulo]        = useState('')
  const [autor,         setAutor]         = useState('')
  const [categoria,     setCategoria]     = useState('')
  const [ano,           setAno]           = useState('')
  const [descricao,     setDescricao]     = useState('')
  const [cor,           setCor]           = useState('#0d2550')
  const [destaque,      setDestaque]      = useState(false)
  const [enviando,      setEnviando]      = useState(false)
  const [erro,          setErro]          = useState('')
  const [sucesso,       setSucesso]       = useState(false)
  const [materialCriado, setMaterialCriado] = useState<any>(null)
  const [dragOver,      setDragOver]      = useState(false)

  const stopKeys = useCallback((e: React.KeyboardEvent) => e.stopPropagation(), [])

  const processarArquivo = (file: File) => {
    if (file.type !== 'application/pdf') { setErro('Apenas arquivos PDF são aceitos.'); return }
    if (file.size > 50 * 1024 * 1024)   { setErro('Arquivo muito grande. Máximo: 50MB.'); return }
    setErro('')
    setArquivo(file)
    if (!titulo) setTitulo(file.name.replace(/\.pdf$/i, '').replace(/_/g, ' '))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processarArquivo(file)
  }

  const handleEnviar = async () => {
    setErro('')
    if (!arquivo)       { setErro('Selecione um arquivo PDF.'); return }
    if (!titulo.trim()) { setErro('Título é obrigatório.'); return }
    if (!categoria)     { setErro('Selecione a categoria.'); return }

    setEnviando(true)
    try {
      const form = new FormData()
      form.append('arquivo',   arquivo)
      form.append('titulo',    titulo.trim())
      form.append('autor',     autor.trim())
      form.append('categoria', categoria)
      form.append('ano',       ano)
      form.append('descricao', descricao.trim())
      form.append('cor',       cor)
      form.append('destaque',  String(destaque))
      form.append('tipo',      'PDF')
      form.append('status',    'ativo')

      const resultado = await bibliotecaAPI.upload(form) as any
      setMaterialCriado(resultado.material)
      setSucesso(true)
      onSucesso(resultado.material)
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao fazer upload.')
    } finally {
      setEnviando(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '9px 13px', background: C.surface2,
    border: `1px solid ${C.border}`, borderRadius: '8px',
    fontSize: '13px', color: C.text, outline: 'none',
    fontFamily: 'inherit',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: C.muted,
    display: 'block', marginBottom: '5px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  }
  const onFocus = (e: React.FocusEvent<any>) => (e.target.style.borderColor = cor)
  const onBlur  = (e: React.FocusEvent<any>) => (e.target.style.borderColor = C.border)

  if (sucesso && materialCriado) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
          Material adicionado!
        </h3>
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '16px', margin: '16px 0', textAlign: 'left' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>{materialCriado.titulo}</p>
          <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 4px' }}>{materialCriado.categoria} · {materialCriado.tipo}</p>
          <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>Arquivo: {materialCriado.arquivo_nome}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setSucesso(false); setArquivo(null)
              setTitulo(''); setAutor(''); setCategoria('')
              setAno(''); setDescricao(''); setMaterialCriado(null)
            }}
            style={{ padding: '10px 20px', background: cor, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}
          >
            + Adicionar outro
          </button>
          <button onClick={onFechar}
            style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, cursor: 'pointer' }}>
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {erro && (
        <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ef4444', marginBottom: '16px' }}>
          ⚠️ {erro}
        </div>
      )}

      {/* Área de drop */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !arquivo && fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? cor : arquivo ? '#10b981' : C.border}`,
          borderRadius: '12px', padding: '28px', textAlign: 'center',
          cursor: arquivo ? 'default' : 'pointer',
          background: dragOver ? `${cor}08` : arquivo ? 'rgba(16,185,129,0.06)' : C.surface2,
          transition: 'all 200ms', marginBottom: '20px',
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf,application/pdf"
          onChange={e => { const f = e.target.files?.[0]; if (f) processarArquivo(f) }}
          style={{ display: 'none' }} />

        {arquivo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="#10b981" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>{arquivo.name}</p>
              <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{(arquivo.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setArquivo(null); setTitulo('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '4px' }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={36} color={C.muted} style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, margin: '0 0 4px' }}>
              Arraste o PDF aqui ou clique para selecionar
            </p>
            <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Apenas PDF · Máximo 50MB</p>
          </>
        )}
      </div>

      {/* Cor da capa */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Cor da capa</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {CORES.map(c => (
            <button key={c} onClick={() => setCor(c)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, border: `3px solid ${cor === c ? C.text : 'transparent'}`, cursor: 'pointer', outline: 'none', boxShadow: cor === c ? `0 0 0 2px ${C.bg ?? '#fff'}, 0 0 0 4px ${c}` : 'none', flexShrink: 0 }} />
          ))}
          <input type="color" value={cor} onChange={e => setCor(e.target.value)}
            title="Cor personalizada"
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>

      {/* Título */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Título <span style={{ color: '#ef4444' }}>*</span></label>
        <input type="text" value={titulo}
          onChange={e => setTitulo(e.target.value)}
          onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
          placeholder="Nome do livro ou material"
          style={inputStyle} autoComplete="off" />
      </div>

      {/* Autor + Ano */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Autor</label>
          <input type="text" value={autor}
            onChange={e => setAutor(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            placeholder="Nome do autor"
            style={inputStyle} autoComplete="off" />
        </div>
        <div>
          <label style={labelStyle}>Ano</label>
          <input type="number" value={ano}
            onChange={e => setAno(e.target.value)}
            onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
            placeholder={String(new Date().getFullYear())}
            min={1900} max={2030} style={inputStyle} />
        </div>
      </div>

      {/* Categoria */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Categoria <span style={{ color: '#ef4444' }}>*</span></label>
        <select value={categoria}
          onChange={e => setCategoria(e.target.value)}
          onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
          style={{ ...inputStyle, cursor: 'pointer', color: categoria ? C.text : C.muted }}>
          <option value="">Selecione a categoria</option>
          {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Descrição */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Descrição</label>
        <textarea value={descricao}
          onChange={e => setDescricao(e.target.value)}
          onKeyDown={stopKeys} onFocus={onFocus} onBlur={onBlur}
          placeholder="Breve descrição do conteúdo..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {/* Destaque toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '10px 14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px' }}>
        <button onClick={() => setDestaque(!destaque)}
          style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer', background: destaque ? cor : C.border, position: 'relative', transition: 'background 200ms', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: '2px', left: destaque ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
        </button>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 1px' }}>Material em destaque</p>
          <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>Aparece primeiro na biblioteca</p>
        </div>
      </div>

      {/* Preview da capa */}
      {titulo && (
        <div style={{ marginBottom: '20px', padding: '14px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preview da capa</p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <svg width="60" height="84" viewBox="0 0 60 84" style={{ borderRadius: '4px', boxShadow: '2px 3px 8px rgba(0,0,0,0.25)', flexShrink: 0 }}>
              <defs>
                <linearGradient id="prev-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={cor} />
                  <stop offset="100%" stopColor={cor} stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <rect width="60" height="84" fill="url(#prev-grad)" rx="3" />
              <rect x="0" y="0" width="6" height="84" fill="rgba(0,0,0,0.20)" rx="3" />
              <text x="33" y="32" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="20">📄</text>
              <text x="33" y="52" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">
                {titulo.slice(0, 12)}
              </text>
              {titulo.length > 12 && (
                <text x="33" y="62" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" fontFamily="sans-serif">
                  {titulo.slice(12, 24)}{titulo.length > 24 ? '…' : ''}
                </text>
              )}
            </svg>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 3px' }}>{titulo}</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: '0 0 2px' }}>{autor || 'Autor não informado'}</p>
              <p style={{ fontSize: '11px', color: C.muted, margin: 0 }}>{categoria || 'Sem categoria'} · {ano || new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onFechar}
          style={{ padding: '10px 20px', background: 'none', border: `1.5px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button onClick={handleEnviar} disabled={enviando || !arquivo}
          style={{ padding: '10px 24px', background: arquivo ? cor : C.border, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: arquivo && !enviando ? 'pointer' : 'not-allowed', opacity: enviando ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {enviando
            ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Enviando...</>
            : <><Upload size={14} /> Adicionar à biblioteca</>}
        </button>
      </div>
    </div>
  )
}
