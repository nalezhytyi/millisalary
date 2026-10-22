import { useCallback, useEffect } from 'react'
import { trackAmplitudeEvent } from '../amplitude'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'system' | 'light' | 'dark'

const DARK_QUERY = '(prefers-color-scheme: dark)'
// Mirrors systemGroupedBackground; keep in sync with --background in index.css
const THEME_COLORS = { light: '#f2f2f7', dark: '#000000' } as const

const applyTheme = (theme: Theme) => {
  const isDark =
    theme === 'dark' || (theme === 'system' && matchMedia(DARK_QUERY).matches)
  const root = document.documentElement

  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[isDark ? 'dark' : 'light'])
}

export const useTheme = () => {
  const [theme, setThemeValue] = useLocalStorage<Theme>('theme', 'system')

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') {
      return
    }

    const query = matchMedia(DARK_QUERY)
    const handleChange = () => applyTheme('system')

    query.addEventListener('change', handleChange)

    return () => query.removeEventListener('change', handleChange)
  }, [theme])

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeValue(nextTheme)
      trackAmplitudeEvent('theme_changed', { theme: nextTheme })
    },
    [setThemeValue]
  )

  return { theme, setTheme }
}
