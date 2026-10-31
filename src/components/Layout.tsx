import { Link, NavLink, Outlet } from 'react-router'
import ThemeToggle from './ThemeToggle.tsx'
import type { Theme } from '../types/pokemon.ts'

interface LayoutProps {
  theme: Theme
  onToggleTheme: () => void
  favoriteCount: number
}

// The frame around every page: header, navigation menu and footer.
// <Outlet /> is the place where the router draws the current page.
function Layout({ theme, onToggleTheme, favoriteCount }: LayoutProps) {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <Link to="/items" className="app__brand">
            <span className="app__logo" aria-hidden="true"></span>
            <div>
              <p className="app__title">Pokédex</p>
              <p className="app__subtitle">Generation I · 151 Pokémon from PokéAPI</p>
            </div>
          </Link>
          <nav className="app__nav" aria-label="Main">
            <NavLink to="/items" className="app__nav-link">
              Pokémon
            </NavLink>
            <NavLink to="/favorites" className="app__nav-link">
              ♥ Favorites ({favoriteCount})
            </NavLink>
            <NavLink to="/compare" className="app__nav-link">
              Compare
            </NavLink>
          </nav>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="app__main">
        <Outlet />
      </main>

      <footer className="app__footer">
        Data and images from <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>.
        Built with React + Vite.
      </footer>
    </div>
  )
}

export default Layout
