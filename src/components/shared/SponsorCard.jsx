export default function SponsorCard({ logo, alt }) {
  return (
    <div className="sponsor-card">
      <img src={logo} alt={alt} />
    </div>
  );
}
