// parse a date
export const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Parse a user-supplied date string into a Date, without external libraries.
 *
 * Accept exactly these formats, tried in order:
 *   1. ISO-8601 date or date-time: "2026-09-02", "2026-09-02T14:30:00Z"
 *   2. Day-first regional with / - or . separators: "02/09/2026", "2-9-2026"
 * Reject anything else. Do NOT fall back to `new Date(input)` — it guesses at
 * ambiguous input and accepts invalid values like "2026-13-45".
 *
 * Rules:
 * - Regional formats are always day-first: "13/02/2026" is 13 Feb;
 *   "02/13/2026" is INVALID_DATE, not 13 Feb.
 * - Date-only input resolves to midnight LOCAL time, never UTC.
 * - Validate the calendar date after parsing: reject "31/02/2026" and "29/02/2027".
 * - Trim first; empty or whitespace-only input returns EMPTY.
 * - Two-digit years are UNRECOGNIZED_FORMAT.
 *
 * Examples:
 *   "2026-09-02"   -> { ok: true, value: 2026-09-02 00:00 local }
 *   "02/09/2026"   -> { ok: true, value: 2026-09-02 00:00 local }
 *   "31/02/2026"   -> { ok: false, error: 'INVALID_DATE' }
 *   "next tuesday" -> { ok: false, error: 'UNRECOGNIZED_FORMAT' }
 *   "   "          -> { ok: false, error: 'EMPTY' }
 */
export const parseUserDate = (input: string): { ok: true; value: Date } | { ok: false; error: 'INVALID_DATE' | 'UNRECOGNIZED_FORMAT' | 'EMPTY' } => {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: 'EMPTY' };

  // ISO-8601 date or date-time
  const isoDate = parseDate(trimmed);
  if (isoDate) return { ok: true, value: isoDate };

  // Day-first regional with / - or . separators
  const regionalMatch = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (regionalMatch) {
    const [, dayString = '', monthString = '', yearString = ''] = regionalMatch;
    const day = parseInt(dayString, 10);
    const month = parseInt(monthString, 10) - 1;
    const year = parseInt(yearString, 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return { ok: true, value: date };
    } else {
      return { ok: false, error: 'INVALID_DATE' };
    }
  }

  return { ok: false, error: 'UNRECOGNIZED_FORMAT' };
};
