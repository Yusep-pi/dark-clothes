import './Stats.css'

// Barras de stats estilo "character select".
const LABELS = { def: 'DEF', wgt: 'WGT', stl: 'STL' }

export default function Stats({ stats, compact = false }) {
  return (
    <dl className={`stats ${compact ? 'stats--compact' : ''}`}>
      {Object.entries(LABELS).map(([key, label]) => (
        <div className="stats__row" key={key}>
          <dt className="mono">{label}</dt>
          <dd>
            <span className="stats__bar" style={{ '--v': stats[key] / 100 }} />
          </dd>
          {!compact && <dd className="stats__num mono">{stats[key]}</dd>}
        </div>
      ))}
    </dl>
  )
}
