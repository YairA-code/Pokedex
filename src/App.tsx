import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout.tsx'
import ScrollToTop from './components/ScrollToTop.tsx'
import ListPage from './pages/ListPage.tsx'
import DetailsPage from './pages/DetailsPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { useFavorites } from './hooks/useFavorites.ts'
import { usePokemonList } from './hooks/usePokemonList.ts'
import { useTheme } from './hooks/useTheme.ts'
import type { ListFilters } from './types/pokemon.ts'
import './App.css'

// App holds only the state that more than one page needs, and defines the addresses.
function App() {
  const listState = usePokemonList()
  const { favorites, toggleFavorite } = useFavorites()
  const { theme, toggleTheme } = useTheme()
  // Lives here and not in ListPage, so the filters are still on after visiting a details page.
  const [filters, setFilters] = useState<ListFilters>({ searchText: '', type: 'all', sort: 'number' })

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Layout has no address of its own: it draws the header around every page. */}
        <Route
          element={<Layout theme={theme} onToggleTheme={toggleTheme} favoriteCount={favorites.length} />}
        >
          <Route index element={<Navigate to="/items" replace />} />
          <Route
            path="items"
            element={
              <ListPage
                listState={listState}
                filters={filters}
                onFiltersChange={setFilters}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="items/:id"
            element={<DetailsPage favorites={favorites} onToggleFavorite={toggleFavorite} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
