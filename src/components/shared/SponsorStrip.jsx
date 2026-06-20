import SponsorCard from './SponsorCard.jsx';

export default function SponsorStrip({ sponsors }) {
  const active = sponsors.filter(s => s.enabled);
  return (
    <div className="sponsor-strip-grid">
      {active.map(s => (
        <SponsorCard key={s.name} logo={s.logo} alt={s.alt} />
      ))}
    </div>
  );
}
