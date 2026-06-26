'use client';

import forms from '../../data/forms.json';
import { tinaField } from '../tina/editable';

const GRANT_STYLES = [
  { background: '#0b1838', eyebrowColor: '#7fa0ff', bodyColor: '#aebbe0', buttonBackground: '#d8242f', buttonColor: '#fff', formTitle: 'TEAM GRANT APPLICATION' },
  { background: '#d8242f', eyebrowColor: '#ffd0d3', bodyColor: '#ffe0e2', buttonBackground: '#fff', buttonColor: '#d8242f', formTitle: 'SENIOR SCHOLARSHIP APPLICATION' },
];

export default function GrantsEditor({ grants }) {
  return (
    <div id="grants" style={{ padding: '84px 6vw', background: '#fff', scrollMarginTop: 72 }}>
      <div className="grants-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {grants.items.map((grant, i) => (
          <GrantCard key={i} grant={grant} {...GRANT_STYLES[i]} />
        ))}
      </div>
    </div>
  );
}

function GrantCard({ grant, background, eyebrowColor, bodyColor, buttonBackground, buttonColor, formTitle }) {
  return (
    <div style={{ background, borderRadius: 6, padding: 42, color: '#fff' }}>
      <div data-tina-field={tinaField(grant, 'audience')} style={{ color: eyebrowColor, fontWeight: 800, fontSize: 13, letterSpacing: '.16em' }}>{grant.audience.toUpperCase()}</div>
      <h3 data-tina-field={tinaField(grant, 'title')} style={{ fontFamily: "'Anton',sans-serif", fontSize: 38, margin: '10px 0 12px', textTransform: 'uppercase' }}>{grant.title}</h3>
      <p data-tina-field={tinaField(grant, 'body')} style={{ color: bodyColor, fontSize: 15, lineHeight: 1.6, margin: '0 0 22px' }}>{grant.body}</p>
      <button className="form-trigger" data-form-src={forms[grant.form]} data-form-title={formTitle} style={{ background: buttonBackground, color: buttonColor, fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 3, border: 'none', cursor: 'pointer', fontFamily: "'Archivo',sans-serif" }}>{grant.cta_label} →</button>
    </div>
  );
}
