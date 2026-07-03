import { tinaField } from '../tina/editable';

export default function Programs({ programs }) {
  return (
    <div className="section section--compact">
      <div className="section-head">
        <div data-tina-field={tinaField(programs, 'kicker')} className="kicker kicker--rules kicker--center">{programs.kicker}</div>
        <p data-tina-field={tinaField(programs, 'intro')} className="section-intro">{programs.intro}</p>
      </div>
      <div data-tina-field={tinaField(programs, 'items')} className="programs-list">
        {(programs.items ?? []).map((program) => (
          <span key={program} className="program-chip">{program}</span>
        ))}
        <span className="program-chip program-chip--accent">+ more</span>
      </div>
    </div>
  );
}
