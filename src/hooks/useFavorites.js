import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pokedex-favorites'

// Reads the saved favorites. If anything is wrong (nothing saved, broken
// data, or the browser blocks storage), we start with an empty list.
function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

// A custom hook: favorites state that is also saved in localStorage,
// so it stays after the page is refreshed.
export function useFavorites() {
  // Passing a function to useState runs it only on the first render.
  const [favorites, setFavorites] = useState(loadFavorites)

  // Every time the favorites change, save them.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Storage can be blocked (private mode). The app still works without it.
    }
  }, [favorites])

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id],
    )
  }

  return { favorites, toggleFavorite }
}
