import tournament from '../../data/tournament.json';

export default function GolfEvent() {
  return (
    <div id="golf" style={{ padding: '84px 6vw', background: '#0b1838', scrollMarginTop: 72 }}>
      <div style={eyebrowStyle}><span style={ruleStyle}></span>THE MAIN EVENT</div>
      <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: 58, color: '#fff', margin: '14px 0 0', lineHeight: .98 }}>{tournament.section_headline}</h2>
      <p style={{ color: '#aebbe0', fontSize: 18, lineHeight: 1.6, maxWidth: 620, margin: '16px 0 0' }}>{tournament.section_intro}</p>
      <div className="event-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 36, marginTop: 42, alignItems: 'stretch' }}>
        <img id="event-photo" src="/assets/course-1.jpg" alt="Golfer swinging at Indian Peaks Golf Course during the Centaurus Warriors tournament" style={{ minHeight: 380, width: '100%', borderRadius: 6, objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={eventCardStyle}>
            <div style={cardTitleStyle}>{tournament.format_label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginTop: 10 }}>
              {tournament.inclusions.map((item) => (
                <span key={item} style={mutedItemStyle}>✓ {item}</span>
              ))}
            </div>
          </div>
          <div style={eventCardStyle}>
            <div style={cardTitleStyle}>Event-Day Add-Ons</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginTop: 10 }}>
              {tournament.add_ons.map((item) => (
                <span key={item} style={mutedItemStyle}>{item}</span>
              ))}
            </div>
            <div style={{ color: '#7fa0ff', fontSize: 12, marginTop: 10, fontStyle: 'italic' }}>Purchased day-of at the course</div>
          </div>
          <div style={eventCardStyle}>
            <div style={cardTitleStyle}>Silent Auction</div>
            <div style={{ color: '#aebbe0', fontSize: 15, marginTop: 6, lineHeight: 1.5 }}>{tournament.auction_description}</div>
          </div>
          <div style={{ display: 'flex', gap: 28, padding: '8px 4px 0', color: '#fff' }}>
            <Price value={`$${tournament.price_player}`} label="PER PLAYER" />
            <Price value={`$${tournament.price_foursome}`} label="FOURSOME" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Price({ value, label }) {
  return (
    <div>
      <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 32 }}>{value}</div>
      <div style={{ color: '#aebbe0', fontSize: 13, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

const eyebrowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  color: '#7fa0ff',
  fontWeight: 800,
  fontSize: 13,
  letterSpacing: '.18em',
};

const ruleStyle = {
  width: 30,
  height: 2,
  background: '#d8242f',
};

const eventCardStyle = {
  background: '#13265a',
  borderRadius: 4,
  padding: '22px 24px',
  borderLeft: '4px solid #d8242f',
};

const cardTitleStyle = {
  color: '#fff',
  fontWeight: 800,
  fontSize: 18,
};

const mutedItemStyle = {
  color: '#aebbe0',
  fontSize: 14,
  fontWeight: 600,
};
