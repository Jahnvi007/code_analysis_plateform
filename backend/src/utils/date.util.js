// backend/src/utils/date.util.js

/**
 * Returns the current (or given) date as a "YYYY-MM-DD" string in the
 * Asia/Kolkata (IST) timezone.
 *
 * Using "en-CA" locale because that locale formats dates as YYYY-MM-DD
 * by default, avoiding any manual zero-padding.
 *
 * This function does NOT rely on the server's local timezone, so it works
 * correctly even when the server is hosted outside India.
 *
 * @param {Date} [date=new Date()] - The date to convert (defaults to now).
 * @returns {string} e.g. "2026-03-23"
 */
export function getISTDayKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}
