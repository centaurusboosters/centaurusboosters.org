'use client';

import forms from '../../data/forms.json';
import { tinaField } from '../tina/editable';

export default function SponsorCTAClient({ site, sponsorBenefits, contacts }) {
  const cta = site.sponsor_cta;
  const benefits = sponsorBenefits.items;
  const sponsorship = contacts.sponsorship;

  return (
    <div id="sponsor" className="section section--light">
      <div className="sponsor-layout">
        <div className="sponsor-sticky">
          <div className="kicker">BECOME A SPONSOR</div>
          <h2 className="section-title">
            <span data-tina-field={tinaField(cta, 'headline_line1')}>{cta.headline_line1}</span>
            <br />
            <span data-tina-field={tinaField(cta, 'headline_line2')}>{cta.headline_line2}</span>
          </h2>
          <p data-tina-field={tinaField(cta, 'intro')} className="section-intro">{cta.intro}</p>
          <div data-tina-field={tinaField(sponsorBenefits, 'items')} className="benefit-list">
            {benefits.map((benefit, i) => (
              <div key={i} className="benefit-item">
                <span className="check">✓</span>{benefit}
              </div>
            ))}
          </div>
          <p className="sponsor-note">
            Questions? Contact{' '}
            <span data-tina-field={tinaField(sponsorship?.[0], 'name')}>{sponsorship[0].name}</span>
            {' '}&amp;{' '}
            <span data-tina-field={tinaField(sponsorship?.[1], 'name')}>{sponsorship[1].name}</span>
            <br />
            <a data-tina-field={tinaField(sponsorship?.[0], 'email')} href={`mailto:${sponsorship[0].email}`}>{sponsorship[0].email}</a>
            {' · '}
            <a data-tina-field={tinaField(sponsorship?.[1], 'email')} href={`mailto:${sponsorship[1].email}`}>{sponsorship[1].email}</a>
          </p>
        </div>
        <div className="sponsor-form-box">
          <button data-tina-field={tinaField(cta, 'cta_label')} className="btn btn--navy form-trigger" data-form-src={forms.sponsorship} data-form-title="SPONSORSHIP INQUIRY">
            {cta.cta_label} →
          </button>
        </div>
      </div>
    </div>
  );
}
