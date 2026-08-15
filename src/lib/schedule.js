/**
 * Shared date-window logic for time-limited promotions (apparel store,
 * golf registration deadline).
 *
 * Why every function takes `nowIso` instead of calling `new Date()`:
 * HomePage is 'use client', so every section renders BOTH on the server and
 * again during hydration. A `new Date()` inside render would produce two
 * different values and trip a hydration mismatch. `src/app/page.jsx` stamps
 * `now` once per request and threads it down as a string, so both renders
 * agree on the answer.
 */

export const SITE_TIME_ZONE = 'America/Denver';

/** How far out the quiet golf-registration countdown starts appearing. */
export const GOLF_COUNTDOWN_WINDOW_DAYS = 45;

const DAY_MS = 86400000;

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SITE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** ISO string -> Date, or null for blank/unparseable (a blank date field
 *  must degrade to "no schedule", never to NaN math). */
function parseInstant(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** The Colorado calendar day an instant falls on, keyed as a UTC midnight
 *  epoch so two of them can be subtracted to get whole days. */
function siteDayStart(date) {
  const [y, m, d] = dayFormatter.format(date).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Whole Colorado calendar days from `now` to `target`.
 * Same day -> 0 (i.e. "last day"), tomorrow -> 1, yesterday -> -1.
 * Null when either side is missing/unparseable.
 *
 * Calendar-day subtraction, not `(end - now) / DAY_MS`: the number then only
 * ticks over at Denver midnight, which is what "3 days left" means to a
 * reader, instead of flipping at whatever time of day the deadline was set.
 */
export function daysUntil(nowIso, target) {
  const now = parseInstant(nowIso);
  const end = parseInstant(target);
  if (!now || !end) return null;
  return (siteDayStart(end) - siteDayStart(now)) / DAY_MS;
}

/**
 * Resolve a { enabled, start, end } window.
 *
 *   enabled === false   hard off switch; dates are not consulted at all.
 *   enabled true/absent dates decide (absent start = already started,
 *                       absent end = never ends, so {} is "on").
 *   end                 inclusive THROUGH that Colorado calendar day, so an
 *                       editor who picks "Aug 30" gets all of Aug 30.
 *   start               inclusive FROM that Colorado calendar day.
 */
export function resolveSchedule({ enabled, start, end } = {}, nowIso) {
  const now = parseInstant(nowIso);
  const startsOn = parseInstant(start);
  const daysRemaining = daysUntil(nowIso, end);

  let active = enabled !== false;
  if (active && now) {
    if (startsOn && siteDayStart(now) < siteDayStart(startsOn)) active = false;
    if (daysRemaining !== null && daysRemaining < 0) active = false;
  }

  return { active, daysRemaining };
}

/** Show a countdown only inside `windowDays` of the deadline and not past it. */
export function isCountingDown(daysRemaining, windowDays) {
  return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= windowDays;
}

/** "12 DAYS LEFT" / "1 DAY LEFT" / "LAST DAY". Null when there is nothing to say. */
export function countdownLabel(daysRemaining) {
  if (daysRemaining === null || daysRemaining === undefined || daysRemaining < 0) return null;
  if (daysRemaining === 0) return 'LAST DAY';
  if (daysRemaining === 1) return '1 DAY LEFT';
  return `${daysRemaining} DAYS LEFT`;
}
