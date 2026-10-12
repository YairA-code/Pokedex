// What the details panel shows before any Pokémon is chosen.
function EmptyDetails({ favoriteCount }) {
  return (
    <section className="pokemon-details pokemon-details--empty">
      <div className="empty-state__icon" aria-hidden="true">?</div>
      <h2 className="empty-state__title">Pick a Pokémon</h2>
      <p>Click any card to see its types, abilities, base stats and Pokédex entry.</p>
      <ul className="empty-state__tips">
        <li>Search by name or number</li>
        <li>Filter by type with the colored buttons</li>
        <li>Tap ♥ to save a favorite ({favoriteCount} saved)</li>
      </ul>
    </section>
  )
}

export default EmptyDetails
