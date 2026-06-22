'use client';

import { useEffect, useState } from 'react';
import forms from '../../data/forms.json';
import { tinaField } from '../tina/editable';

export default function HeroClient({ tournament, site, showTournament }) {
  const mission = site.hero_mission;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!showTournament) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % 2), 7000);
    return () => clearInterval(timer);
  }, [showTournament]);

  return (
    <div style={{ position: 'relative', height: 680, overflow: 'hidden', background: 'linear-gradient(125deg,#0b1838 0%,#14275e 55%,#0b1838 100%)' }}>
      {showTournament && (
        <div className="hero-img-panel" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', zIndex: 1 }}>
          <img id="hero-photo" src="/assets/course-2.jpg" alt="Golfer teeing off with Colorado mountain backdrop at Indian Peaks Golf Course" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#0b1838 0%, rgba(11,24,56,.65) 35%, rgba(11,24,56,.15) 100%)', pointerEvents: 'none' }}></div>
        </div>
      )}
      <div style={{ position: 'absolute', left: -60, top: '50%', transform: 'translateY(-50%)', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(216,36,47,.4), transparent 65%)', filter: 'blur(12px)', zIndex: 2 }}></div>

      {showTournament && (
        <div id="spot-golf" className="spot" style={spotStyle(active === 0 ? 0 : -100, active === 0)}>
          <div data-tina-field={tinaField(tournament, 'edition')} style={badgeStyle}>NOW REGISTERING · {tournament.edition.toUpperCase()}</div>
          <h1 style={heroHeadingStyle}>CENTAURUS<br />GOLF TOURNAMENT</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 24, color: '#cdd6ee', fontWeight: 700, fontSize: 17 }}>
            <span data-tina-field={tinaField(tournament, 'date')}>{tournament.date.toUpperCase()}</span>
            <span className="hero-sep" style={{ color: '#5e74b3' }}>|</span>
            <span data-tina-field={tinaField(tournament, 'time')}>{tournament.time.toUpperCase()}</span>
            <span className="hero-sep" style={{ color: '#5e74b3' }}>|</span>
            <span data-tina-field={tinaField(tournament, 'venue')}>{tournament.venue.toUpperCase()}</span>
          </div>
          <div className="hero-cta" style={{ display: 'flex', gap: 14, marginTop: 34 }}>
            <button className="form-trigger" data-form-src={forms.registration} data-form-title="TOURNAMENT REGISTRATION" style={{ background: '#d8242f', color: '#fff', fontFamily: "'Archivo',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: '.04em', padding: '16px 30px', borderRadius: 3, border: 'none', cursor: 'pointer' }}>REGISTER A FOURSOME →</button>
          </div>
        </div>
      )}

      <div id="spot-mission" className="spot" style={spotStyle(showTournament ? (active === 1 ? 0 : 100) : 0, !showTournament || active === 1)}>
        <div data-tina-field={tinaField(mission, 'badge')} style={{ ...badgeStyle, background: 'rgba(255,255,255,.14)' }}>{mission.badge.toUpperCase()}</div>
        <h1 style={{ ...heroHeadingStyle, maxWidth: 700 }}>
          <span data-tina-field={tinaField(mission, 'headline_line1')}>{mission.headline_line1}</span>
          <br />
          <span data-tina-field={tinaField(mission, 'headline_line2')}>{mission.headline_line2}</span>
          {' '}
          <span data-tina-field={tinaField(mission, 'headline_accent')} style={{ color: '#d8242f' }}>{mission.headline_accent}</span>
        </h1>
        <p data-tina-field={tinaField(mission, 'body')} style={{ color: '#cdd6ee', fontSize: 19, lineHeight: 1.5, maxWidth: 540, margin: '24px 0 0', fontWeight: 500 }}>{mission.body}</p>
        <div className="hero-cta" style={{ display: 'flex', gap: 14, marginTop: 34 }}>
          <a href="#sponsor" style={{ background: '#fff', color: '#0b1838', textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: '.04em', padding: '16px 30px', borderRadius: 3 }}>GET INVOLVED</a>
          <a href="#donate" style={{ background: 'rgba(255,255,255,.06)', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 16, letterSpacing: '.04em', padding: '16px 30px', borderRadius: 3, border: '2px solid rgba(255,255,255,.35)' }}>DONATE</a>
        </div>
      </div>

      {showTournament && (
        <div style={{ position: 'absolute', bottom: 26, left: '6vw', display: 'flex', gap: 9, zIndex: 5 }}>
          <span id="dot-golf" onClick={() => setActive(0)} style={dotStyle(active === 0)}></span>
          <span id="dot-mission" onClick={() => setActive(1)} style={dotStyle(active === 1)}></span>
        </div>
      )}
    </div>
  );
}

function spotStyle(xPercent, isActive) {
  return {
    position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', padding: '0 6vw',
    transform: `translateX(${xPercent}%)`,
    pointerEvents: isActive ? undefined : 'none',
  };
}

function dotStyle(isActive) {
  return { width: 34, height: 5, borderRadius: 3, background: isActive ? '#d8242f' : 'rgba(255,255,255,.3)', transition: 'background .5s', cursor: 'pointer' };
}

const badgeStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 10, background: '#d8242f',
  color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '.16em',
  padding: '8px 16px', borderRadius: 3, width: 'max-content',
};

const heroHeadingStyle = {
  fontFamily: "'Anton',sans-serif", fontWeight: 400, fontSize: 96, lineHeight: .92,
  color: '#fff', margin: '22px 0 0', letterSpacing: '.01em', maxWidth: 680,
  textShadow: '0 2px 24px rgba(0,0,0,.35)',
};
