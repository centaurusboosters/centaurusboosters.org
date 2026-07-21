'use client';

import { useEffect, useState } from 'react';
import { tinaField } from '../tina/editable';

export default function HeroClient({ tournament, site, showTournament, forms }) {
  const mission = site.hero_mission;

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!showTournament) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % 2), 7000);
    return () => clearInterval(timer);
  }, [showTournament]);

  return (
    <div className="hero">
      {showTournament && (
        <div className="hero-img-panel">
          <img id="hero-photo" data-tina-field={tinaField(tournament?.photos, 'hero')} src={tournament.photos.hero} alt={tournament.photos.hero_alt} />
          <div className="hero-scrim"></div>
        </div>
      )}
      <div className="hero-glow"></div>

      {showTournament && (
        <div id="spot-golf" className="spot" style={spotStyle(active === 0 ? 0 : -100, active === 0)}>
          <div data-tina-field={tinaField(tournament, 'edition')} className="hero-badge">NOW REGISTERING · {tournament.edition.toUpperCase()}</div>
          <h1 className="hero-title">
            <span data-tina-field={tinaField(tournament, 'hero_headline_line1')}>{tournament.hero_headline_line1}</span>
            <br />
            <span data-tina-field={tinaField(tournament, 'hero_headline_line2')}>{tournament.hero_headline_line2}</span>
          </h1>
          <div className="hero-meta">
            <span data-tina-field={tinaField(tournament, 'date')}>{tournament.date.toUpperCase()}</span>
            <span className="hero-sep">|</span>
            <span data-tina-field={tinaField(tournament, 'time')}>{tournament.time.toUpperCase()}</span>
            <span className="hero-sep">|</span>
            <span data-tina-field={tinaField(tournament, 'venue')}>{tournament.venue.toUpperCase()}</span>
          </div>
          <div className="hero-cta">
            <button data-tina-field={tinaField(tournament, 'hero_cta_label')} className="btn btn--red btn--md form-trigger" data-form-src={forms.registration} data-form-title="TOURNAMENT REGISTRATION">{tournament.hero_cta_label} →</button>
          </div>
        </div>
      )}

      <div id="spot-mission" className="spot" style={spotStyle(showTournament ? (active === 1 ? 0 : 100) : 0, !showTournament || active === 1)}>
        <div data-tina-field={tinaField(mission, 'badge')} className="hero-badge hero-badge--soft">{mission.badge.toUpperCase()}</div>
        <h1 className="hero-title">
          <span data-tina-field={tinaField(mission, 'headline_line1')}>{mission.headline_line1}</span>
          <br />
          <span data-tina-field={tinaField(mission, 'headline_line2')}>{mission.headline_line2}</span>
          {' '}
          <span data-tina-field={tinaField(mission, 'headline_accent')} className="text-red">{mission.headline_accent}</span>
        </h1>
        <p data-tina-field={tinaField(mission, 'body')} className="hero-body">{mission.body}</p>
        <div className="hero-cta">
          <a data-tina-field={tinaField(mission, 'cta_primary')} href="#sponsor" className="btn btn--white btn--md">{mission.cta_primary}</a>
          <a data-tina-field={tinaField(mission, 'cta_secondary')} href="#donate" className="btn btn--ghost btn--md">{mission.cta_secondary}</a>
        </div>
      </div>

      {showTournament && (
        <div className="hero-dots">
          <span id="dot-golf" onClick={() => setActive(0)} className={active === 0 ? 'hero-dot active' : 'hero-dot'}></span>
          <span id="dot-mission" onClick={() => setActive(1)} className={active === 1 ? 'hero-dot active' : 'hero-dot'}></span>
        </div>
      )}
    </div>
  );
}

// Slide position is dynamic (which spotlight is showing), so it stays inline.
function spotStyle(xPercent, isActive) {
  return {
    transform: `translateX(${xPercent}%)`,
    pointerEvents: isActive ? undefined : 'none',
  };
}
