import StatBandSection from '../ui/StatBandSection';
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
      <StatBandSection stats={stats} />
    </div>
  );
}
