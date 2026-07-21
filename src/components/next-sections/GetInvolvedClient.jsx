'use client';

import { tinaField } from '../tina/editable';

export default function GetInvolvedClient({ getInvolved, forms }) {
  const items = getInvolved.items;

  return (
    <div id="getinvolved" className="section">
      <div className="section-head">
        <div data-tina-field={tinaField(getInvolved, 'kicker')} className="kicker kicker--center">{getInvolved.kicker}</div>
        <h2 data-tina-field={tinaField(getInvolved, 'headline')} className="section-title">{getInvolved.headline}</h2>
      </div>
      <div className="ways-grid">
        {items.map((item, i) =>
          item.coming_soon ? (
            <div key={i} data-tina-field={tinaField(item, 'title')} className="card">
              <div className="card-title">{item.title}</div>
              <p data-tina-field={tinaField(item, 'description')} className="card-body">{item.description}</p>
              <span className="badge-soon">COMING SOON</span>
            </div>
          ) : (
            <button key={i} className="card form-trigger" data-form-src={forms[item.form]} data-form-title={item.form_title}>
              <div data-tina-field={tinaField(item, 'title')} className="card-title">{item.title}</div>
              <p data-tina-field={tinaField(item, 'description')} className="card-body">{item.description}</p>
              <span data-tina-field={tinaField(item, 'link_label')} className="card-link">{item.link_label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
