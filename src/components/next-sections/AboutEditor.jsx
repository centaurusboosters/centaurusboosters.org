'use client';

import { EditableRichText, useEditableDocument } from '../tina/editable';

export default function AboutEditor({ tina, fallbackHtml }) {
  const about = useEditableDocument(tina, 'about');

  return (
    <div style={{ padding: '56px 6vw', background: '#0e1f47', textAlign: 'center' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#7fa0ff', fontWeight: 800, fontSize: 13, letterSpacing: '.18em', marginBottom: 18 }}>
          <span style={ruleStyle}></span>ABOUT US<span style={ruleStyle}></span>
        </div>
        <EditableRichText document={about} fallbackHtml={fallbackHtml} style={{ color: '#cdd6ee', fontSize: 19, lineHeight: 1.65, margin: 0, fontWeight: 500 }} />
      </div>
    </div>
  );
}

const ruleStyle = {
  width: 30,
  height: 2,
  background: '#d8242f',
};
