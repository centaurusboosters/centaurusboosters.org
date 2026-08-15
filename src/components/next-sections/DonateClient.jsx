'use client';

import { tinaField } from '../tina/editable';

export default function DonateClient({ site, forms }) {
  return (
    <div id="donate" className="section">
      <div className="section-head">
        <div className="kicker kicker--rules kicker--center">DONATE</div>
        <h2 data-tina-field={tinaField(site?.donate, 'headline')} className="section-title">{site.donate.headline}</h2>
        <p data-tina-field={tinaField(site?.donate, 'body')} className="section-intro">{site.donate.body}</p>
      </div>
      <div className="section-cta">
        <button data-tina-field={tinaField(site?.donate, 'cta_label')} className="btn btn--red form-trigger" data-form-src={forms.donate} data-form-title="DONATE">{site.donate.cta_label}</button>
      </div>
    </div>
  );
}
