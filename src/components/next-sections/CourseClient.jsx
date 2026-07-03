'use client';

import { tinaField } from '../tina/editable';

export default function CourseClient({ tournament }) {
  return (
    <div style={{ padding: '84px 6vw', background: '#0e1f47' }}>
      <div className="course-outer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={eyebrowStyle}><span style={ruleStyle}></span>THE COURSE</div>
          <h2 data-tina-field={tinaField(tournament, 'venue')} style={{ fontFamily: "'Anton',sans-serif", fontSize: 50, color: '#fff', margin: '14px 0 0', lineHeight: 1 }}>{tournament.venue.toUpperCase()}</h2>
          <p style={{ color: '#aebbe0', fontSize: 17, lineHeight: 1.6, margin: '16px 0 22px', maxWidth: 480 }}>
            <span data-tina-field={tinaField(tournament, 'course_description')}>{tournament.course_description}</span>
            <br /><br />
            <span data-tina-field={tinaField(tournament, 'address')}>{tournament.address}</span>
          </p>
          <div style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,.12)' }}>
            <iframe title="Indian Peaks Golf Course map" src="https://maps-api-ssl.google.com/maps?hl=en-US&ll=40.002572,-105.123782&output=embed&q=2300+Indian+Peaks+Trail,+Lafayette,+CO+80026,+United+States+(Indian+Peaks+Golf+Course)&z=15" width="100%" height="260" style={{ display: 'block', border: 0 }} loading="lazy"></iframe>
          </div>
        </div>
        <div className="course-photos" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 520 }}>
          <img id="course-photo-1" src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/img-2017.jpg" alt="Golfer on the fairway at Indian Peaks Golf Course" style={courseImageStyle} />
          <img id="course-photo-2" src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/course-2.jpg" alt="Golfer teeing off with Colorado mountain backdrop at Indian Peaks Golf Course" style={{ ...courseImageStyle, objectPosition: 'center' }} />
        </div>
      </div>
    </div>
  );
}

const eyebrowStyle = { display: 'flex', alignItems: 'center', gap: 12, color: '#7fa0ff', fontWeight: 800, fontSize: 13, letterSpacing: '.18em' };
const ruleStyle = { width: 30, height: 2, background: '#d8242f' };
const courseImageStyle = { width: '100%', height: '100%', borderRadius: 6, objectFit: 'cover', objectPosition: 'center top', display: 'block' };
