interface FavoritesToggleProps {
  isOn: boolean
  count: number
  onChange: (isOn: boolean) => void
}

// A button that switches between "all Pokémon" and "only my favorites".
function FavoritesToggle({ isOn, count, onChange }: FavoritesToggleProps) {
  return (
    <button
      type="button"
      className={`favorites-toggle ${isOn ? 'favorites-toggle--on' : ''}`}
      aria-pressed={isOn}
      onClick={() => onChange(!isOn)}
    >
      ♥ Favorites ({count})
    </button>
  )
}

export default FavoritesToggle
