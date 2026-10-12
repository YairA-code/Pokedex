import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pokedex-theme'

// The first theme: the one saved before, or the system setting (dark mode on the computer/phone).
function getStartTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage blocked: fall through to the system setting.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// A custom hook for light / dark mode.
// It puts data-theme="dark" on <html>, and the CSS switches the colors.
export function useTheme() {
  const [theme, setTheme] = useState(getStartTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // The app still works without saving.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
