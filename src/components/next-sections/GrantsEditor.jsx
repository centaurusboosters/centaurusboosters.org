'use client';

import { tinaField } from '../tina/editable';

const GRANT_VARIANTS = [
  { formTitle: 'TEAM GRANT APPLICATION' },
  { formTitle: 'SENIOR SCHOLARSHIP APPLICATION' },
];

export default function GrantsEditor({ grants, forms }) {
  return (
    <div id="grants" className="section section--light">
      <div className="section-head">
        <div data-tina-field={tinaField(grants, 'kicker')} className="kicker kicker--rules kicker--center">{grants.kicker}</div>
        <h2 data-tina-field={tinaField(grants, 'headline')} className="section-title">{grants.headline}</h2>
      </div>
      <div className="grants-grid">
        {grants.items.map((grant, i) => (
          <GrantCard key={i} grant={grant} forms={forms} {...GRANT_VARIANTS[i % GRANT_VARIANTS.length]} />
        ))}
      </div>
    </div>
  );
}

function GrantCard({ grant, forms, formTitle }) {
  return (
    <div className="grant-card">
      <div data-tina-field={tinaField(grant, 'audience')} className="kicker">{grant.audience.toUpperCase()}</div>
      <h3 data-tina-field={tinaField(grant, 'title')} className="grant-title">{grant.title}</h3>
      <p data-tina-field={tinaField(grant, 'body')} className="grant-body">{grant.body}</p>
      <button className="btn btn--sm btn--red form-trigger" data-form-src={forms[grant.form]} data-form-title={formTitle}>{grant.cta_label}</button>
    </div>
  );
}
