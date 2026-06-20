'use client';

import { makeSafeTina, useTina } from '../tina/editable';
import HeroClient from './HeroClient';
import AboutEditor from './AboutEditor';
import StatBand from './StatBand';
import Programs from './Programs';
import GolfEventClient from './GolfEventClient';
import CourseClient from './CourseClient';
import RegisterClient from './RegisterClient';
import GetInvolvedClient from './GetInvolvedClient';
import SponsorCTAClient from './SponsorCTAClient';
import DonateClient from './DonateClient';
import GrantsEditor from './GrantsEditor';
import SponsorStripClient from './SponsorStripClient';
import FooterClient from './FooterClient';

export default function HomePage({ tina, staticData }) {
  const { data } = useTina(tina ?? makeSafeTina('page', staticData));
  const page = data.page;

  return (
    <>
      <HeroClient tournament={page.tournament} site={page.site} />
      <AboutEditor about={page.about} />
      <StatBand tournament={page.tournament} />
      <Programs />
      <GolfEventClient tournament={page.tournament} />
      <CourseClient tournament={page.tournament} />
      <RegisterClient tournament={page.tournament} contacts={page.contacts} />
      <GetInvolvedClient getInvolved={page.get_involved} />
      <SponsorCTAClient site={page.site} sponsorBenefits={page.sponsor_benefits} contacts={page.contacts} />
      <DonateClient site={page.site} />
      <GrantsEditor grants={page.grants} />
      <SponsorStripClient sponsors={page.sponsors} />
      <FooterClient contacts={page.contacts} tournament={page.tournament} site={page.site} />
    </>
  );
}
