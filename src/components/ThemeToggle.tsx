import type { Theme } from '../types/pokemon.ts'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

// The sun / moon button in the header.
function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={onToggle}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
