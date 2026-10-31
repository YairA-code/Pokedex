import { compareStats, formatName } from '../utils/pokemon.ts'
import type { PokemonDetail } from '../types/pokemon.ts'

interface CompareTableProps {
  pokemonA: PokemonDetail
  pokemonB: PokemonDetail
}

function getLabel(statName: string): string {
  return statName === 'hp' ? 'HP' : formatName(statName)
}

// The base stats of two Pokémon, one row per stat. The higher value is marked.
function CompareTable({ pokemonA, pokemonB }: CompareTableProps) {
  const rows = compareStats(pokemonA.stats, pokemonB.stats)

  return (
    <table className="compare-table">
      <thead>
        <tr>
          <th scope="col">{formatName(pokemonA.name)}</th>
          <th scope="col">Stat</th>
          <th scope="col">{formatName(pokemonB.name)}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name} className={row.name === 'total' ? 'compare-table__total' : undefined}>
            <td className={row.winner === 'a' ? 'compare-table__winner' : undefined}>{row.valueA}</td>
            <th scope="row">{getLabel(row.name)}</th>
            <td className={row.winner === 'b' ? 'compare-table__winner' : undefined}>{row.valueB}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CompareTable
