'use client';

import forms from '../../data/forms.json';
import { tinaField, useEditableDocument } from '../tina/editable';

export default function GetInvolvedClient({ tina, staticData }) {
  const getInvolved = useEditableDocument(tina, 'get_involved', staticData);
  const items = getInvolved.items;

  return (
    <div id="getinvolved" style={{ padding: '84px 6vw', background: '#0b1838', scrollMarginTop: '72px' }}>
      <div style={{ textAlign: 'center', marginBottom: '38px' }}>
        <div style={{ color: '#7fa0ff', fontWeight: 800, fontSize: '13px', letterSpacing: '.18em' }}>GET INVOLVED</div>
        <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: '46px', color: '#fff', margin: '12px 0 0' }}>WAYS TO BACK THE WARRIORS</h2>
      </div>
      <div className="ways-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {items.map((item, i) =>
          item.coming_soon ? (
            <div key={i} data-tina-field={tinaField(item, 'title')} style={cardStyle}>
              <div style={{ color: '#fff', fontFamily: "'Anton',sans-serif", fontSize: '28px' }}>{item.title}</div>
              <p data-tina-field={tinaField(item, 'description')} style={{ color: '#aebbe0', fontSize: '15px', lineHeight: 1.55 }}>{item.description}</p>
              <span style={{ display: 'inline-block', color: '#7fa0ff', fontWeight: 800, fontSize: '13px', letterSpacing: '.06em', border: '1px solid rgba(127,160,255,.35)', padding: '5px 12px', borderRadius: '3px' }}>COMING SOON</span>
            </div>
          ) : (
            <button key={i} className="form-trigger" data-form-src={forms[item.form]} data-form-title={item.form_title} style={{ ...cardStyle, cursor: 'pointer', border: 'none', borderTop: '4px solid #d8242f' }}>
              <div data-tina-field={tinaField(item, 'title')} style={{ color: '#fff', fontFamily: "'Anton',sans-serif", fontSize: '28px' }}>{item.title}</div>
              <p data-tina-field={tinaField(item, 'description')} style={{ color: '#aebbe0', fontSize: '15px', lineHeight: 1.55 }}>{item.description}</p>
              <span data-tina-field={tinaField(item, 'link_label')} style={{ color: '#7fa0ff', fontWeight: 800, fontSize: '14px' }}>{item.link_label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  textAlign: 'left',
  background: 'linear-gradient(160deg,#16285c,#0e1d45)',
  borderRadius: '5px',
  padding: '34px',
  borderTop: '4px solid #d8242f',
  display: 'block',
  width: '100%',
};
