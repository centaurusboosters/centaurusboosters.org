'use client';

import forms from '../../data/forms.json';
import { EditableRichText, tinaField, useEditableDocument } from '../tina/editable';

export default function GrantsEditor({ grants }) {
  const teamGrant = useEditableGrant(grants[0]);
  const seniorScholarship = useEditableGrant(grants[1]);

  return (
    <div id="grants" style={{ padding: '84px 6vw', background: '#fff', scrollMarginTop: 72 }}>
      <div className="grants-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <GrantCard {...teamGrant} />
        <GrantCard {...seniorScholarship} />
      </div>
    </div>
  );
}

function useEditableGrant(grant) {
  return {
    ...grant,
    grant: useEditableDocument(grant.tina, 'grants'),
  };
}

function GrantCard({ grant, fallbackHtml, formTitle, background, eyebrowColor, bodyColor, buttonBackground, buttonColor }) {
  return (
    <div style={{ background, borderRadius: 6, padding: 42, color: '#fff' }}>
      <div data-tina-field={tinaField(grant, 'audience')} style={{ color: eyebrowColor, fontWeight: 800, fontSize: 13, letterSpacing: '.16em' }}>{grant.audience.toUpperCase()}</div>
      <h3 data-tina-field={tinaField(grant, 'title')} style={{ fontFamily: "'Anton',sans-serif", fontSize: 38, margin: '10px 0 12px', textTransform: 'uppercase' }}>{grant.title}</h3>
      <EditableRichText document={grant} fallbackHtml={fallbackHtml} style={{ color: bodyColor, fontSize: 15, lineHeight: 1.6, margin: '0 0 22px' }} />
      <button className="form-trigger" data-form-src={forms[grant.form]} data-form-title={formTitle} style={{ background: buttonBackground, color: buttonColor, fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 3, border: 'none', cursor: 'pointer', fontFamily: "'Archivo',sans-serif" }}>{grant.cta_label} →</button>
    </div>
  );
}
