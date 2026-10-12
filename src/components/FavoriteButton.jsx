// A heart button that adds or removes a Pokémon from the favorites.
function FavoriteButton({ isFavorite, onToggle, pokemonName, className = '' }) {
  const label = isFavorite
    ? `Remove ${pokemonName} from favorites`
    : `Add ${pokemonName} to favorites`

  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? 'favorite-button--on' : ''} ${className}`}
      aria-label={label}
      aria-pressed={isFavorite}
      title={label}
      onClick={onToggle}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
