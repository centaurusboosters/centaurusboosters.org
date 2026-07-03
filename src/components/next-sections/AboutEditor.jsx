'use client';

import { EditableRichText } from '../tina/editable';

export default function AboutEditor({ about }) {
  return (
    <div className="section section--mid section--compact section--center about">
      <div className="about-inner">
        <div className="kicker kicker--rules kicker--center">ABOUT US</div>
        <EditableRichText document={about} className="about-body" />
      </div>
    </div>
  );
}
