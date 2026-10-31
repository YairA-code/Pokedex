import { Link } from 'react-router'

// Shown for an address that does not exist, and for a Pokémon that is not in the Pokédex.
function NotFoundPage() {
  return (
    <section className="not-found">
      <h1 className="not-found__title">Page not found</h1>
      <p>There is nothing at this address. Maybe the Pokémon ran away?</p>
      <Link to="/items" className="not-found__link">
        Back to the list
      </Link>
    </section>
  )
}

export default NotFoundPage
