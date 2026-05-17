import {
  LayoutDashboard, BookOpen, Award, ClipboardCheck,
  FileText, BarChart2, GitBranch,
  MessageSquare, LogOut, ChevronRight
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Logo } from './Logo'

const navItems = [
  { label: 'Início',                page: 'dashboard',  icon: LayoutDashboard },
  { label: 'Meus Cursos',           page: 'meusCursos', icon: BookOpen         },
  { label: 'Certificados',          page: 'certificadosColaborador', icon: Award },
  { label: 'EdeconQuiz',            page: '',           icon: ClipboardCheck   },
  { label: 'Apostilas',             page: 'apostilas',  icon: FileText         },
  { label: 'Meu Progresso',         page: '',           icon: BarChart2        },
  { label: 'Trilhas de Aprendizado',page: 'trilha',     icon: GitBranch        },
]

const categorias = [
  'Obras e Infraestrutura',
  'Terraplanagem',
  'Pavimentação',
  'Equipamentos',
  'Segurança do Trabalho',
  'Gestão e Suprimentos',
]

interface SidebarProps {
  paginaAtiva: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function Sidebar({ paginaAtiva, onNavigate, onLogout }: SidebarProps) {
  const { C } = useTheme()
  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      height: '100vh',
    }}>

      {/* Logo */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}>
        <Logo height={32} />
        <div>
          <div style={{ fontSize: '8px', fontWeight: 700, color: C.text, letterSpacing: '1.5px' }}>EDECONSIL</div>
          <div style={{ fontSize: '8px', color: C.blue, letterSpacing: '1px' }}>UNIVERSIDADE</div>
        </div>
      </div>

      {/* Nav principal */}
      <div style={{ padding: '12px 8px', flexShrink: 0 }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, color: C.muted,
          letterSpacing: '1px', padding: '4px 12px 8px',
          textTransform: 'uppercase',
        }}>
          Menu
        </div>
        {navItems.map(item => {
          const ativo = paginaAtiva === item.page
          return (
            <div
              key={item.label}
              onClick={() => item.page && onNavigate(item.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                cursor: item.page ? 'pointer' : 'default',
                background: ativo ? 'rgba(26,86,255,0.15)' : 'transparent',
                borderLeft: ativo ? `3px solid ${C.blue}` : '3px solid transparent',
                marginBottom: '1px',
                transition: 'all 150ms',
              }}
              onMouseEnter={e => {
                if (!ativo && item.page) e.currentTarget.style.background = 'rgba(26,86,255,0.06)'
              }}
              onMouseLeave={e => {
                if (!ativo) e.currentTarget.style.background = 'transparent'
              }}
            >
              <item.icon
                size={15}
                color={ativo ? C.blue : C.muted}
              />
              <span style={{
                fontSize: '13px',
                fontWeight: ativo ? 700 : 400,
                color: ativo ? C.blue : C.muted2,
              }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Categorias */}
      <div style={{ padding: '0 8px', flexShrink: 0 }}>
        <div style={{
          fontSize: '9px', fontWeight: 700, color: C.muted,
          letterSpacing: '1px', padding: '4px 12px 8px',
          textTransform: 'uppercase',
        }}>
          Categorias
        </div>
        {categorias.map(cat => (
          <div
            key={cat}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,86,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: C.muted,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '12px', color: C.muted2 }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Espaço flex */}
      <div style={{ flex: 1 }} />

      {/* Widget progresso */}
      <div style={{
        margin: '0 8px 8px',
        background: 'rgba(26,86,255,0.08)',
        border: '0.5px solid rgba(26,86,255,0.20)',
        borderRadius: '12px',
        padding: '14px',
        flexShrink: 0,
      }}>
        {/* Selecionar curso */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '12px', cursor: 'pointer',
        }}>
          <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            border: '1.5px solid rgba(26,86,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChevronRight size={10} color={C.muted} style={{ transform: 'rotate(90deg)' }} />
          </div>
          <span style={{ fontSize: '11px', color: C.muted2 }}>Selecionar curso</span>
        </div>

        {/* Donut + número */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
            <svg viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)', width: '44px', height: '44px' }}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(26,86,255,0.12)" strokeWidth="5" />
              <circle cx="22" cy="22" r="18" fill="none" stroke={C.blue} strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 18 * 0.27} ${2 * Math.PI * 18 * 0.73}`}
                strokeLinecap="round" />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 700, color: C.blue,
            }}>
              27%
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: C.text, lineHeight: 1 }}>12</span>
              <span style={{ fontSize: '13px', color: C.muted }}>de 44</span>
            </div>
            <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>
              disciplinas concluídas
            </div>
          </div>
        </div>
      </div>

      {/* Suporte */}
      <div style={{ padding: '0 8px 8px', flexShrink: 0 }}>
        <div style={{
          background: 'rgba(26,86,255,0.08)',
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'rgba(26,86,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <MessageSquare size={13} color={C.blue} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: C.blue }}>Precisa de ajuda?</div>
            <div style={{ fontSize: '10px', color: C.muted }}>Fale com nosso suporte</div>
          </div>
        </div>
      </div>

      {/* Perfil + Logout */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: '10px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'rgba(26,86,255,0.2)',
          border: '1px solid rgba(26,86,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: C.blue,
          flexShrink: 0,
        }}>
          SE
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 500, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Suporte TI
          </div>
          <div style={{ fontSize: '10px', color: C.muted }}>Colaborador</div>
        </div>
        <div
          onClick={onLogout}
          style={{ cursor: 'pointer', padding: '4px', flexShrink: 0 }}
          title="Sair"
        >
          <LogOut size={15} color={C.muted} />
        </div>
      </div>
    </aside>
  )
}
