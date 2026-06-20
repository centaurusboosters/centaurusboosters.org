import sponsorData from '../../data/sponsors.json';
import SponsorStripGrid from '../ui/SponsorStrip';

export default function SponsorStrip() {
  return (
    <section className="sponsor-strip-section">
      <div className="sponsor-strip-label">PROUDLY SUPPORTED BY OUR SPONSORS</div>
      <SponsorStripGrid sponsors={sponsorData.items} />
    </section>
  );
}
