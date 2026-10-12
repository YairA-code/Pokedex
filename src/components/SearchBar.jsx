// The search box. It does not keep its own state:
// the text lives in App and comes down in props (a "controlled" input).
function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="search">
        Search by name or number
      </label>
      <input
        id="search"
        className="search-bar__input"
        type="search"
        placeholder="e.g. pikachu or 25"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      <p className="search-bar__count">
        {resultCount} Pokémon shown
      </p>
    </div>
  )
}

export default SearchBar
