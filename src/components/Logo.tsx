import logoEscura from '../assets/edeconsil.png'
import logoClara  from '../assets/logo-edeconsil.png'
import { useTheme } from '../contexts/ThemeContext'

interface LogoProps {
  height?:     number
  width?:      number
  forceClara?: boolean
}

export function Logo({ height = 32, forceClara }: LogoProps) {
  const { isDark } = useTheme()

  return (
    <img
      src={forceClara || isDark ? logoClara : logoEscura}
      alt="Edeconsil"
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        transition: 'opacity 200ms ease',
      }}
    />
  )
}
