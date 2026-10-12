// The highest base stat any Pokémon can have. Used to size the bar.
const MAX_STAT = 255

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

// One base stat: a label, the number and a bar.
function StatBar({ name, value }) {
  const percent = Math.min((value / MAX_STAT) * 100, 100)

  return (
    <div className="stat-bar">
      <span className="stat-bar__label">{STAT_LABELS[name] || name}</span>
      <span className="stat-bar__value">{value}</span>
      <div className="stat-bar__track">
        <div className="stat-bar__fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}

export default StatBar
