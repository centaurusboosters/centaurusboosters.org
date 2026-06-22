import StatBandSection from '../ui/StatBandSection';

export default function StatBand({ tournament, statBand, showTournament, programs = [] }) {
  const stats = showTournament
    ? [
        { value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' },
        { value: `$${tournament.price_foursome}`, label: 'PER FOURSOME' },
        { value: String(tournament.holes), label: `HOLES · ${tournament.format.toUpperCase()}` },
      ]
    : [{ value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' }, ...(statBand?.items ?? [])];
  return <StatBandSection stats={stats} />;
}
