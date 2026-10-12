// The search box. It does not keep its own state:
// the text lives in App and comes down in props (a "controlled" input).
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      {/* The label is hidden on screen but read by screen readers. */}
      <label className="visually-hidden" htmlFor="search">
        Search by name or number
      </label>
      <svg className="search-bar__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      <input
        id="search"
        className="search-bar__input"
        type="search"
        placeholder="Search name or number (e.g. pikachu, 25)"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
    </div>
  )
}

export default SearchBar
