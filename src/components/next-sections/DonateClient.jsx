'use client';

import forms from '../../data/forms.json';
import { tinaField, useEditableDocument } from '../tina/editable';

export default function DonateClient({ tina, staticData }) {
  const site = useEditableDocument(tina, 'site', staticData);

  return (
    <div id="donate" style={{ padding: '84px 6vw', background: '#0b1838', scrollMarginTop: 72 }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 30px' }}>
        <div style={{ color: '#7fa0ff', fontWeight: 800, fontSize: 13, letterSpacing: '.18em' }}>DONATE</div>
        <h2 data-tina-field={tinaField(site?.donate, 'headline')} style={{ fontFamily: "'Anton',sans-serif", fontSize: 54, color: '#fff', margin: '12px 0 8px' }}>{site.donate.headline}</h2>
        <p data-tina-field={tinaField(site?.donate, 'body')} style={{ color: '#aebbe0', fontSize: 16, lineHeight: 1.55, margin: 0 }}>{site.donate.body}</p>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button className="form-trigger" data-form-src={forms.donate} data-form-title="DONATE" style={{ background: '#d8242f', color: '#fff', fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '.06em', padding: '18px 52px', borderRadius: 3, border: 'none', cursor: 'pointer' }}>DONATE NOW →</button>
      </div>
    </div>
  );
}
