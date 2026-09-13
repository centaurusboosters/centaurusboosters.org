'use client';

import { tinaField } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

/** External-link promo bar (apparel store, silent auction). `promo` needs
 *  `url`, `announcement`, `close_date`, and `cta_label`. */
export default function AnnouncementBar({ promo, daysLeft }) {
  const count = countdownLabel(daysLeft);
  return (
    <a className="announce-bar" href={promo.url} target="_blank" rel="noopener noreferrer">
      <span data-tina-field={tinaField(promo, 'announcement')} className="announce-msg">{promo.announcement}</span>
      {count && <span data-tina-field={tinaField(promo, 'close_date')} className="announce-days">{count}</span>}
      <span data-tina-field={tinaField(promo, 'cta_label')} className="announce-cta">{promo.cta_label} →</span>
    </a>
  );
}
