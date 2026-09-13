'use client';

import { tinaField } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

/** Golf counterpart to the store's AnnouncementBar: counts down to
 *  `registration_closes` and opens the registration form modal. */
export default function GolfAnnouncementBar({ tournament, daysLeft, forms }) {
  const count = daysLeft === 0 ? 'LAST DAY TO REGISTER' : `${countdownLabel(daysLeft)} TO REGISTER`;
  return (
    <button
      type="button"
      className="announce-bar form-trigger"
      data-form-src={forms.registration}
      data-form-title="TOURNAMENT REGISTRATION"
    >
      <span data-tina-field={tinaField(tournament, 'hero_headline_line2')} className="announce-msg">
        {tournament.hero_headline_line2} · {tournament.date}
      </span>
      <span data-tina-field={tinaField(tournament, 'registration_closes')} className="announce-days">{count}</span>
      <span data-tina-field={tinaField(tournament, 'register_cta_label')} className="announce-cta">
        {tournament.register_cta_label}
      </span>
    </button>
  );
}
