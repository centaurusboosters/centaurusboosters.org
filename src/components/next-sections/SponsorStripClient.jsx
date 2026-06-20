'use client';

import { tinaField, useEditableDocument } from '../tina/editable';

export default function SponsorStripClient({ tina, staticData }) {
  const sponsors = useEditableDocument(tina, 'sponsors', staticData);
  const active = sponsors.items.filter((s) => s.enabled !== false);

  return (
    <section className="sponsor-strip-section">
      <div className="sponsor-strip-label">PROUDLY SUPPORTED BY OUR SPONSORS</div>
      <div className="sponsor-strip-grid">
        {active.map((s, i) => (
          <div key={i} data-tina-field={tinaField(s, 'logo')} className="sponsor-card">
            <img src={s.logo} alt={s.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}
