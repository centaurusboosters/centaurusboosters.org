import homeStatic from '../data/home.json';
import formsStatic from '../data/forms.json';
import { getTinaDocument } from '../lib/tina-content';
import HomePage from '../components/next-sections/HomePage';
import FormModal from '../components/next-sections/FormModal';

// getTinaDocument talks to GitHub + Redis live; force this to render per
// request instead of at build time, otherwise `next build` prerenders it
// and those calls run inside the build step itself (slow / rate-limit prone,
// and was timing out the Vercel build).
export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const [tina, formsTina] = await Promise.all([
    getTinaDocument('page', 'home.json'),
    getTinaDocument('forms', 'forms.json'),
  ]);
  const forms = formsTina?.data?.forms ?? formsStatic;

  // Stamped once, on the server, and threaded down as a string. HomePage and
  // every section under it are client components that also render during
  // hydration, so a `new Date()` inside render would disagree between the two
  // passes. Day-granularity math off a single fixed instant is identical on
  // both sides.
  //
  // Dev-only override (?now=2026-08-30) lets the store/registration windows
  // be checked at any simulated date without waiting or editing content. A
  // bare "YYYY-MM-DD" is anchored to noon UTC rather than parsed as UTC
  // midnight, so it lands on that same calendar day in Colorado regardless
  // of DST — plain `new Date('2026-09-20')` is UTC midnight, which is still
  // "Sept 19 evening" in America/Denver and reads a day early everywhere
  // this value feeds the Colorado calendar-day math in schedule.js.
  // Hard-gated to non-production so it can never be used against the live site.
  const params = process.env.NODE_ENV === 'production' ? null : await searchParams;
  const rawNow = params?.now;
  const bareDate = typeof rawNow === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawNow);
  const overrideDate = rawNow ? new Date(bareDate ? `${rawNow}T12:00:00Z` : rawNow) : null;
  const nowIso = overrideDate && !Number.isNaN(overrideDate.getTime()) ? overrideDate.toISOString() : new Date().toISOString();

  return (
    <div id="top">
      <HomePage tina={tina} staticData={homeStatic} forms={forms} nowIso={nowIso} />
      <FormModal />
    </div>
  );
}
