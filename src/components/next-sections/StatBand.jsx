import { tinaField } from '../tina/editable';

export default function StatBand({ tournament, statBand, showTournament, programs = [] }) {
  const stats = showTournament
    ? [
        { value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' },
        { value: `$${tournament.price_foursome}`, label: 'PER FOURSOME' },
        { value: String(tournament.holes), label: `HOLES · ${tournament.format.toUpperCase()}` },
      ]
    : [{ value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' }, ...(statBand?.items ?? [])];
  return (
    <div data-tina-field={!showTournament ? tinaField(statBand, 'items') : undefined}>
      {/* Column count depends on how many stats render, so it stays inline. */}
      <div className="stat-band" style={{ gridTemplateColumns: `repeat(${stats.length},1fr)` }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-cell">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
