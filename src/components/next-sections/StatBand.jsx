import tournament from '../../data/tournament.json';
import programs from '../../data/programs.json';
import StatBandSection from '../ui/StatBandSection';

const stats = [
  { value: `${programs.length}+`, label: 'PROGRAMS SUPPORTED' },
  { value: `$${tournament.price_foursome}`, label: 'PER FOURSOME' },
  { value: String(tournament.holes), label: `HOLES · ${tournament.format.toUpperCase()}` },
];

export default function StatBand() {
  return <StatBandSection stats={stats} />;
}
