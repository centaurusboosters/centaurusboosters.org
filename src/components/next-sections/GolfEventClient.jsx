'use client';

import { tinaField } from '../tina/editable';

export default function GolfEventClient({ tournament }) {
  return (
    <div id="golf" className="section">
      <div className="kicker kicker--rule">THE MAIN EVENT</div>
      <h2 data-tina-field={tinaField(tournament, 'section_headline')} className="section-title">{tournament.section_headline}</h2>
      <p data-tina-field={tinaField(tournament, 'section_intro')} className="section-intro">{tournament.section_intro}</p>
      <div className="event-grid">
        <img id="event-photo" className="event-photo" src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/course-1.jpg" alt="Golfer swinging at Indian Peaks Golf Course during the Centaurus Warriors tournament" />
        <div className="event-cards">
          <div className="event-card">
            <div data-tina-field={tinaField(tournament, 'format_label')} className="event-card-title">{tournament.format_label}</div>
            <div data-tina-field={tinaField(tournament, 'inclusions')} className="event-inclusions">
              {tournament.inclusions.map((item) => (
                <span key={item} className="muted-item">✓ {item}</span>
              ))}
            </div>
          </div>
          <div className="event-card">
            <div className="event-card-title">Event-Day Add-Ons</div>
            <div data-tina-field={tinaField(tournament, 'add_ons')} className="event-addons">
              {tournament.add_ons.map((item) => (
                <span key={item} className="muted-item">{item}</span>
              ))}
            </div>
            <div className="event-card-note">Purchased day-of at the course</div>
          </div>
          <div className="event-card">
            <div className="event-card-title">Silent Auction</div>
            <div data-tina-field={tinaField(tournament, 'auction_description')} className="event-card-body">{tournament.auction_description}</div>
          </div>
          <div className="event-prices">
            <div data-tina-field={tinaField(tournament, 'price_player')}>
              <div className="price-value">${tournament.price_player}</div>
              <div className="price-label">PER PLAYER</div>
            </div>
            <div data-tina-field={tinaField(tournament, 'price_foursome')}>
              <div className="price-value">${tournament.price_foursome}</div>
              <div className="price-label">FOURSOME</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
