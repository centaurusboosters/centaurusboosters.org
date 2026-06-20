import { renderContentMarkdown } from '../../lib/content';

export default function About() {
  const about = renderContentMarkdown('about', 'index.mdx');

  return (
    <div style={{ padding: '56px 6vw', background: '#0e1f47', textAlign: 'center' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#7fa0ff', fontWeight: 800, fontSize: 13, letterSpacing: '.18em', marginBottom: 18 }}>
          <span style={ruleStyle}></span>ABOUT US<span style={ruleStyle}></span>
        </div>
        <div style={{ color: '#cdd6ee', fontSize: 19, lineHeight: 1.65, margin: 0, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: about.html }} />
      </div>
    </div>
  );
}

const ruleStyle = {
  width: 30,
  height: 2,
  background: '#d8242f',
};
