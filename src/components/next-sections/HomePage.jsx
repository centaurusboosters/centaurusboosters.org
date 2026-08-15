'use client';

import { makeSafeTina, useTina } from '../tina/editable';
import { resolveSchedule, isCountingDown, GOLF_COUNTDOWN_WINDOW_DAYS } from '../../lib/schedule';
import AnnouncementBar from './AnnouncementBar';
import Nav from './Nav';
import HeroClient from './HeroClient';
import AboutEditor from './AboutEditor';
import StatBand from './StatBand';
import Programs from './Programs';
import StoreClient from './StoreClient';
import GolfEventClient from './GolfEventClient';
import CourseClient from './CourseClient';
import RegisterClient from './RegisterClient';
import GetInvolvedClient from './GetInvolvedClient';
import SponsorCTAClient from './SponsorCTAClient';
import DonateClient from './DonateClient';
import GrantsEditor from './GrantsEditor';
import SponsorStripClient from './SponsorStripClient';
import FooterClient from './FooterClient';

export default function HomePage({ tina, staticData, forms, nowIso }) {
  const { data } = useTina(tina ?? makeSafeTina('page', staticData));
  const page = data.page;

  // Store: needs a URL to be worth showing at all, then the enabled flag and
  // open/close dates decide whether it's currently "in season".
  const storeSchedule = resolveSchedule(
    { enabled: page.store?.enabled, start: page.store?.open_date, end: page.store?.close_date },
    nowIso
  );
  const showStore = Boolean(page.store?.url) && storeSchedule.active;
  const storeDaysLeft = storeSchedule.daysRemaining;

  // Golf registration: the same schedule mechanism, and here it does gate
  // `showTournament` — once registration_closes has passed, the whole
  // tournament section drops off the live site (same as the manual `enabled`
  // toggle). No registration_closes set means the deadline never arrives, so
  // `enabled` stays the only switch.
  const golfSchedule = resolveSchedule(
    { enabled: page.tournament?.enabled, end: page.tournament?.registration_closes },
    nowIso
  );
  const showTournament = golfSchedule.active;
  const showGolfCountdown = showTournament && isCountingDown(golfSchedule.daysRemaining, GOLF_COUNTDOWN_WINDOW_DAYS);
  const golfDaysLeft = showGolfCountdown ? golfSchedule.daysRemaining : null;

  return (
    <>
      {showStore && <AnnouncementBar store={page.store} daysLeft={storeDaysLeft} />}
      <Nav showTournament={showTournament} />
      <HeroClient
        tournament={page.tournament}
        site={page.site}
        showTournament={showTournament}
        forms={forms}
        store={page.store}
        showStore={showStore}
        storeDaysLeft={storeDaysLeft}
        golfDaysLeft={golfDaysLeft}
      />
      <AboutEditor about={page.about} />
      <StatBand tournament={page.tournament} statBand={page.stat_band} showTournament={showTournament} programs={page.programs?.items} />
      <Programs programs={page.programs} />
      {showStore && <StoreClient store={page.store} daysLeft={storeDaysLeft} />}
      {showTournament && <GolfEventClient tournament={page.tournament} />}
      {showTournament && <CourseClient tournament={page.tournament} />}
      {showTournament && <RegisterClient tournament={page.tournament} contacts={page.contacts} forms={forms} golfDaysLeft={golfDaysLeft} />}
      <GetInvolvedClient getInvolved={page.get_involved} forms={forms} showStore={showStore} />
      <SponsorCTAClient site={page.site} sponsorBenefits={page.sponsor_benefits} contacts={page.contacts} forms={forms} />
      <DonateClient site={page.site} forms={forms} />
      <GrantsEditor grants={page.grants} forms={forms} />
      <SponsorStripClient sponsors={page.sponsors} />
      <FooterClient contacts={page.contacts} tournament={page.tournament} site={page.site} showTournament={showTournament} />
    </>
  );
}
