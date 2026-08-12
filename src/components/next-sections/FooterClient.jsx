'use client';

import { tinaField } from '../tina/editable';

export default function FooterClient({ contacts, tournament, site, showTournament }) {
  const addressParts = tournament.address.split(', ');

  return (
    <div className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/warriors-logo.png" alt="Centaurus Warriors Booster Club" />
          <div>
            <div className="footer-brand-name">CENTAURUS WARRIORS</div>
            <div className="footer-brand-sub">BOOSTER CLUB</div>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">CONTACT</div>
          {showTournament && (
            <>
              Players —{' '}
              <span data-tina-field={tinaField(contacts?.players, 'name')}>{contacts.players.name}</span>
              <br />
              <a data-tina-field={tinaField(contacts?.players, 'email')} href={`mailto:${contacts.players.email}`}>{contacts.players.email}</a>
              <br />
            </>
          )}
          Sponsorship —{' '}
          <span data-tina-field={tinaField(contacts?.sponsorship?.[0], 'name')}>{contacts.sponsorship[0].name}</span>
          {' '}&amp;{' '}
          <span data-tina-field={tinaField(contacts?.sponsorship?.[1], 'name')}>{contacts.sponsorship[1].name}</span>
          <br />
          <a data-tina-field={tinaField(contacts?.sponsorship?.[0], 'email')} href={`mailto:${contacts.sponsorship[0].email}`}>{contacts.sponsorship[0].email}</a>
          {' · '}
          <a data-tina-field={tinaField(contacts?.sponsorship?.[1], 'email')} href={`mailto:${contacts.sponsorship[1].email}`}>{contacts.sponsorship[1].email}</a>
        </div>
        {showTournament && (
          <div className="footer-col">
            <div className="footer-col-title">THE COURSE</div>
            <span data-tina-field={tinaField(tournament, 'venue')}>{tournament.venue}</span>
            <br />
            <span data-tina-field={tinaField(tournament, 'address')}>
              {addressParts.map((part, idx) => (
                <span key={part}>{part}{idx < addressParts.length - 1 ? ', ' : ''}</span>
              ))}
            </span>
          </div>
        )}
        <div className="footer-col">
          <div className="footer-col-title">CONNECT</div>
          <a data-tina-field={tinaField(site?.social, 'facebook')} className="footer-social" href={site.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          {site?.social?.instagram && (
            <>
              <br />
              <a data-tina-field={tinaField(site?.social, 'instagram')} className="footer-social" href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </>
          )}
        </div>
      </div>
      <div data-tina-field={tinaField(site, 'copyright')} className="footer-copyright">{site.copyright}</div>
    </div>
  );
}
