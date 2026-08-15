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

  // Tournament section visibility: keyed off the event date itself (one day
  // after the tournament, via resolveSchedule's inclusive-end-day semantics)
  // so course/venue/pricing info stays up through the event even after
  // registration closes — people still want that info. No event_date set
  // means it never auto-hides, so `enabled` stays the only switch.
  const tournamentSchedule = resolveSchedule(
    { enabled: page.tournament?.enabled, end: page.tournament?.event_date },
    nowIso
  );
  const showTournament = tournamentSchedule.active;

  // Registration window: a separate, earlier deadline that gates only the
  // register CTA/countdown, not the section itself — closing registration
  // swaps the button for a "registration closed" message rather than
  // removing the tournament info.
  const registrationSchedule = resolveSchedule(
    { enabled: page.tournament?.enabled, end: page.tournament?.registration_closes },
    nowIso
  );
  const showRegisterCta = showTournament && registrationSchedule.active;
  const showGolfCountdown = showRegisterCta && isCountingDown(registrationSchedule.daysRemaining, GOLF_COUNTDOWN_WINDOW_DAYS);
  const golfDaysLeft = showGolfCountdown ? registrationSchedule.daysRemaining : null;

  return (
    <>
      {showStore && <AnnouncementBar store={page.store} daysLeft={storeDaysLeft} />}
      <Nav showTournament={showTournament} />
      <HeroClient
        tournament={page.tournament}
        site={page.site}
        showTournament={showTournament}
        showRegisterCta={showRegisterCta}
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
      {showTournament && <RegisterClient tournament={page.tournament} contacts={page.contacts} forms={forms} golfDaysLeft={golfDaysLeft} showRegisterCta={showRegisterCta} />}
      <GetInvolvedClient getInvolved={page.get_involved} forms={forms} showStore={showStore} />
      <SponsorCTAClient site={page.site} sponsorBenefits={page.sponsor_benefits} contacts={page.contacts} forms={forms} />
      <DonateClient site={page.site} forms={forms} />
      <GrantsEditor grants={page.grants} forms={forms} />
      <SponsorStripClient sponsors={page.sponsors} />
      <FooterClient contacts={page.contacts} tournament={page.tournament} site={page.site} showTournament={showTournament} />
    </>
  );
}
