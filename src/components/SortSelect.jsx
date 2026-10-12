// A small dropdown to choose how the list is sorted.
function SortSelect({ value, onChange }) {
  return (
    <label className="sort-select">
      <span className="sort-select__label">Sort</span>
      <select
        className="sort-select__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="number">Number</option>
        <option value="name">Name (A–Z)</option>
      </select>
    </label>
  )
}

export default SortSelect
