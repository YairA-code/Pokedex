// Grey placeholder cards shown while the list is loading,
// so the page has its shape right away instead of being empty.
function SkeletonList({ count = 12 }) {
  // Array.from({ length: 12 }) makes an array with 12 empty places to map over.
  const placeholders = Array.from({ length: count }, (_, index) => index)

  return (
    <ul className="pokemon-list" aria-hidden="true">
      {placeholders.map((index) => (
        <li key={index}>
          <div className="skeleton-card">
            <div className="skeleton-card__image"></div>
            <div className="skeleton-card__line skeleton-card__line--short"></div>
            <div className="skeleton-card__line"></div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default SkeletonList
