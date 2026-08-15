'use client';

import { tinaField } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

export default function RegisterClient({ tournament, contacts, forms, golfDaysLeft, showRegisterCta }) {
  const golfCount = countdownLabel(golfDaysLeft);
  return (
    <div id="register" className="section section--light">
      <div className="section-head">
        <div className="kicker kicker--center">REGISTER NOW</div>
        <h2 data-tina-field={tinaField(tournament, 'register_headline')} className="section-title">{tournament.register_headline}</h2>
        <p className="section-intro">
          <span data-tina-field={tinaField(tournament, 'register_intro')}>{tournament.register_intro}</span>
          {' '}Questions? Contact{' '}
          <span data-tina-field={tinaField(contacts?.players, 'name')}>{contacts.players.name}</span>
          {' '}at{' '}
          <a data-tina-field={tinaField(contacts?.players, 'email')} href={`mailto:${contacts.players.email}`}>{contacts.players.email}</a>.
        </p>
        {golfCount && <div data-tina-field={tinaField(tournament, 'registration_closes')} className="countdown-pill">{golfCount} TO REGISTER</div>}
      </div>
      <div className="register-details">
        <span data-tina-field={tinaField(tournament, 'arrive_by')} className="detail-item">⏰ ARRIVE BY {tournament.arrive_by}</span>
        <span className="detail-sep">|</span>
        <span data-tina-field={tinaField(tournament, 'time')} className="detail-item">🏌 {tournament.time.toUpperCase()}</span>
        <span className="detail-sep">|</span>
        <span className="detail-item">👥 REGISTER UP TO 4 PLAYERS</span>
      </div>
      {showRegisterCta ? (
        <div className="section-cta">
          <button data-tina-field={tinaField(tournament, 'register_cta_label')} className="btn btn--red form-trigger" data-form-src={forms.registration} data-form-title="TOURNAMENT REGISTRATION">{tournament.register_cta_label} →</button>
        </div>
      ) : (
        <div className="section-cta">
          <p data-tina-field={tinaField(tournament, 'registration_closed_message')} className="deadline-note">{tournament.registration_closed_message}</p>
        </div>
      )}
    </div>
  );
}
