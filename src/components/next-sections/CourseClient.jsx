'use client';

import { tinaField } from '../tina/editable';

export default function CourseClient({ tournament }) {
  return (
    <div className="section section--mid course">
      <div className="course-outer">
        <div>
          <div className="kicker kicker--rule">THE COURSE</div>
          <h2 data-tina-field={tinaField(tournament, 'venue')} className="section-title">{tournament.venue.toUpperCase()}</h2>
          <p className="course-desc">
            <span data-tina-field={tinaField(tournament, 'course_description')}>{tournament.course_description}</span>
            <br /><br />
            <span data-tina-field={tinaField(tournament, 'address')}>{tournament.address}</span>
          </p>
          <div className="course-map">
            <iframe title={`${tournament.venue} map`} src={tournament.map_embed_url} width="100%" height="260" loading="lazy"></iframe>
          </div>
        </div>
        <div className="course-photos">
          <img id="course-photo-1" data-tina-field={tinaField(tournament?.photos, 'course_1')} src={tournament.photos.course_1} alt={tournament.photos.course_1_alt} />
          <img id="course-photo-2" data-tina-field={tinaField(tournament?.photos, 'course_2')} src={tournament.photos.course_2} alt={tournament.photos.course_2_alt} />
        </div>
      </div>
    </div>
  );
}
