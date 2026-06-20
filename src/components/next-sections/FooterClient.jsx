'use client';

import { tinaField, useEditableDocument } from '../tina/editable';

export default function FooterClient({ tinaContacts, tinaTournament, tinaSite, staticContacts, staticTournament, staticSite }) {
  const contacts = useEditableDocument(tinaContacts, 'contacts', staticContacts);
  const tournament = useEditableDocument(tinaTournament, 'tournament', staticTournament);
  const site = useEditableDocument(tinaSite, 'site', staticSite);

  const addressParts = tournament.address.split(', ');

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
          Players —{' '}
          <span data-tina-field={tinaField(contacts?.players, 'name')}>{contacts.players.name}</span>
          <br />
          <a data-tina-field={tinaField(contacts?.players, 'email')} href={`mailto:${contacts.players.email}`} style={footerLinkStyle}>{contacts.players.email}</a>
          <br />
          Sponsorship —{' '}
          <span data-tina-field={tinaField(contacts?.sponsorship?.[0], 'name')}>{contacts.sponsorship[0].name}</span>
          {' '}&amp;{' '}
          <span data-tina-field={tinaField(contacts?.sponsorship?.[1], 'name')}>{contacts.sponsorship[1].name}</span>
          <br />
          <a data-tina-field={tinaField(contacts?.sponsorship?.[0], 'email')} href={`mailto:${contacts.sponsorship[0].email}`} style={footerLinkStyle}>{contacts.sponsorship[0].email}</a>
          {' · '}
          <a data-tina-field={tinaField(contacts?.sponsorship?.[1], 'email')} href={`mailto:${contacts.sponsorship[1].email}`} style={footerLinkStyle}>{contacts.sponsorship[1].email}</a>
        </div>
        <div style={columnStyle}>
          <div style={columnTitleStyle}>THE COURSE</div>
          <span data-tina-field={tinaField(tournament, 'venue')}>{tournament.venue}</span>
          <br />
          <span data-tina-field={tinaField(tournament, 'address')}>
            {addressParts.map((part, idx) => (
              <span key={part}>{part}{idx < addressParts.length - 1 ? ', ' : ''}</span>
            ))}
          </span>
        </div>
        <div style={columnStyle}>
          <div style={columnTitleStyle}>CONNECT</div>
          <a data-tina-field={tinaField(site?.social, 'facebook')} href={site.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#7fa0ff', textDecoration: 'none' }}>Facebook</a>
        </div>
      </div>
      <div data-tina-field={tinaField(site, 'copyright')} style={{ borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 28, paddingTop: 18, fontSize: 13, color: '#6f7da6' }}>{site.copyright}</div>
    </div>
  );
}

const columnStyle = { fontSize: 14, lineHeight: 1.9 };
const columnTitleStyle = { color: '#fff', fontWeight: 800, marginBottom: 6 };
const footerLinkStyle = { color: '#aebbe0' };
