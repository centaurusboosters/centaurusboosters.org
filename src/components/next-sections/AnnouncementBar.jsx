'use client';

import { tinaField } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

export default function AnnouncementBar({ store, daysLeft }) {
  const count = countdownLabel(daysLeft);
  return (
    <a className="announce-bar" href={store.url} target="_blank" rel="noopener noreferrer">
      <span data-tina-field={tinaField(store, 'announcement')} className="announce-msg">{store.announcement}</span>
      {count && <span data-tina-field={tinaField(store, 'close_date')} className="announce-days">{count}</span>}
      <span data-tina-field={tinaField(store, 'cta_label')} className="announce-cta">{store.cta_label} →</span>
    </a>
  );
}
