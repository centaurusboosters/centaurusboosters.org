export default function SponsorCTASection({ headline, intro, benefits, contacts, sponsorshipFormUrl }) {
  return (
    <div id="sponsor" style={{ padding: '84px 6vw', background: '#f3f5fb', scrollMarginTop: '72px' }}>
      <div className="sponsor-layout" style={{ display: 'grid', gridTemplateColumns: '.85fr 1.15fr', gap: '48px', alignItems: 'start' }}>
        <div className="sponsor-sticky" style={{ position: 'sticky', top: '90px' }}>
          <div style={{ color: '#1c3fb0', fontWeight: 800, fontSize: '13px', letterSpacing: '.18em' }}>BECOME A SPONSOR</div>
          <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: '48px', color: '#0b1838', margin: '12px 0 16px', lineHeight: 1 }}>
            {headline.map((line, i) => (
              <span key={i}>{line}{i < headline.length - 1 && <br />}</span>
            ))}
          </h2>
          <p style={{ color: '#55585f', fontSize: '16px', lineHeight: 1.6, margin: '0 0 22px' }}>{intro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {benefits.map((benefit, i) => (
              <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', color: '#2c2f36', fontSize: '15px' }}>
                <span style={{ color: '#d8242f', fontWeight: 900 }}>✓</span>{benefit}
              </div>
            ))}
          </div>
          <p style={{ color: '#797c83', fontSize: '14px', marginTop: '24px', lineHeight: 1.6 }}>
            Questions? Contact {contacts[0].name} &amp; {contacts[1].name}
            <br />
            <a href={`mailto:${contacts[0].email}`}>{contacts[0].email}</a>
            {' · '}
            <a href={`mailto:${contacts[1].email}`}>{contacts[1].email}</a>
          </p>
        </div>
        <div style={{ background: '#f3f5fb', borderRadius: '6px', padding: '48px 36px', border: '1px solid #dde3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <button
            className="form-trigger"
            data-form-src={sponsorshipFormUrl}
            data-form-title="SPONSORSHIP INQUIRY"
            style={{ background: '#0b1838', color: '#fff', fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: '17px', letterSpacing: '.06em', padding: '18px 52px', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
          >
            BECOME A SPONSOR →
          </button>
        </div>
      </div>
    </div>
  );
}
