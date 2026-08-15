'use client';

import { tinaField } from '../tina/editable';

export default function GetInvolvedClient({ getInvolved, forms, showStore }) {
  // The only card with a raw `url` field today is the store link — hide it
  // once the store's own schedule takes it down, so this grid never links
  // to an already-closed store.
  const items = getInvolved.items.filter((item) => !item.url || showStore);

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
          ) : item.url ? (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="card">
              <div data-tina-field={tinaField(item, 'title')} className="card-title">{item.title}</div>
              <p data-tina-field={tinaField(item, 'description')} className="card-body">{item.description}</p>
              <span data-tina-field={tinaField(item, 'link_label')} className="card-link">{item.link_label}</span>
            </a>
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
