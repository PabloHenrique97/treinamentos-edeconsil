import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme, C } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isDark ? 'rgba(26,86,255,0.10)' : 'rgba(26,86,255,0.08)',
        border: `1px solid ${isDark ? 'rgba(26,86,255,0.25)' : 'rgba(26,86,255,0.20)'}`,
        borderRadius: '20px',
        padding: '5px 10px 5px 6px',
        cursor: 'pointer',
        transition: 'all 200ms',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(26,86,255,0.18)'
        e.currentTarget.style.borderColor = 'rgba(26,86,255,0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark
          ? 'rgba(26,86,255,0.10)'
          : 'rgba(26,86,255,0.08)'
        e.currentTarget.style.borderColor = isDark
          ? 'rgba(26,86,255,0.25)'
          : 'rgba(26,86,255,0.20)'
      }}
    >
      {/* Trilho */}
      <div style={{
        width: '32px',
        height: '18px',
        borderRadius: '9px',
        background: isDark ? 'rgba(26,86,255,0.30)' : 'rgba(26,86,255,0.20)',
        position: 'relative',
        transition: 'background 200ms',
        flexShrink: 0,
      }}>
        {/* Bolinha */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: isDark ? '2px' : '14px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: C.blue,
          transition: 'left 200ms',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isDark
            ? <Moon size={8} color="#fff" />
            : <Sun size={8} color="#fff" />
          }
        </div>
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: 600,
        color: C.blue,
        whiteSpace: 'nowrap',
      }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
