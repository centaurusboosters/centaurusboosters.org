'use client';

import { useState } from 'react';

export default function Nav({ showTournament }) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 6vw', background: 'rgba(8,18,44,.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,.09)' }}>
      <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }} onClick={closeMenu}>
        <img src="/assets/warriors-logo.png" alt="Centaurus Warriors" style={{ width: 46, height: 46, objectFit: 'contain' }} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, letterSpacing: '.02em', color: '#fff' }}>CENTAURUS WARRIORS</div>
          <div style={{ fontSize: 10.5, letterSpacing: '.22em', color: '#7fa0ff', fontWeight: 700, marginTop: 3 }}>BOOSTER CLUB</div>
        </div>
      </a>
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {showTournament && <a className="navlink" href="#golf" style={navLinkStyle}>GOLF TOURNAMENT</a>}
        {showTournament && <a className="navlink" href="#register" style={navLinkStyle}>REGISTER</a>}
        <a className="navlink" href="#sponsor" style={navLinkStyle}>SPONSOR</a>
        <a className="navlink" href="#grants" style={navLinkStyle}>GRANTS</a>
        <a href="#donate" style={{ background: '#d8242f', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 13, letterSpacing: '.06em', padding: '11px 22px', borderRadius: 3 }}>DONATE</a>
      </div>
      <button className="nav-burger" id="nav-burger" aria-label="Open navigation" aria-expanded={open ? 'true' : 'false'} onClick={() => setOpen((value) => !value)}>
        <span></span><span></span><span></span>
      </button>
      <div id="nav-mobile" className={open ? 'open' : undefined} role="navigation" aria-label="Mobile navigation">
        {showTournament && <a href="#golf" onClick={closeMenu}>GOLF TOURNAMENT</a>}
        {showTournament && <a href="#register" onClick={closeMenu}>REGISTER</a>}
        <a href="#sponsor" onClick={closeMenu}>SPONSOR</a>
        <a href="#grants" onClick={closeMenu}>GRANTS</a>
        <a href="#donate" className="mobile-donate" onClick={closeMenu}>DONATE</a>
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: '#cdd6ee',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: 13.5,
  letterSpacing: '.05em',
};
