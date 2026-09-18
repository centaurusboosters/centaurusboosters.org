'use client';

import { tinaField } from '../tina/editable';

export default function ScheduleClient({ schedule }) {
  return (
    <div id="schedule" className="section section--mid section--compact">
      <div className="section-head">
        <div data-tina-field={tinaField(schedule, 'kicker')} className="kicker kicker--rules kicker--center">{schedule.kicker}</div>
        <h2 data-tina-field={tinaField(schedule, 'headline')} className="section-title">{schedule.headline}</h2>
        <p data-tina-field={tinaField(schedule, 'body')} className="section-intro">{schedule.body}</p>
      </div>
      <div className="section-cta">
        <a
          data-tina-field={tinaField(schedule, 'cta_label')}
          className="btn btn--red"
          href={schedule.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {schedule.cta_label} →
        </a>
        {schedule.note && <p data-tina-field={tinaField(schedule, 'note')} className="deadline-note">{schedule.note}</p>}
      </div>
    </div>
  );
}
