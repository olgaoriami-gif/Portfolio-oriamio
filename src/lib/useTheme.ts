import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem('theme') as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    const savedY = sessionStorage.getItem('themeScrollY')
    if (savedY) {
      window.scrollTo(0, Number(savedY))
      sessionStorage.removeItem('themeScrollY')
    }
  }, [theme])

  const toggle = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('themeScrollY', String(window.scrollY))
    }
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle }
}
