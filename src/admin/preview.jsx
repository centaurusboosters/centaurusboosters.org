import SponsorStrip from '../components/ui/SponsorStrip.jsx';
import StatBandSection from '../components/ui/StatBandSection.jsx';
import GetInvolvedSection from '../components/ui/GetInvolvedSection.jsx';
import SponsorCTASection from '../components/ui/SponsorCTASection.jsx';

function toArray(value) {
  if (!value) return [];
  if (typeof value.toJS === 'function') return value.toJS();
  return Array.isArray(value) ? value : [];
}

function toObject(value) {
  if (!value) return {};
  if (typeof value.toJS === 'function') return value.toJS();
  return value;
}

function previewAssetPath(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.charAt(0) === '/') return path;
  return '/' + path;
}

function normalizeSponsor(s) {
  const obj = toObject(s);
  return { ...obj, logo: previewAssetPath(obj.logo) };
}

CMS.registerPreviewTemplate('sponsors', function SponsorsPreview({ entry }) {
  const items = toArray(entry.getIn(['data', 'items']))
    .filter(Boolean)
    .map(normalizeSponsor);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f5fb', padding: '54px 6vw', fontFamily: 'Arial, sans-serif' }}>
      <div className="sponsor-strip-label" style={{ textAlign: 'center', color: '#0b1838', fontWeight: 800, fontSize: '13px', letterSpacing: '.18em', marginBottom: '26px' }}>
        PROUDLY SUPPORTED BY OUR SPONSORS
      </div>
      {items.length ? (
        <SponsorStrip sponsors={items} />
      ) : (
        <p style={{ textAlign: 'center', color: '#55585f' }}>No enabled sponsors to preview.</p>
      )}
    </div>
  );
});

CMS.registerPreviewTemplate('tournament', function TournamentPreview({ entry }) {
  const data = toObject(entry.getIn(['data']));
  const stats = [
    { value: '20+', label: 'PROGRAMS SUPPORTED' },
    { value: `$${data.price_foursome ?? 580}`, label: 'PER FOURSOME' },
    { value: String(data.holes ?? 18), label: `HOLES · ${(data.format ?? 'SCRAMBLE').toUpperCase()}` },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#0b1838', minHeight: '100vh' }}>
      <div style={{ padding: '32px 6vw', background: '#14275e', color: '#fff' }}>
        <div style={{ fontSize: '12px', letterSpacing: '.16em', color: '#7fa0ff', fontWeight: 800, marginBottom: '8px' }}>
          NOW REGISTERING · {(data.edition ?? '').toUpperCase()}
        </div>
        <div style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>CENTAURUS GOLF TOURNAMENT</div>
        <div style={{ marginTop: '12px', color: '#cdd6ee', fontSize: '15px', fontWeight: 700 }}>
          {(data.date ?? '').toUpperCase()} &nbsp;|&nbsp; {(data.time ?? '').toUpperCase()} &nbsp;|&nbsp; {(data.venue ?? '').toUpperCase()}
        </div>
      </div>
      <StatBandSection stats={stats} />
      <div style={{ padding: '32px 6vw', color: '#aebbe0', fontSize: '15px', lineHeight: 1.6 }}>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>{data.section_headline}</div>
        <p style={{ margin: '0 0 16px' }}>{data.section_intro}</p>
        <div style={{ color: '#fff', fontWeight: 800 }}>Inclusions: </div>
        <div>{toArray(data.inclusions).join(' · ')}</div>
        <div style={{ marginTop: '16px', color: '#fff', fontWeight: 800 }}>Pricing</div>
        <div>${data.price_player} per player &nbsp;·&nbsp; ${data.price_foursome} foursome</div>
      </div>
    </div>
  );
});

CMS.registerPreviewTemplate('site_data_get_involved', function GetInvolvedPreview({ entry }) {
  const items = toArray(entry.getIn(['data', 'items'])).filter(Boolean).map(toObject);
  return (
    <GetInvolvedSection items={items} formUrls={{}} />
  );
});

CMS.registerPreviewTemplate('site_data_sponsor_benefits', function SponsorBenefitsPreview({ entry }) {
  const benefits = toArray(entry.getIn(['data', 'items'])).filter(Boolean);
  const contacts = [
    { name: 'Sponsor Contact A', email: 'sponsor-a@example.com' },
    { name: 'Sponsor Contact B', email: 'sponsor-b@example.com' },
  ];
  return (
    <SponsorCTASection
      headline={['PUT YOUR BRAND', 'BEHIND THE WARRIORS']}
      intro="Annual and sport-specific options that reach families across every Centaurus program and the golf tournament."
      benefits={benefits}
      contacts={contacts}
      sponsorshipFormUrl="#"
    />
  );
});
