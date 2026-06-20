'use client';

import forms from '../../data/forms.json';
import { tinaField, useEditableDocument } from '../tina/editable';

export default function SponsorCTAClient({ tinaSite, tinaBenefits, tinaContacts, staticSite, staticBenefits, staticContacts }) {
  const site = useEditableDocument(tinaSite, 'site', staticSite);
  const sponsorBenefits = useEditableDocument(tinaBenefits, 'sponsor_benefits', staticBenefits);
  const contacts = useEditableDocument(tinaContacts, 'contacts', staticContacts);

  const cta = site.sponsor_cta;
  const benefits = sponsorBenefits.items;
  const sponsorship = contacts.sponsorship;

  return (
    <div id="sponsor" style={{ padding: '84px 6vw', background: '#f3f5fb', scrollMarginTop: '72px' }}>
      <div className="sponsor-layout" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: '48px', alignItems: 'start' }}>
        <div className="sponsor-sticky" style={{ position: 'sticky', top: '90px' }}>
          <div style={{ color: '#1c3fb0', fontWeight: 800, fontSize: '13px', letterSpacing: '.18em' }}>BECOME A SPONSOR</div>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: '48px', color: '#0b1838', margin: '12px 0 16px', lineHeight: 1 }}>
            <span data-tina-field={tinaField(cta, 'headline_line1')}>{cta.headline_line1}</span>
            <br />
            <span data-tina-field={tinaField(cta, 'headline_line2')}>{cta.headline_line2}</span>
          </h2>
          <p data-tina-field={tinaField(cta, 'intro')} style={{ color: '#55585f', fontSize: '16px', lineHeight: 1.6, margin: '0 0 22px' }}>{cta.intro}</p>
          <div data-tina-field={tinaField(sponsorBenefits, 'items')} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', color: '#2c2f36', fontSize: '15px' }}>
                <span style={{ color: '#d8242f', fontWeight: 900 }}>✓</span>{benefit}
              </div>
            ))}
          </div>
          <p style={{ color: '#797c83', fontSize: '14px', marginTop: '24px', lineHeight: 1.6 }}>
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
        <div style={{ background: '#f3f5fb', borderRadius: '6px', padding: '48px 36px', border: '1px solid #dde3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <button className="form-trigger" data-form-src={forms.sponsorship} data-form-title="SPONSORSHIP INQUIRY" style={{ background: '#0b1838', color: '#fff', fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: '17px', letterSpacing: '.06em', padding: '18px 52px', borderRadius: '3px', border: 'none', cursor: 'pointer' }}>
            BECOME A SPONSOR →
          </button>
        </div>
      </div>
    </div>
  );
}
