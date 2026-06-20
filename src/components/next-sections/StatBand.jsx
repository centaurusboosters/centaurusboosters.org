import programs from '../../data/programs.json';
import StatBandSection from '../ui/StatBandSection';

export default function StatBand({ tournament }) {
  const stats = [
    { value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' },
    { value: `$${tournament.price_foursome}`, label: 'PER FOURSOME' },
    { value: String(tournament.holes), label: `HOLES · ${tournament.format.toUpperCase()}` },
  ];
  return <StatBandSection stats={stats} />;
}
