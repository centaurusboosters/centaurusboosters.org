import contacts from '../../data/contacts.json';
import tournament from '../../data/tournament.json';
import site from '../../data/site.json';

const addressParts = tournament.address.split(', ');

export default function Footer() {
  return (
    <div style={{ padding: '54px 6vw', background: '#070f24', color: '#aebbe0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src="/assets/warriors-logo.png" alt="Centaurus Warriors Booster Club" style={{ width: 52, height: 52, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: "'Anton',sans-serif", color: '#fff', fontSize: 20 }}>CENTAURUS WARRIORS</div>
            <div style={{ fontSize: 12, letterSpacing: '.18em', color: '#7fa0ff', fontWeight: 700 }}>BOOSTER CLUB</div>
          </div>
        </div>
        <div style={columnStyle}>
          <div style={columnTitleStyle}>CONTACT</div>
          Players — {contacts.players.name}<br />
          <a href={`mailto:${contacts.players.email}`} style={footerLinkStyle}>{contacts.players.email}</a><br />
          Sponsorship — {contacts.sponsorship[0].name} &amp; {contacts.sponsorship[1].name}<br />
          <a href={`mailto:${contacts.sponsorship[0].email}`} style={footerLinkStyle}>{contacts.sponsorship[0].email}</a> · <a href={`mailto:${contacts.sponsorship[1].email}`} style={footerLinkStyle}>{contacts.sponsorship[1].email}</a>
        </div>
        <div style={columnStyle}>
          <div style={columnTitleStyle}>THE COURSE</div>
          {tournament.venue}<br />
          {addressParts.map((part, idx) => (
            <span key={part}>{part}{idx < addressParts.length - 1 ? ', ' : ''}</span>
          ))}
        </div>
        <div style={columnStyle}>
          <div style={columnTitleStyle}>CONNECT</div>
          <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#7fa0ff', textDecoration: 'none' }}>Facebook</a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 28, paddingTop: 18, fontSize: 13, color: '#6f7da6' }}>{site.copyright}</div>
    </div>
  );
}

const columnStyle = {
  fontSize: 14,
  lineHeight: 1.9,
};

const columnTitleStyle = {
  color: '#fff',
  fontWeight: 800,
  marginBottom: 6,
};

const footerLinkStyle = {
  color: '#aebbe0',
};
