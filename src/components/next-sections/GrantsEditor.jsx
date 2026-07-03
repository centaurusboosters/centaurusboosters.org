'use client';

import forms from '../../data/forms.json';
import { tinaField } from '../tina/editable';

const GRANT_VARIANTS = [
  { cardClass: 'grant-card grant-card--navy', buttonClass: 'btn btn--sm btn--red form-trigger', formTitle: 'TEAM GRANT APPLICATION' },
  { cardClass: 'grant-card grant-card--red', buttonClass: 'btn btn--sm btn--white form-trigger', formTitle: 'SENIOR SCHOLARSHIP APPLICATION' },
];

export default function GrantsEditor({ grants }) {
  return (
    <div id="grants" className="section section--white">
      <div className="grants-grid">
        {grants.items.map((grant, i) => (
          <GrantCard key={i} grant={grant} {...GRANT_VARIANTS[i % GRANT_VARIANTS.length]} />
        ))}
      </div>
    </div>
  );
}

function GrantCard({ grant, cardClass, buttonClass, formTitle }) {
  return (
    <div className={cardClass}>
      <div data-tina-field={tinaField(grant, 'audience')} className="kicker">{grant.audience.toUpperCase()}</div>
      <h3 data-tina-field={tinaField(grant, 'title')} className="grant-title">{grant.title}</h3>
      <p data-tina-field={tinaField(grant, 'body')} className="grant-body">{grant.body}</p>
      <button className={buttonClass} data-form-src={forms[grant.form]} data-form-title={formTitle}>{grant.cta_label} →</button>
    </div>
  );
}
