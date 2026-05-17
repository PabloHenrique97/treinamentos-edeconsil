import { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  C: typeof darkColors
}

const darkColors = {
  bg:       '#050d1a',
  surface:  '#070f1e',
  surface2: '#0a1628',
  surface3: '#0d1e35',
  border:   'rgba(26,86,255,0.15)',
  blue:     '#1a56ff',
  green:    '#10b981',
  amber:    '#f59e0b',
  purple:   '#8b5cf6',
  text:     '#ffffff',
  muted:    '#4a6080',
  muted2:   '#6b80a0',
  cardBg:   '#070f1e',
  inputBg:  '#0a1628',
}

const lightColors = {
  bg:       '#f0f4f8',
  surface:  '#ffffff',
  surface2: '#f8fafc',
  surface3: '#f1f5f9',
  border:   'rgba(26,86,255,0.15)',
  blue:     '#1a56ff',
  green:    '#059669',
  amber:    '#d97706',
  purple:   '#7c3aed',
  text:     '#0d1e35',
  muted:    '#64748b',
  muted2:   '#475569',
  cardBg:   '#ffffff',
  inputBg:  '#f1f5f9',
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  C: darkColors,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => setIsDark(prev => !prev)

  const C = isDark ? darkColors : lightColors

  useEffect(() => {
    document.body.style.background = C.bg
    document.body.style.color = C.text
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, C }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
