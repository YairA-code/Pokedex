// Almost every base stat is below 180, so a full bar means 180 or more.
const BAR_MAX = 180

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

// low / medium / high — decides the bar color in the CSS.
function getLevel(value) {
  if (value < 60) return 'low'
  if (value < 100) return 'medium'
  return 'high'
}

// One base stat: a label, the number and a bar.
function StatBar({ name, value }) {
  const percent = Math.min((value / BAR_MAX) * 100, 100)

  return (
    <div className="stat-bar">
      <span className="stat-bar__label">{STAT_LABELS[name] || name}</span>
      <span className="stat-bar__value">{value}</span>
      <div className="stat-bar__track">
        <div
          className={`stat-bar__fill stat-bar__fill--${getLevel(value)}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  )
}

export default StatBar
