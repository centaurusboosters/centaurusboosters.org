'use client';

import { useState } from 'react';

export default function Nav({ showTournament }) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <div className="nav">
      <a href="#top" className="nav-brand" onClick={closeMenu}>
        <img src="https://uciw2t8wwfuxzowq.public.blob.vercel-storage.com/tina-media/warriors-logo.png" alt="Centaurus Warriors" />
        <div>
          <div className="nav-brand-name">CENTAURUS WARRIORS</div>
          <div className="nav-brand-sub">BOOSTER CLUB</div>
        </div>
      </a>
      <div className="nav-links">
        {showTournament && <a className="navlink" href="#golf">GOLF TOURNAMENT</a>}
        {showTournament && <a className="navlink" href="#register">REGISTER</a>}
        <a className="navlink" href="#sponsor">SPONSOR</a>
        <a className="navlink" href="#grants">GRANTS</a>
        <a className="nav-donate" href="#donate">DONATE</a>
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
