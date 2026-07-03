import { tinaField } from '../tina/editable';

export default function Programs({ page, programs = [] }) {
  return (
    <div className="section section--compact">
      <div className="section-head">
        <div className="kicker kicker--rules kicker--center">PROGRAMS WE SUPPORT</div>
        <p className="section-intro">Every Centaurus team. Every season. We&rsquo;ve got them covered.</p>
      </div>
      <div data-tina-field={tinaField(page, 'programs')} className="programs-list">
        {programs.map((program) => (
          <span key={program} className="program-chip">{program}</span>
        ))}
        <span className="program-chip program-chip--accent">+ more</span>
      </div>
    </div>
  );
}
