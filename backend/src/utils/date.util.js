// backend/src/utils/date.util.js

/**
 * Returns an IST (Asia/Kolkata) day key string in YYYY-MM-DD format
 * for the provided Date object.
 * Uses Intl.DateTimeFormat with en-CA locale to produce YYYY-MM-DD.
 * Does not depend on server timezone.
 *
 * @param {Date} date
 * @returns {string} e.g. "2026-03-23"
 */
export function getISTDayKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}
