'use client';

import forms from '../../data/forms.json';
import { tinaField, useEditableDocument } from '../tina/editable';

export default function RegisterClient({ tinaTournament, tinaContacts, staticTournament, staticContacts }) {
  const tournament = useEditableDocument(tinaTournament, 'tournament', staticTournament);
  const contacts = useEditableDocument(tinaContacts, 'contacts', staticContacts);

  return (
    <div id="register" style={{ padding: '84px 6vw', background: '#f3f5fb', scrollMarginTop: 72 }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 30px' }}>
        <div style={{ color: '#1c3fb0', fontWeight: 800, fontSize: 13, letterSpacing: '.18em' }}>REGISTER NOW</div>
        <h2 data-tina-field={tinaField(tournament, 'register_headline')} style={{ fontFamily: "'Anton',sans-serif", fontSize: 54, color: '#0b1838', margin: '12px 0 8px' }}>{tournament.register_headline}</h2>
        <p style={{ color: '#55585f', fontSize: 16, lineHeight: 1.55, margin: 0 }}>
          <span data-tina-field={tinaField(tournament, 'register_intro')}>{tournament.register_intro}</span>
          {' '}Questions? Contact{' '}
          <span data-tina-field={tinaField(contacts?.players, 'name')}>{contacts.players.name}</span>
          {' '}at{' '}
          <a data-tina-field={tinaField(contacts?.players, 'email')} href={`mailto:${contacts.players.email}`}>{contacts.players.email}</a>.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 32px', background: '#0b1838', borderRadius: 6, padding: '18px 28px', margin: '0 auto 28px', maxWidth: 680 }}>
        <span data-tina-field={tinaField(tournament, 'arrive_by')} style={detailStyle}>⏰ ARRIVE BY {tournament.arrive_by}</span>
        <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 14 }}>|</span>
        <span data-tina-field={tinaField(tournament, 'time')} style={detailStyle}>🏌 {tournament.time.toUpperCase()}</span>
        <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 14 }}>|</span>
        <span style={detailStyle}>👥 REGISTER UP TO 4 PLAYERS</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button className="form-trigger" data-form-src={forms.registration} data-form-title="TOURNAMENT REGISTRATION" style={{ background: '#d8242f', color: '#fff', fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '.06em', padding: '18px 52px', borderRadius: 3, border: 'none', cursor: 'pointer' }}>REGISTER NOW →</button>
      </div>
    </div>
  );
}

const detailStyle = { color: '#aebbe0', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' };
