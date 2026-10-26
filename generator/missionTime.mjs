// Mission start time + calendar date (2026-10-26): written as an
// SCR_TimeAndWeatherHandlerComponent on the GameModeSF entity. The rules live
// here so the web UI (inputs + migrate) and lib.mjs (emission backstop) clamp
// the same way.
//
// Ranges = the component's Workbench attribute params: hours 0-23, minutes
// 0-59, day 1-31, month 1-12, year 1899-2050 (m_iYear slider "1899 2050").
// The day is ALSO capped to the month's real length: the component hands the
// date to TimeAndWeatherManagerEntity.SetDate, which rejects an impossible
// date (31 February) with "Invalid date parameter" and leaves the terrain's
// own default date in place.

export const MISSION_YEAR_MIN = 1899;
export const MISSION_YEAR_MAX = 2050;

// Noon = the vanilla worlds' "Initial Day Time"; 20 August 1989 = Arland's
// TimeAndWeatherManager date (Everon/Eden: 14 August 1989).
export const DEFAULT_MISSION_TIME = { hours: 12, minutes: 0, day: 20, month: 8, year: 1989 };

/** Days in a month, Gregorian (1900 is not a leap year, 2000 is). */
export function daysInMonth(month, year) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

const clampInt = (v, min, max, fallback) => {
  const n = Math.floor(+v);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
};

/** Normalize any {hours, minutes, day, month, year}-ish input; missing or
 * non-numeric fields take the default. Never throws. */
export function clampMissionTime(t) {
  const src = t && typeof t === "object" ? t : {};
  const d = DEFAULT_MISSION_TIME;
  const year = clampInt(src.year, MISSION_YEAR_MIN, MISSION_YEAR_MAX, d.year);
  const month = clampInt(src.month, 1, 12, d.month);
  return {
    hours: clampInt(src.hours, 0, 23, d.hours),
    minutes: clampInt(src.minutes, 0, 59, d.minutes),
    day: clampInt(src.day, 1, daysInMonth(month, year), Math.min(d.day, daysInMonth(month, year))),
    month,
    year,
  };
}
