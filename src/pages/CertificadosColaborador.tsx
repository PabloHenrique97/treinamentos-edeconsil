import { useState } from 'react'
import { Award, BookOpen, ChevronRight, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'

/*
interface CertificadoObtido {
  id: number
  curso: string
  categoria: string
  dataEmissao: string
  validade: string
  cargaHoraria: string
  cor: string
  icone: string
  codigo: string
}

const certificadosObtidos: CertificadoObtido[] = []
*/

const temCertificados = false

function IlustracaoVazia({ C }: { C: Record<string, string> }) {
  return (
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="90" r="80" fill={C.blue} opacity="0.05" />
      <circle cx="100" cy="90" r="60" fill={C.blue} opacity="0.05" />

      {/* Diploma */}
      <rect x="52" y="54" width="96" height="72" rx="6" fill={C.surface2} stroke={C.border} strokeWidth="1.5" />
      <rect x="52" y="54" width="96" height="16" rx="6" fill={C.blue} opacity="0.15" />
      <rect x="52" y="62" width="96" height="8" fill={C.blue} opacity="0.15" />

      {/* Linhas de texto */}
      <rect x="68" y="82" width="64" height="4" rx="2" fill={C.border} />
      <rect x="76" y="92" width="48" height="4" rx="2" fill={C.border} />
      <rect x="80" y="102" width="40" height="4" rx="2" fill={C.border} />

      {/* Medalha */}
      <circle cx="100" cy="124" r="14" fill={C.blue} opacity="0.12" stroke={C.blue} strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="100" cy="124" r="9" fill={C.blue} opacity="0.10" />
      <text x="100" y="129" textAnchor="middle" fontSize="12" fontFamily="sans-serif">⭐</text>

      {/* Fita */}
      <line x1="96" y1="110" x2="93" y2="102" stroke={C.blue} strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
      <line x1="104" y1="110" x2="107" y2="102" stroke={C.blue} strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />

      {/* Chapéu */}
      <path d="M100 42 L120 52 L100 62 L80 52 Z" fill={C.blue} opacity="0.25" />
      <rect x="98" y="52" width="4" height="12" rx="2" fill={C.blue} opacity="0.30" />
      <circle cx="100" cy="65" r="3" fill={C.blue} opacity="0.35" />

      {/* Decoração */}
      <circle cx="42" cy="54" r="3" fill={C.blue} opacity="0.20" />
      <circle cx="158" cy="72" r="2" fill={C.blue} opacity="0.20" />
      <circle cx="48" cy="118" r="2" fill={C.blue} opacity="0.15" />
      <circle cx="154" cy="110" r="3" fill={C.blue} opacity="0.15" />
    </svg>
  )
}

interface CertificadosColaboradorProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function CertificadosColaborador({ onNavigate, onLogout }: CertificadosColaboradorProps) {
  const { C } = useTheme()
  const [busca, setBusca] = useState('')

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      <Sidebar
        paginaAtiva="certificados"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        <Topbar
          navItems={[
            { label: 'Início',       ativo: false, onClick: () => onNavigate('dashboard')  },
            { label: 'Meus Cursos',  ativo: false, onClick: () => onNavigate('meusCursos') },
            { label: 'Certificados', ativo: true                                            },
            { label: 'Biblioteca',   ativo: false                                           },
            { label: 'Trilhas',      ativo: false, onClick: () => onNavigate('trilha')      },
          ]}
          userName="João Silva"
          userRole="Aluno"
          userInitials="JS"
          notificacoes={3}
        />

        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

          {/* Cabeçalho */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ width: '40px', height: '3px', background: C.blue, borderRadius: '2px', marginBottom: '10px' }} />
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
              Meus Certificados
            </h1>
            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
              Certificados obtidos ao concluir cursos na plataforma
            </p>
          </div>

          {!temCertificados ? (

            /* ── ESTADO VAZIO ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '0' }}>

              <IlustracaoVazia C={C as Record<string, string>} />

              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(26,86,255,0.08)', border: '2px solid rgba(26,86,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Award size={32} color={C.blue} />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 12px', maxWidth: '440px', lineHeight: 1.3 }}>
                Você ainda não tem certificados!
              </h2>

              <p style={{ fontSize: '14px', color: C.muted, margin: '0 0 32px', maxWidth: '480px', lineHeight: 1.7 }}>
                Conclua cursos disponíveis na aba{' '}
                <strong style={{ color: C.blue }}>"Meus Cursos"</strong>
                {' '}e poderá ver seus certificados aqui.
              </p>

              <button
                onClick={() => onNavigate('meusCursos')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: C.blue, color: '#fff', border: 'none', borderRadius: '10px',
                  padding: '13px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(26,86,255,0.30)', transition: 'opacity 150ms',
                  marginBottom: '40px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <BookOpen size={16} />
                Ver cursos disponíveis
                <ChevronRight size={16} />
              </button>

              {/* Cards de passos */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', width: '100%', maxWidth: '680px' }}>
                {[
                  { num: '01', titulo: 'Escolha um curso',    desc: 'Acesse "Meus Cursos" e escolha um treinamento da sua área',             icone: '📚' },
                  { num: '02', titulo: 'Conclua as aulas',    desc: 'Assista todas as videoaulas e complete as avaliações',                   icone: '🎯' },
                  { num: '03', titulo: 'Receba o certificado',desc: 'Seu certificado é emitido automaticamente ao concluir',                  icone: '🏅' },
                ].map(passo => (
                  <div
                    key={passo.num}
                    style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '20px 16px', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{passo.icone}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: C.blue, letterSpacing: '1px', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Passo {passo.num}
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>{passo.titulo}</p>
                    <p style={{ fontSize: '12px', color: C.muted, margin: 0, lineHeight: 1.5 }}>{passo.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          ) : (

            /* ── ESTADO COM CERTIFICADOS (uso futuro) ── */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', maxWidth: '400px' }}>
                <Search size={14} color={C.muted} />
                <input
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  placeholder="Buscar certificado..."
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', color: C.text, flex: 1 }}
                />
              </div>
              <p style={{ fontSize: '14px', color: C.muted }}>Nenhum certificado para exibir.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
