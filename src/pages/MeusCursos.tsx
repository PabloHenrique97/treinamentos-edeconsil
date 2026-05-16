import React, { useState } from 'react'
import {
  ChevronRight, Bell, MessageSquare, Search,
  FileText, Download, Edit3, Check, Play, Pause,
  SkipForward, Volume2, Settings, Maximize,
  Clock, Award
} from 'lucide-react'
import logoEdeconsil from '../assets/logo-edeconsil.png'

const C = {
  bg:      '#050d1a',
  surface: '#070f1e',
  surface2:'#0a1628',
  surface3:'#0d1e35',
  border:  'rgba(26,86,255,0.15)',
  blue:    '#1a56ff',
  green:   '#10b981',
  amber:   '#f59e0b',
  text:    '#ffffff',
  muted:   '#4a6080',
  muted2:  '#6b80a0',
}

const curso = {
  titulo: 'Leitura e Interpretação de Projetos de Terraplanagem',
  modulo: 'Módulo 02',
  categoria: 'Planejamento de Terraplanagem',
  duracao: '32 min',
  status: 'Em andamento',
  progresso: 65,
  totalAulas: 28,
  aulasConcluidas: 18,
  aulaAtual: {
    numero: '04',
    tempoAtual: '12:47',
    tempoTotal: '32:16',
    velocidade: '1.25x',
  }
}

const modulos = [
  {
    id: 1,
    titulo: 'Módulo 01 - Introdução à Construção Civil',
    aulas: 4, concluidas: 4, aberto: false,
    itens: [
      { num: 1, titulo: 'Fundamentos da Construção', dur: '28 min', concluida: true,  ativa: false },
      { num: 2, titulo: 'Materiais e Equipamentos',  dur: '24 min', concluida: true,  ativa: false },
      { num: 3, titulo: 'Normas Técnicas',            dur: '30 min', concluida: true,  ativa: false },
      { num: 4, titulo: 'Segurança Básica',           dur: '22 min', concluida: true,  ativa: false },
    ]
  },
  {
    id: 2,
    titulo: 'Módulo 02 - Planejamento de Terraplanagem',
    aulas: 6, concluidas: 3, aberto: true,
    itens: [
      { num: 1, titulo: 'Fundamentos de Terraplanagem',        dur: '28 min', concluida: true,  ativa: false },
      { num: 2, titulo: 'Equipamentos e Aplicações',           dur: '24 min', concluida: true,  ativa: false },
      { num: 3, titulo: 'Leitura e Interpretação de Projetos', dur: '32 min', concluida: false, ativa: true  },
      { num: 4, titulo: 'Cálculo de Volumes',                  dur: '26 min', concluida: false, ativa: false },
      { num: 5, titulo: 'Compactação de Solos',                dur: '22 min', concluida: false, ativa: false },
      { num: 6, titulo: 'Exercícios Práticos',                 dur: '30 min', concluida: false, ativa: false },
    ]
  },
  {
    id: 3,
    titulo: 'Módulo 03 - Pavimentação',
    aulas: 5, concluidas: 0, aberto: false,
    itens: []
  },
  {
    id: 4,
    titulo: 'Módulo 04 - Gestão de Obras',
    aulas: 4, concluidas: 0, aberto: false,
    itens: []
  },
]

const abasSobre = ['Sobre a Aula', 'Materiais', 'Anotações', 'Perguntas (12)']

const materiaisAula = [
  { nome: 'Apostila - Terraplanagem.pdf', tamanho: '2.4 MB' },
  { nome: 'Exemplo de Projeto.dwg',       tamanho: '6.8 MB' },
  { nome: 'Tabela de Volumes.xlsx',       tamanho: '1.1 MB' },
  { nome: 'Lista de Verificação.pdf',     tamanho: '890 KB' },
]

const aprendizados = [
  'Como ler plantas topográficas',
  'Interpretar perfis e seções',
  'Calcular volumes de corte e aterro',
  'Identificar pontos críticos no projeto',
]

const navSidebar = [
  { label: 'Dashboard',              ativo: false },
  { label: 'Meus Cursos',            ativo: true  },
  { label: 'Certificados',           ativo: false },
  { label: 'Biblioteca',             ativo: false },
  { label: 'Trilhas de Aprendizado', ativo: false },
  { label: 'Favoritos',              ativo: false },
  { label: 'Histórico',              ativo: false },
]

const categorias = [
  'Obras e Infraestrutura',
  'Terraplanagem',
  'Pavimentação',
  'Equipamentos',
  'Segurança do Trabalho',
  'Gestão e Suprimentos',
]

export function MeusCursos({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [modulosAbertos, setModulosAbertos] = useState<number[]>([2])
  const [abaAtiva, setAbaAtiva] = useState('Sobre a Aula')
  const [tocando, setTocando] = useState(false)

  const toggleModulo = (id: number) => {
    setModulosAbertos(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: C.bg, color: C.text, display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* SIDEBAR ESQUERDA */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Logo */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoEdeconsil} alt="Edeconsil" style={{ height: '32px', objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: '8px', fontWeight: 700, color: C.text, letterSpacing: '1.5px' }}>EDECONSIL</div>
            <div style={{ fontSize: '8px', color: C.blue, letterSpacing: '1px' }}>UNIVERSIDADE</div>
          </div>
        </div>

        {/* Nav principal */}
        <div style={{ padding: '12px 8px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: C.muted, letterSpacing: '1px', padding: '4px 12px 8px', textTransform: 'uppercase' }}>Menu</div>
          {navSidebar.map(item => (
            <div key={item.label}
              onClick={() => {
                if (item.label === 'Dashboard') onNavigate('dashboard')
                if (item.label === 'Trilhas de Aprendizado') onNavigate('trilha')
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                background: item.ativo ? 'rgba(26,86,255,0.15)' : 'transparent',
                borderLeft: item.ativo ? `3px solid ${C.blue}` : '3px solid transparent',
                marginBottom: '1px',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => { if (!item.ativo) e.currentTarget.style.background = 'rgba(26,86,255,0.06)' }}
              onMouseLeave={e => { if (!item.ativo) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '13px', fontWeight: item.ativo ? 700 : 400, color: item.ativo ? C.blue : C.muted2 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Categorias */}
        <div style={{ padding: '0 8px', marginTop: '8px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: C.muted, letterSpacing: '1px', padding: '4px 12px 8px', textTransform: 'uppercase' }}>Categorias</div>
          {categorias.map(cat => (
            <div key={cat} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,86,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.muted, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: C.muted2 }}>{cat}</span>
            </div>
          ))}
        </div>

        {/* Suporte */}
        <div style={{ marginTop: 'auto', padding: '12px' }}>
          <div style={{
            background: 'rgba(26,86,255,0.08)',
            border: `1px solid ${C.border}`,
            borderRadius: '10px', padding: '12px',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(26,86,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={13} color={C.blue} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: C.blue }}>Precisa de ajuda?</div>
              <div style={{ fontSize: '10px', color: C.muted }}>Fale com nosso suporte</div>
            </div>
            <ChevronRight size={12} color={C.muted} style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </aside>

      {/* ÁREA CENTRAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <div style={{
          height: '56px', flexShrink: 0,
          background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: '24px',
        }}>
          {['Meus Cursos','Certificados','Biblioteca','Trilhas'].map(item => (
            <span key={item} style={{
              fontSize: '13px',
              fontWeight: item === 'Meus Cursos' ? 600 : 400,
              color: item === 'Meus Cursos' ? C.text : C.muted,
              cursor: 'pointer', padding: '4px 0',
              borderBottom: item === 'Meus Cursos' ? `2px solid ${C.blue}` : '2px solid transparent',
            }}>
              {item}
            </span>
          ))}

          {/* Busca */}
          <div style={{
            marginLeft: 'auto',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: '8px', padding: '7px 14px', width: '240px',
          }}>
            <Search size={13} color={C.muted} />
            <span style={{ fontSize: '12px', color: C.muted, flex: 1 }}>Buscar aulas, cursos...</span>
            <span style={{ fontSize: '10px', color: C.muted, background: C.surface, padding: '1px 5px', borderRadius: '4px' }}>⌘ K</span>
          </div>

          {/* Ícones + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
              <Bell size={17} color={C.muted} />
              <div style={{ position: 'absolute', top: '3px', right: '3px', width: '14px', height: '14px', background: C.blue, borderRadius: '50%', fontSize: '8px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
            </div>
            <div style={{ cursor: 'pointer', padding: '6px' }}>
              <MessageSquare size={17} color={C.muted} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>JS</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: C.text }}>João Silva</div>
                <div style={{ fontSize: '9px', color: C.green }}>● Aluno</div>
              </div>
              <ChevronRight size={12} color={C.muted} />
            </div>
          </div>
        </div>

        {/* CONTEÚDO COM SCROLL */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Breadcrumb */}
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {['Meus Cursos','Gestão de Obras e Construção Civil','Módulo 02','Aula 04'].map((b, i, arr) => (
              <React.Fragment key={b}>
                <span style={{ fontSize: '12px', color: i === arr.length - 1 ? C.text : C.muted, cursor: i < arr.length - 1 ? 'pointer' : 'default', fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                  {b}
                </span>
                {i < arr.length - 1 && <span style={{ fontSize: '12px', color: C.muted }}>›</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Título + botão concluída */}
          <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexShrink: 0 }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
                {curso.titulo}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.blue, background: 'rgba(26,86,255,0.15)', border: `1px solid rgba(26,86,255,0.3)`, borderRadius: '6px', padding: '3px 10px' }}>
                  {curso.modulo}
                </span>
                <span style={{ fontSize: '12px', color: C.muted }}>{curso.categoria}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: C.muted }}>
                  <Clock size={12} /> {curso.duracao}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: C.green, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '6px', padding: '3px 10px' }}>
                  {curso.status}
                </span>
              </div>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'transparent',
              border: `1.5px solid ${C.blue}`,
              borderRadius: '8px', padding: '9px 16px',
              fontSize: '13px', fontWeight: 600, color: C.blue,
              cursor: 'pointer', flexShrink: 0,
              transition: 'all 150ms',
              fontFamily: "'Inter',sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.blue }}
            >
              <Check size={14} /> Marcar como concluída
            </button>
          </div>

          {/* VIDEO PLAYER */}
          <div style={{ padding: '0 20px', flexShrink: 0 }}>
            <div style={{
              background: C.surface3,
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${C.border}`,
              aspectRatio: '16/7',
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Thumbnail */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #0d1e35 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-start', justifyContent: 'center',
                padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <img src={logoEdeconsil} alt="" style={{ height: '28px', objectFit: 'contain' }} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: C.text, margin: '0 0 4px', maxWidth: '340px', lineHeight: 1.3 }}>
                  Leitura e Interpretação de Projetos de{' '}
                  <span style={{ color: C.blue }}>Terraplanagem</span>
                </h2>
                <p style={{ fontSize: '13px', color: C.muted2, margin: '8px 0 0', maxWidth: '300px' }}>
                  Entenda plantas, cortes, perfis e volumes com eficiência.
                </p>
              </div>

              {/* Botão play central */}
              <button
                onClick={() => setTocando(!tocando)}
                style={{
                  position: 'relative', zIndex: 2,
                  width: '56px', height: '56px',
                  borderRadius: '50%',
                  background: tocando ? 'rgba(26,86,255,0.8)' : C.blue,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 0 12px rgba(26,86,255,0.15)`,
                  transition: 'all 200ms',
                }}
              >
                {tocando
                  ? <Pause size={22} color="#fff" />
                  : <Play size={22} color="#fff" style={{ marginLeft: '2px' }} />
                }
              </button>

              {/* Barra de progresso do vídeo */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '12px 16px',
                background: 'linear-gradient(to top, rgba(5,13,26,0.95), transparent)',
              }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '4px', height: '4px', marginBottom: '10px', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ background: C.blue, height: '4px', borderRadius: '4px', width: '39%' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '39%', transform: 'translate(-50%,-50%)', width: '12px', height: '12px', background: '#fff', borderRadius: '50%', boxShadow: '0 0 4px rgba(0,0,0,0.5)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setTocando(!tocando)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                    {tocando ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                    <SkipForward size={18} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                    <Volume2 size={18} />
                  </button>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginLeft: '4px' }}>
                    {curso.aulaAtual.tempoAtual} / {curso.aulaAtual.tempoTotal}
                  </span>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.12)', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}>
                      {curso.aulaAtual.velocidade}
                    </span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                      <Settings size={16} />
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABAS + CONTEÚDO */}
          <div style={{ padding: '16px 20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${C.border}`, marginBottom: '16px' }}>
              {abasSobre.map(aba => (
                <button key={aba}
                  onClick={() => setAbaAtiva(aba)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '10px 16px',
                    fontSize: '13px', fontWeight: abaAtiva === aba ? 600 : 400,
                    color: abaAtiva === aba ? C.text : C.muted,
                    borderBottom: abaAtiva === aba ? `2px solid ${C.blue}` : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'all 150ms',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  {aba === 'Sobre a Aula'  && <FileText size={13} />}
                  {aba === 'Materiais'      && <Download size={13} />}
                  {aba === 'Anotações'      && <Edit3 size={13} />}
                  {aba === 'Perguntas (12)' && <MessageSquare size={13} />}
                  {aba}
                </button>
              ))}
            </div>

            {abaAtiva === 'Sobre a Aula' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: C.muted2, lineHeight: 1.7, margin: '0 0 16px' }}>
                    Nesta aula você vai aprender a interpretar projetos de terraplanagem, identificando informações essenciais como curvas de nível, cortes, aterros, volumes e movimentações de terra.
                  </p>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '10px' }}>O que você vai aprender:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {aprendizados.map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={14} color={C.green} />
                        <span style={{ fontSize: '13px', color: C.muted2 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Materiais da Aula</span>
                    <Download size={15} color={C.muted} style={{ cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {materiaisAula.map(m => (
                      <div key={m.nome}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: C.surface3, borderRadius: '8px', cursor: 'pointer', transition: 'background 150ms' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,86,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = C.surface3)}
                      >
                        <FileText size={14} color={C.blue} />
                        <span style={{ flex: 1, fontSize: '12px', color: C.text }}>{m.nome}</span>
                        <span style={{ fontSize: '11px', color: C.muted }}>{m.tamanho}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {abaAtiva !== 'Sobre a Aula' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: C.muted, fontSize: '13px' }}>
                Conteúdo de {abaAtiva} em breve
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAINEL DIREITO */}
      <aside style={{
        width: '300px', flexShrink: 0,
        background: C.surface,
        borderLeft: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>

        {/* Progresso do curso */}
        <div style={{ padding: '16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Progresso do Curso</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: C.blue }}>{curso.progresso}%</span>
          </div>
          <div style={{ background: 'rgba(26,86,255,0.10)', borderRadius: '4px', height: '6px', marginBottom: '6px' }}>
            <div style={{ background: C.blue, height: '6px', borderRadius: '4px', width: `${curso.progresso}%` }} />
          </div>
          <div style={{ fontSize: '11px', color: C.muted }}>{curso.aulasConcluidas} de {curso.totalAulas} aulas concluídas</div>
        </div>

        {/* Tabs Conteúdo / Aula Anterior */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {['Conteúdo','Aula Anterior'].map(tab => (
            <button key={tab} style={{
              flex: 1, background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 8px',
              fontSize: '12px', fontWeight: tab === 'Conteúdo' ? 600 : 400,
              color: tab === 'Conteúdo' ? C.blue : C.muted,
              borderBottom: tab === 'Conteúdo' ? `2px solid ${C.blue}` : '2px solid transparent',
              marginBottom: '-1px',
              fontFamily: "'Inter',sans-serif",
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Lista de módulos */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {modulos.map(mod => (
            <div key={mod.id} style={{ borderBottom: `1px solid ${C.border}` }}>
              <div
                onClick={() => toggleModulo(mod.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,86,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: C.text, lineHeight: 1.4 }}>{mod.titulo}</div>
                  <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{mod.concluidas}/{mod.aulas}</div>
                </div>
                <ChevronRight size={14} color={C.muted} style={{ transform: modulosAbertos.includes(mod.id) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', flexShrink: 0 }} />
              </div>

              {modulosAbertos.includes(mod.id) && mod.itens.map(item => (
                <div key={item.num} style={{
                  padding: '10px 16px 10px 28px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: item.ativa ? 'rgba(26,86,255,0.10)' : 'transparent',
                  borderLeft: item.ativa ? `3px solid ${C.blue}` : '3px solid transparent',
                  cursor: 'pointer', transition: 'background 150ms',
                }}
                onMouseEnter={e => { if (!item.ativa) e.currentTarget.style.background = 'rgba(26,86,255,0.05)' }}
                onMouseLeave={e => { if (!item.ativa) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: item.concluida ? C.green : item.ativa ? C.blue : 'rgba(255,255,255,0.08)',
                    border: item.concluida ? 'none' : item.ativa ? 'none' : `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.concluida
                      ? <Check size={11} color="#fff" />
                      : item.ativa
                      ? <Play size={10} color="#fff" style={{ marginLeft: '1px' }} />
                      : <span style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>{String(item.num).padStart(2,'0')}</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: item.ativa ? 600 : 400, color: item.ativa ? C.text : C.muted2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.titulo}
                    </div>
                    <div style={{ fontSize: '10px', color: C.muted }}>{item.dur}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Motivacional */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, background: 'rgba(26,86,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={16} color={C.amber} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.amber }}>Continue assim!</div>
              <div style={{ fontSize: '11px', color: C.muted, lineHeight: 1.5, marginTop: '2px' }}>
                Você está se dedicando e evoluindo muito. Foco no objetivo!
              </div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  )
}
