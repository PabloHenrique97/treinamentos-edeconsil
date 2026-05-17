import { useState, useEffect } from 'react'

interface Responsive {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
}

export function useResponsive(): Responsive {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile:  width <= 768,
    isTablet:  width > 768 && width <= 1024,
    isDesktop: width > 1024,
    width,
  }
}
