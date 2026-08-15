'use client';

import { useEffect, useRef, useState } from 'react';
import { tinaField, useEditState } from '../tina/editable';
import { countdownLabel } from '../../lib/schedule';

export default function HeroClient({ tournament, site, showTournament, showRegisterCta, forms, store, showStore, storeDaysLeft, golfDaysLeft }) {
  const { edit } = useEditState();
  const mission = site.hero_mission;
  const golfCount = countdownLabel(golfDaysLeft);
  const storeNote = countdownLabel(storeDaysLeft);

  // Slides are assembled into a list so rotation, dots, and slide position all
  // work off one array instead of hardcoded indexes — lets the store slide
  // (and eventually others) come and go without touching the rotation logic.
  const slides = [];

  if (showTournament) {
    slides.push({
      key: 'golf',
      label: 'Golf tournament',
      node: (
        <>
          <div data-tina-field={tinaField(tournament, 'edition')} className="hero-badge">
            {showRegisterCta ? `NOW REGISTERING · ${tournament.edition.toUpperCase()}` : tournament.edition.toUpperCase()}
            {showRegisterCta && golfCount && (
              <span data-tina-field={tinaField(tournament, 'registration_closes')} className="hero-badge-count">{golfCount}</span>
            )}
          </div>
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
          {showRegisterCta ? (
            <div className="hero-cta">
              <button data-tina-field={tinaField(tournament, 'hero_cta_label')} className="btn btn--red btn--md form-trigger" data-form-src={forms.registration} data-form-title="TOURNAMENT REGISTRATION">{tournament.hero_cta_label} →</button>
              <button data-tina-field={tinaField(site.sponsor_cta, 'cta_label')} className="btn btn--ghost btn--md form-trigger" data-form-src={forms.sponsorship} data-form-title="SPONSORSHIP INQUIRY">{site.sponsor_cta.cta_label} →</button>
            </div>
          ) : (
            <p data-tina-field={tinaField(tournament, 'registration_closed_message')} className="deadline-note">{tournament.registration_closed_message}</p>
          )}
          <a href="#golf" className="hero-cta-learn-more">Learn more</a>
        </>
      ),
    });
  }

  if (showStore) {
    slides.push({
      key: 'store',
      label: 'Apparel store',
      node: (
        <>
          <div data-tina-field={tinaField(store, 'announcement')} className="hero-badge">
            {store.announcement?.toUpperCase()}
            {storeNote && <span className="hero-badge-count">{storeNote}</span>}
          </div>
          <h1 data-tina-field={tinaField(store, 'headline')} className="hero-title">{store.headline}</h1>
          <p data-tina-field={tinaField(store, 'body')} className="hero-body">{store.body}</p>
          <div className="hero-cta">
            <a data-tina-field={tinaField(store, 'cta_label')} href={store.url} target="_blank" rel="noopener noreferrer" className="btn btn--red btn--md">{store.cta_label} →</a>
          </div>
        </>
      ),
    });
  }

  slides.push({
    key: 'mission',
    label: 'Our mission',
    node: (
      <>
        <div data-tina-field={tinaField(mission, 'badge')} className="hero-badge">{mission.badge.toUpperCase()}</div>
        <h1 className="hero-title">
          <span data-tina-field={tinaField(mission, 'headline_line1')}>{mission.headline_line1}</span>
          <br />
          <span data-tina-field={tinaField(mission, 'headline_line2')}>{mission.headline_line2}</span>
          {' '}
          <span data-tina-field={tinaField(mission, 'headline_accent')} className="text-red">{mission.headline_accent}</span>
        </h1>
        <p data-tina-field={tinaField(mission, 'body')} className="hero-body">{mission.body}</p>
        <div className="hero-cta">
          <a data-tina-field={tinaField(mission, 'cta_primary')} href="#sponsor" className="btn btn--red btn--md">{mission.cta_primary}</a>
          <a data-tina-field={tinaField(mission, 'cta_secondary')} href="#donate" className="btn btn--ghost btn--md">{mission.cta_secondary}</a>
        </div>
      </>
    ),
  });

  const [active, setActive] = useState(0);
  // Modulo rather than clamping: the slide count can change underneath us
  // during Tina live editing (toggling the tournament or the store off).
  const current = active % slides.length;

  // With 3+ slides, wrapping between two slides that are themselves mutual
  // neighbors (e.g. last -> first in a 3-slide ring) forces every other
  // slide to flip which side it's parked on — a purely positional fact, not
  // an animation we want to see. Only the outgoing and incoming slide should
  // visibly transition; tracking the previous `current` lets spotStyle snap
  // everything else into place instantly instead of sweeping across screen.
  const prevCurrentRef = useRef(current);
  useEffect(() => {
    prevCurrentRef.current = current;
  }, [current]);

  useEffect(() => {
    // Auto-advance fights with clicking into fields to edit them, so leave
    // slide changes to the dots while inside Tina's live-editing view.
    if (slides.length < 2 || edit) return;
    // Depending on `active` restarts this 7s window on every change, manual
    // dot clicks included — otherwise a click right before the tick fires
    // gets immediately overridden by the pre-existing auto-advance.
    const timer = setInterval(() => setActive((value) => (value + 1) % slides.length), 7000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, edit, active]);

  return (
    <div className="hero">
      {showTournament && (
        <div className="hero-img-panel">
          <img data-tina-field={tinaField(tournament?.photos, 'hero')} src={tournament.photos.hero} alt={tournament.photos.hero_alt} />
          <div className="hero-scrim"></div>
        </div>
      )}
      <div className="hero-glow"></div>

      {slides.map((slide, index) => (
        <div key={slide.key} className="spot" style={spotStyle(index, current, slides.length, prevCurrentRef.current)}>
          {slide.node}
        </div>
      ))}

      {slides.length > 1 && (
        <div className="hero-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              aria-label={slide.label}
              aria-current={index === current ? 'true' : undefined}
              onClick={() => setActive(index)}
              className={index === current ? 'hero-dot active' : 'hero-dot'}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

// Slide position is dynamic (which spotlight is showing), so it stays inline.
// Wraps the shorter way around the loop (e.g. last slide -> first slide moves
// forward one step, not backward through every slide in between) so the
// rotation always reads as continuing forward, never rewinding. Only the
// outgoing (prevCurrent) and incoming (current) slide transition — any other
// slide snaps instantly, since with 3+ slides a wrap can force an unrelated
// slide to flip sides and it shouldn't visibly sweep across the screen doing so.
function spotStyle(index, current, length, prevCurrent) {
  let diff = index - current;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  const isTransitioning = index === current || index === prevCurrent;
  return {
    transform: `translateX(${diff * 100}%)`,
    transition: isTransitioning ? undefined : 'none',
    pointerEvents: index === current ? undefined : 'none',
  };
}
