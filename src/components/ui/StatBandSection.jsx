export default function StatBandSection({ stats }) {
  return (
    <div className="stat-band" style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length},1fr)`, background: '#d8242f' }}>
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            padding: i === 0 && stats.length > 1 ? '30px 6vw' : '30px',
            textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,.2)' : 'none',
          }}
        >
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: '46px', color: '#fff', lineHeight: 1 }}>
            {stat.value}
          </div>
          <div style={{ color: '#ffd9db', fontWeight: 700, fontSize: '13px', letterSpacing: '.12em', marginTop: '8px' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
