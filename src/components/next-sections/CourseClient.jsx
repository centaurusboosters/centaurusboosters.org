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
            <iframe title="Indian Peaks Golf Course map" src="https://maps-api-ssl.google.com/maps?hl=en-US&ll=40.002572,-105.123782&output=embed&q=2300+Indian+Peaks+Trail,+Lafayette,+CO+80026,+United+States+(Indian+Peaks+Golf+Course)&z=15" width="100%" height="260" loading="lazy"></iframe>
          </div>
        </div>
        <div className="course-photos">
          <img id="course-photo-1" src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/img-2017.jpg" alt="Golfer on the fairway at Indian Peaks Golf Course" />
          <img id="course-photo-2" src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/course-2.jpg" alt="Golfer teeing off with Colorado mountain backdrop at Indian Peaks Golf Course" />
        </div>
      </div>
    </div>
  );
}
