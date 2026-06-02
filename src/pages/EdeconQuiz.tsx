import { useTheme } from '../contexts/ThemeContext'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'

interface EdeconQuizProps {
  onNavigate: (page: string) => void
  onLogout:   () => void
}

export function EdeconQuiz({ onNavigate, onLogout }: EdeconQuizProps) {
  const { C } = useTheme()

  return (
    <div style={{
      fontFamily: "'Inter',sans-serif",
      background: C.bg, color: C.text,
      display: 'flex', height: '100vh', overflow: 'hidden',
    }}>
      <Sidebar
        paginaAtiva="edeconQuiz"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main style={{
        flex: 1, display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
      }}>
        <Topbar titulo="EdeconQuiz" subtitulo="Treinamentos gamificados" onNavigate={onNavigate} />

        <div style={{
          flex: 1, overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 20px',
        }}>

          {/* Card principal */}
          <div style={{
            maxWidth: '600px', width: '100%',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '20px',
            padding: '48px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}>

            {/* Ícone */}
            <div style={{
              width: '100px', height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d2550, #1a56ff)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '48px',
              boxShadow: '0 8px 24px rgba(26,86,255,0.30)',
            }}>
              🧠
            </div>

            {/* Badge "Em breve" */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              gap: '6px', padding: '4px 14px',
              background: 'rgba(245,196,0,0.15)',
              border: '1px solid rgba(245,196,0,0.40)',
              borderRadius: '20px', marginBottom: '16px',
            }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '50%', background: '#F5C400',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{
                fontSize: '12px', fontWeight: 700,
                color: '#F5C400', letterSpacing: '0.5px',
              }}>
                EM BREVE
              </span>
            </div>

            {/* Título */}
            <h1 style={{
              fontSize: '28px', fontWeight: 800,
              color: C.text, margin: '0 0 12px',
              letterSpacing: '-0.5px',
            }}>
              EdeconQuiz
            </h1>

            {/* Subtítulo */}
            <p style={{
              fontSize: '16px', color: C.muted,
              margin: '0 0 32px', lineHeight: 1.6,
              maxWidth: '420px', marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Módulo de quizzes interativos em desenvolvimento.
              Em breve você poderá testar seus conhecimentos
              e competir com seus colegas!
            </p>

            {/* Features previstas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px', marginBottom: '32px',
              textAlign: 'left',
            }}>
              {[
                { icone: '🏆', titulo: 'Ranking',    desc: 'Compete com colegas da sua turma'          },
                { icone: '📝', titulo: 'Quizzes',    desc: 'Perguntas dos cursos e treinamentos'       },
                { icone: '🎯', titulo: 'Pontuação',  desc: 'Acumule pontos e suba no ranking'          },
                { icone: '🏅', titulo: 'Medalhas',   desc: 'Conquiste medalhas por desempenho'         },
              ].map(f => (
                <div key={f.titulo} style={{
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex', gap: '10px',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{f.icone}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>
                      {f.titulo}
                    </p>
                    <p style={{ fontSize: '11px', color: C.muted, margin: 0, lineHeight: 1.4 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Barra de progresso de desenvolvimento */}
            <div style={{
              background: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '28px',
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>
                  Progresso do desenvolvimento
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a56ff' }}>65%</span>
              </div>
              <div style={{ background: C.border, borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #0d2550, #1a56ff)',
                  height: '8px', borderRadius: '6px', width: '65%',
                  transition: 'width 1s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                {['Estrutura', 'Perguntas', 'Ranking', 'Notificações'].map((etapa, i) => (
                  <span key={etapa} style={{
                    fontSize: '10px',
                    color: i < 2 ? '#10b981' : C.muted,
                    fontWeight: i < 2 ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    {i < 2 ? '✓' : '○'} {etapa}
                  </span>
                ))}
              </div>
            </div>

            {/* Botão voltar */}
            <button
              onClick={() => onNavigate('dashboard')}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #0d2550, #1a56ff)',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 700,
                color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(26,86,255,0.30)',
                transition: 'transform 150ms, box-shadow 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,86,255,0.40)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(26,86,255,0.30)'
              }}
            >
              ← Voltar ao Início
            </button>
          </div>

          {/* Nota rodapé */}
          <p style={{
            fontSize: '12px', color: C.muted,
            margin: '20px 0 0', textAlign: 'center',
          }}>
            🔔 Você será notificado quando o EdeconQuiz estiver disponível
          </p>
        </div>
      </main>
    </div>
  )
}
