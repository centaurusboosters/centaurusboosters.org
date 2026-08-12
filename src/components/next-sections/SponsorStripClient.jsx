'use client';

import { tinaField } from '../tina/editable';

export default function SponsorStripClient({ sponsors }) {
  const active = sponsors.items.filter((s) => s.enabled !== false);

  return (
    <section className="sponsor-strip-section">
      <div data-tina-field={tinaField(sponsors, 'label')} className="sponsor-strip-label">{sponsors.label}</div>
      <div className="sponsor-strip-grid">
        {active.map((s, i) =>
          s.url ? (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              data-tina-field={tinaField(s, 'logo')}
              className="sponsor-card"
            >
              <img src={s.logo} alt={s.alt} />
            </a>
          ) : (
            <div key={i} data-tina-field={tinaField(s, 'logo')} className="sponsor-card">
              <img src={s.logo} alt={s.alt} />
            </div>
          )
        )}
      </div>
    </section>
  );
}
