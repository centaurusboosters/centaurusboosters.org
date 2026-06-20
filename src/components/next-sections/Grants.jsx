import forms from '../../data/forms.json';
import { renderContentMarkdown } from '../../lib/content';
import { getTinaDocument } from '../../lib/tina-content';
import GrantsEditor from './GrantsEditor';

export default async function Grants() {
  const teamGrant = renderContentMarkdown('grants', 'team-grants.mdx');
  const seniorScholarship = renderContentMarkdown('grants', 'senior-scholarships.mdx');
  const tinaTeamGrant = await getTinaDocument('grants', 'team-grants.mdx');
  const tinaSeniorScholarship = await getTinaDocument('grants', 'senior-scholarships.mdx');

  if (tinaTeamGrant && tinaSeniorScholarship) {
    return (
      <GrantsEditor
        grants={[
          { tina: tinaTeamGrant, fallbackHtml: teamGrant.html, formTitle: 'TEAM GRANT APPLICATION', background: '#0b1838', eyebrowColor: '#7fa0ff', bodyColor: '#aebbe0', buttonBackground: '#d8242f', buttonColor: '#fff' },
          { tina: tinaSeniorScholarship, fallbackHtml: seniorScholarship.html, formTitle: 'SENIOR SCHOLARSHIP APPLICATION', background: '#d8242f', eyebrowColor: '#ffd0d3', bodyColor: '#ffe0e2', buttonBackground: '#fff', buttonColor: '#d8242f' },
        ]}
      />
    );
  }

  return (
    <div id="grants" style={{ padding: '84px 6vw', background: '#fff', scrollMarginTop: 72 }}>
      <div className="grants-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <GrantCard grant={teamGrant} formTitle="TEAM GRANT APPLICATION" background="#0b1838" eyebrowColor="#7fa0ff" bodyColor="#aebbe0" buttonBackground="#d8242f" buttonColor="#fff" />
        <GrantCard grant={seniorScholarship} formTitle="SENIOR SCHOLARSHIP APPLICATION" background="#d8242f" eyebrowColor="#ffd0d3" bodyColor="#ffe0e2" buttonBackground="#fff" buttonColor="#d8242f" />
      </div>
    </div>
  );
}

function GrantCard({ grant, formTitle, background, eyebrowColor, bodyColor, buttonBackground, buttonColor }) {
  return (
    <div style={{ background, borderRadius: 6, padding: 42, color: '#fff' }}>
      <div style={{ color: eyebrowColor, fontWeight: 800, fontSize: 13, letterSpacing: '.16em' }}>{grant.data.audience.toUpperCase()}</div>
      <h3 style={{ fontFamily: "'Anton',sans-serif", fontSize: 38, margin: '10px 0 12px', textTransform: 'uppercase' }}>{grant.data.title}</h3>
      <div style={{ color: bodyColor, fontSize: 15, lineHeight: 1.6, margin: '0 0 22px' }} dangerouslySetInnerHTML={{ __html: grant.html }} />
      <button className="form-trigger" data-form-src={forms[grant.data.form]} data-form-title={formTitle} style={{ background: buttonBackground, color: buttonColor, fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 3, border: 'none', cursor: 'pointer', fontFamily: "'Archivo',sans-serif" }}>{grant.data.cta_label} →</button>
    </div>
  );
}
