import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { LayoutAdmin } from '../../components/admin/LayoutAdmin'
import { certificadosAPI } from '../../services/api'

interface CertificadosAdminProps {
  onNavigate: (page: string) => void
  onLogout:   () => void
}

export function CertificadosAdmin({ onNavigate, onLogout }: CertificadosAdminProps) {
  const { C } = useTheme()
  const [certificados, setCertificados] = useState<any[]>([])
  const [total,        setTotal]        = useState(0)
  const [carregando,   setCarregando]   = useState(true)
  const [busca,        setBusca]        = useState('')
  const [pagina,       setPagina]       = useState(1)

  const carregar = async (p = 1, b = busca) => {
    setCarregando(true)
    try {
      const params: Record<string, string> = { pagina: String(p), limite: '20' }
      if (b) params.busca = b
      const data = await certificadosAPI.listarAdmin(params) as any
      setCertificados(data.certificados ?? [])
      setTotal(data.total ?? 0)
      setPagina(p)
    } catch (err) {
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const formatarData = (iso: string) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pt-BR')
  }

  return (
    <LayoutAdmin
      paginaAtiva="certificadosAdmin"
      onNavigate={onNavigate}
      onLogout={onLogout}
      topbarTitulo="Certificados"
      topbarSubtitulo="Certificados emitidos automaticamente ao aprovar nas avaliações."
    >
      <div style={{ padding: '28px 24px' }}>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
              Certificados Emitidos
            </h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              {total} certificado{total !== 1 ? 's' : ''} emitido{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Busca */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 14px', flex: 1 }}>
            <Search size={14} color={C.muted} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && carregar(1, busca)}
              placeholder="Buscar por aluno ou código..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1 }}
            />
          </div>
          <button onClick={() => carregar(1, busca)}
            style={{ padding: '9px 18px', background: C.blue, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            Buscar
          </button>
        </div>

        {/* Tabela */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.surface2 }}>
                {['Aluno', 'Curso', 'Código', 'Nota', 'Emitido em', 'Válido até', 'Setor'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: C.muted, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: `1px solid ${C.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                    Carregando...
                  </td>
                </tr>
              ) : certificados.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏆</div>
                    <p style={{ fontSize: '14px', color: C.text, margin: '0 0 4px', fontWeight: 600 }}>
                      Nenhum certificado emitido ainda
                    </p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>
                      Os certificados são gerados automaticamente quando um aluno é aprovado na avaliação final
                    </p>
                  </td>
                </tr>
              ) : certificados.map((cert, idx) => (
                <tr key={cert.id} style={{ borderBottom: idx < certificados.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{cert.aluno_nome}</p>
                    <p style={{ fontSize: '11px', color: C.muted, margin: 0, fontFamily: 'monospace' }}>
                      {cert.aluno_cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </p>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: C.text }}>
                    {cert.curso_titulo}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: C.blue, fontFamily: 'monospace', background: 'rgba(26,86,255,0.08)', border: '1px solid rgba(26,86,255,0.20)', borderRadius: '6px', padding: '3px 8px' }}>
                      {cert.codigo}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: (cert.nota_obtida ?? 0) >= 70 ? '#10b981' : '#ef4444' }}>
                    {cert.nota_obtida ?? '—'}%
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted }}>
                    {formatarData(cert.data_emissao)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted }}>
                    {cert.data_validade ? formatarData(cert.data_validade) : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: C.muted }}>
                    {cert.aluno_setor ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            <button onClick={() => carregar(pagina - 1)} disabled={pagina === 1}
              style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: '6px', fontSize: '13px', cursor: pagina === 1 ? 'not-allowed' : 'pointer', color: pagina === 1 ? C.muted : C.text }}>
              ← Anterior
            </button>
            <span style={{ padding: '8px 16px', fontSize: '13px', color: C.muted, alignSelf: 'center' }}>
              Página {pagina} de {Math.ceil(total / 20)}
            </span>
            <button onClick={() => carregar(pagina + 1)} disabled={pagina >= Math.ceil(total / 20)}
              style={{ padding: '8px 16px', background: C.blue, border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: 600 }}>
              Próxima →
            </button>
          </div>
        )}

      </div>
    </LayoutAdmin>
  )
}
