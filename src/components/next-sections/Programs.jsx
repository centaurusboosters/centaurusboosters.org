import programs from '../../data/programs.json';

export default function Programs() {
  return (
    <div style={{ padding: '60px 6vw', background: '#0b1838' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#7fa0ff', fontWeight: 800, fontSize: 13, letterSpacing: '.18em' }}>
          <span style={ruleStyle}></span>PROGRAMS WE SUPPORT<span style={ruleStyle}></span>
        </div>
        <p style={{ color: '#aebbe0', fontSize: 16, margin: '10px 0 0', lineHeight: 1.5 }}>Every Centaurus team. Every season. We've got them covered.</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, maxWidth: 860, margin: '0 auto' }}>
        {programs.map((program) => (
          <span key={program} style={programStyle}>{program}</span>
        ))}
        <span style={{ ...programStyle, background: '#d8242f', color: '#fff' }}>+ more</span>
      </div>
    </div>
  );
}

const ruleStyle = {
  width: 30,
  height: 2,
  background: '#d8242f',
};

const programStyle = {
  background: '#13265a',
  color: '#cdd6ee',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '.06em',
  padding: '8px 18px',
  borderRadius: 3,
};
