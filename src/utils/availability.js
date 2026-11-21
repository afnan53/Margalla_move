import { checkCutoff } from "../rules/cutoffRule.js";

export const LOW_SEATS = 3;

// One place decides how availability is labelled everywhere in the app.
export function getAvailability(cls, remaining, now) {
  if (!checkCutoff(cls.startsAt, now).ok) return { code: "closed", tone: "neutral", label: "Booking closed", canBook: false };
  if (remaining <= 0) return { code: "sold-out", tone: "error", label: "Sold out", canBook: false };
  if (remaining <= LOW_SEATS) return { code: "low", tone: "warn", label: `Only ${remaining} left`, canBook: true };
  return { code: "open", tone: "ok", label: `${remaining} spots left`, canBook: true };
}
