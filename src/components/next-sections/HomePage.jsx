'use client';

import { makeSafeTina, useTina } from '../tina/editable';
import Nav from './Nav';
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

export default function HomePage({ tina, staticData, forms }) {
  const { data } = useTina(tina ?? makeSafeTina('page', staticData));
  const page = data.page;
  const showTournament = page.tournament?.enabled !== false;

  return (
    <>
      <Nav showTournament={showTournament} />
      <HeroClient tournament={page.tournament} site={page.site} showTournament={showTournament} forms={forms} />
      <AboutEditor about={page.about} />
      <StatBand tournament={page.tournament} statBand={page.stat_band} showTournament={showTournament} programs={page.programs?.items} />
      <Programs programs={page.programs} />
      {showTournament && <GolfEventClient tournament={page.tournament} />}
      {showTournament && <CourseClient tournament={page.tournament} />}
      {showTournament && <RegisterClient tournament={page.tournament} contacts={page.contacts} forms={forms} />}
      <GetInvolvedClient getInvolved={page.get_involved} forms={forms} />
      <SponsorCTAClient site={page.site} sponsorBenefits={page.sponsor_benefits} contacts={page.contacts} forms={forms} />
      <DonateClient site={page.site} forms={forms} />
      <GrantsEditor grants={page.grants} forms={forms} />
      <SponsorStripClient sponsors={page.sponsors} />
      <FooterClient contacts={page.contacts} tournament={page.tournament} site={page.site} showTournament={showTournament} />
    </>
  );
}
