import { useState } from 'react'

// ─── Tipos ───────────────────────────────────────────────
type Aba = 'cursos' | 'apostilas' | 'edeconquiz'

interface Curso {
  id: number
  titulo: string
  materias: number
  aulas: number
  parcelas: number
  valorParcela: number
  valorVista: number
  desconto: number
  badge?: string
  imageUrl: string
}

interface Feedback {
  id: number
  nome: string
  cargo: string
  depoimento: string
}

// ─── Dados mock ──────────────────────────────────────────
const cursos: Curso[] = [
  {
    id: 1,
    titulo: 'NR-35 — Trabalho em Altura',
    materias: 8,
    aulas: 24,
    parcelas: 10,
    valorParcela: 42.90,
    valorVista: 389.00,
    desconto: 30,
    badge: 'MAIS PROCURADO',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
  },
  {
    id: 2,
    titulo: 'SIPAT — Segurança no Trabalho',
    materias: 6,
    aulas: 18,
    parcelas: 10,
    valorParcela: 35.50,
    valorVista: 320.00,
    desconto: 25,
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
  },
  {
    id: 3,
    titulo: 'Gestão da Qualidade — ISO 9001',
    materias: 12,
    aulas: 40,
    parcelas: 12,
    valorParcela: 58.25,
    valorVista: 590.00,
    desconto: 40,
    badge: 'INSCRIÇÕES ABERTAS',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
  },
  {
    id: 4,
    titulo: 'Liderança em Obras e Canteiros',
    materias: 10,
    aulas: 32,
    parcelas: 10,
    valorParcela: 49.90,
    valorVista: 449.00,
    desconto: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600',
  },
]

const apostilas: Curso[] = [
  {
    id: 5,
    titulo: 'Manual de Segurança — Edeconsil',
    materias: 5,
    aulas: 0,
    parcelas: 3,
    valorParcela: 29.90,
    valorVista: 79.90,
    desconto: 20,
    imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=600',
  },
  {
    id: 6,
    titulo: 'Guia de Gestão Ambiental em Obras',
    materias: 4,
    aulas: 0,
    parcelas: 3,
    valorParcela: 24.90,
    valorVista: 69.90,
    desconto: 15,
    badge: 'NOVO',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600',
  },
  {
    id: 7,
    titulo: 'Normas Técnicas ABNT para Construção',
    materias: 7,
    aulas: 0,
    parcelas: 4,
    valorParcela: 34.75,
    valorVista: 129.00,
    desconto: 30,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  },
  {
    id: 8,
    titulo: 'Checklist de Qualidade — Obra a Obra',
    materias: 3,
    aulas: 0,
    parcelas: 2,
    valorParcela: 19.90,
    valorVista: 39.90,
    desconto: 10,
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
  },
]

const feedbacks: Feedback[] = [
  {
    id: 1,
    nome: 'Carlos Eduardo Mendes',
    cargo: 'Técnico de Segurança — Obra Setor 3',
    depoimento: 'O curso de NR-35 foi fundamental para melhorar minha atuação em campo. Conteúdo claro, objetivo e aplicável no dia a dia da obra.',
  },
  {
    id: 2,
    nome: 'Ana Paula Rodrigues',
    cargo: 'Engenheira de Qualidade',
    depoimento: 'A formação em ISO 9001 pela plataforma da Edeconsil me deu a base necessária para liderar a implementação do sistema de gestão na empresa.',
  },
  {
    id: 3,
    nome: 'Marcos Vinícius Lima',
    cargo: 'Encarregado de Obras',
    depoimento: 'O treinamento de liderança mudou minha relação com a equipe. Hoje consigo gerir conflitos e motivar os colaboradores de forma muito mais eficiente.',
  },
  {
    id: 4,
    nome: 'Juliana Ferreira Costa',
    cargo: 'Assistente de RH',
    depoimento: 'As apostilas são muito bem organizadas e diretas. Uso como referência constante no meu trabalho de integração de novos colaboradores.',
  },
]

// ─── Ícones ───────────────────────────────────────────────
const IconBook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const IconMonitor = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
  </svg>
)
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5C400" stroke="#F5C400" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

// ─── Card de curso ────────────────────────────────────────
function CursoCard({ item, tipo }: { item: Curso; tipo: 'curso' | 'apostila' }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e8eaed',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 200ms, box-shadow 200ms',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,37,80,0.12)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Imagem */}
      <div style={{ position: 'relative' }}>
        <img
          src={item.imageUrl}
          alt={item.titulo}
          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
        />
        {item.badge && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            background: '#0d2550', color: '#F5C400',
            fontSize: '10px', fontWeight: 700,
            padding: '4px 10px', borderRadius: '4px',
            letterSpacing: '0.5px',
          }}>
            {item.badge}
          </div>
        )}
        {item.desconto > 0 && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            background: '#16a34a', color: '#ffffff',
            fontSize: '11px', fontWeight: 700,
            padding: '4px 8px', borderRadius: '4px',
          }}>
            {item.desconto}% OFF
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d2550', margin: 0, lineHeight: 1.4 }}>
          {item.titulo}
        </p>

        {/* Matérias e aulas */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconBook /> {item.materias} Matérias
          </span>
          {tipo === 'curso' && (
            <span style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <IconMonitor /> {item.aulas} Aulas
            </span>
          )}
        </div>

        {/* Preço */}
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 2px', textDecoration: 'line-through' }}>
            De R$ {(item.valorVista / (1 - item.desconto / 100)).toFixed(2).replace('.', ',')}
          </p>
          <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 2px' }}>
            {item.parcelas}x de{' '}
            <strong style={{ fontSize: '18px', color: '#0d2550' }}>
              R$ {item.valorParcela.toFixed(2).replace('.', ',')}
            </strong>
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            ou R$ {item.valorVista.toFixed(2).replace('.', ',')} à vista
          </p>
        </div>

        {/* Botão */}
        <button
          style={{
            width: '100%',
            padding: '11px',
            background: '#0d2550',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.5px',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F5C400'}
          onMouseLeave={e => e.currentTarget.style.background = '#0d2550'}
          onClick={e => {
            const btn = e.currentTarget
            const prev = btn.style.color
            btn.style.color = '#0d2550'
            setTimeout(() => btn.style.color = prev, 200)
          }}
        >
          {tipo === 'apostila' ? 'ADQUIRIR' : 'INSCREVER-SE'}
        </button>
      </div>
    </div>
  )
}

// ─── Card de feedback ─────────────────────────────────────
function FeedbackCard({ item }: { item: Feedback }) {
  const [expandido, setExpandido] = useState(false)
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e8eaed',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'box-shadow 200ms',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,37,80,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Estrelas */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(s => <IconStar key={s} />)}
      </div>

      {/* Nome e cargo */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d2550', margin: '0 0 2px' }}>
          {item.nome}
        </p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
          {item.cargo}
        </p>
      </div>

      {/* Depoimento */}
      <p style={{
        fontSize: '13px',
        color: '#4b5563',
        margin: 0,
        lineHeight: 1.6,
        display: expandido ? 'block' : '-webkit-box',
        WebkitLineClamp: expandido ? undefined : 3,
        WebkitBoxOrient: 'vertical' as const,
        overflow: expandido ? 'visible' : 'hidden',
      }}>
        {item.depoimento}
      </p>

      {/* Ver na íntegra */}
      <button
        onClick={() => setExpandido(!expandido)}
        style={{
          background: '#0d2550',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'background 150ms',
          alignSelf: 'flex-start',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F5C400'}
        onMouseLeave={e => e.currentTarget.style.background = '#0d2550'}
      >
        {expandido ? 'VER MENOS' : 'VER NA ÍNTEGRA'} ›
      </button>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────
export function Treinamentos() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('cursos')

  const itensExibidos = abaAtiva === 'cursos'
    ? cursos
    : abaAtiva === 'apostilas'
    ? apostilas
    : []

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8f9fa', minHeight: '100vh' }}>

      {/* ── NAVBAR INTERNA DA PÁGINA ── */}
      <div style={{
        background: '#0d2550',
        padding: '0 32px',
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
      }}>
        {([
          { key: 'cursos',     label: 'Cursos'       },
          { key: 'apostilas',  label: 'Apostilas'    },
          { key: 'edeconquiz', label: 'EdeconQuiz ✦' },
        ] as { key: Aba; label: string }[]).map(aba => (
          <button
            key={aba.key}
            onClick={() => setAbaAtiva(aba.key)}
            style={{
              background: abaAtiva === aba.key ? '#F5C400' : 'transparent',
              color: abaAtiva === aba.key ? '#0d2550' : '#a0b4cc',
              border: 'none',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: abaAtiva === aba.key ? 700 : 400,
              cursor: 'pointer',
              borderRadius: abaAtiva === aba.key ? '6px 6px 0 0' : '0',
              transition: 'all 150ms',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => {
              if (abaAtiva !== aba.key) e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              if (abaAtiva !== aba.key) e.currentTarget.style.color = '#a0b4cc'
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* ── SEÇÃO 1 — BOAS-VINDAS ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d2550 0%, #1a3a6e 60%, #0a1a3a 100%)',
        padding: '60px 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculos decorativos */}
        <div style={{
          position: 'absolute', top: '-40px', left: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(245,196,0,0.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(245,196,0,0.04)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-block',
          background: 'rgba(245,196,0,0.15)',
          border: '1px solid rgba(245,196,0,0.3)',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '12px',
          color: '#F5C400',
          fontWeight: 600,
          marginBottom: '20px',
          letterSpacing: '0.5px',
        }}>
          PLATAFORMA DE CAPACITAÇÃO EDECONSIL
        </div>

        <p style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px', lineHeight: 1.2 }}>
          Desenvolva seu{' '}
          <span style={{ color: '#F5C400' }}>potencial profissional</span>
        </p>
        <p style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', margin: '0 0 20px', lineHeight: 1.2 }}>
          com os treinamentos Edeconsil
        </p>
        <p style={{ fontSize: '15px', color: '#7a9ccc', margin: '0 auto 32px', maxWidth: '560px', lineHeight: 1.6 }}>
          Cursos, apostilas e quizzes desenvolvidos especialmente para
          os colaboradores da Edeconsil. Evolua na sua carreira sem sair da intranet.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAbaAtiva('cursos')}
            style={{
              background: '#F5C400', color: '#0d2550',
              border: 'none', borderRadius: '8px',
              padding: '13px 28px', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.5px',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            VER CURSOS
          </button>
          <button
            onClick={() => setAbaAtiva('edeconquiz')}
            style={{
              background: 'transparent', color: '#ffffff',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: '8px', padding: '13px 28px',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.5px',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#F5C400'
              e.currentTarget.style.color = '#F5C400'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
              e.currentTarget.style.color = '#ffffff'
            }}
          >
            FAZER UM QUIZ
          </button>
        </div>
      </div>

      {/* ── SEÇÃO 2 — CURSOS / APOSTILAS / QUIZ ── */}
      <div style={{ padding: '40px 32px' }}>

        {/* Cabeçalho da seção */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ width: '40px', height: '3px', background: '#F5C400', borderRadius: '2px', marginBottom: '10px' }} />
          <p style={{ fontSize: '20px', fontWeight: 600, color: '#0d2550', margin: '0 0 4px' }}>
            {abaAtiva === 'cursos' ? 'Cursos disponíveis'
              : abaAtiva === 'apostilas' ? 'Apostilas disponíveis'
              : 'EdeconQuiz'}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            {abaAtiva === 'cursos'
              ? 'Capacitações técnicas e comportamentais para o seu desenvolvimento'
              : abaAtiva === 'apostilas'
              ? 'Material de apoio e referência para consulta rápida no dia a dia'
              : 'Teste seus conhecimentos e ganhe pontos'}
          </p>
        </div>

        {/* EdeconQuiz placeholder */}
        {abaAtiva === 'edeconquiz' && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '300px', gap: '16px',
            background: '#ffffff', borderRadius: '12px',
            border: '2px dashed #e8eaed',
          }}>
            <span style={{ fontSize: '48px' }}>🧠</span>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#0d2550', margin: 0 }}>
              EdeconQuiz
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, textAlign: 'center', maxWidth: '360px' }}>
              Módulo de quizzes em desenvolvimento.
              Em breve você poderá testar seus conhecimentos e competir com colegas!
            </p>
          </div>
        )}

        {/* Grid de cursos/apostilas */}
        {abaAtiva !== 'edeconquiz' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {itensExibidos.map(item => (
              <CursoCard
                key={item.id}
                item={item}
                tipo={abaAtiva === 'cursos' ? 'curso' : 'apostila'}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── SEÇÃO 3 — FEEDBACK DOS COLABORADORES ── */}
      <div style={{ padding: '40px 32px', background: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ width: '40px', height: '3px', background: '#F5C400', borderRadius: '2px', marginBottom: '10px' }} />
          <p style={{ fontSize: '20px', fontWeight: 600, color: '#0d2550', margin: '0 0 4px' }}>
            O que nossos colaboradores dizem
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Depoimentos reais de quem já passou pelos treinamentos Edeconsil
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}>
          {feedbacks.map(f => <FeedbackCard key={f.id} item={f} />)}
        </div>
      </div>

    </div>
  )
}
