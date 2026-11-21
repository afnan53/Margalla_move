// RULE 1 (availability/capacity): 1 to 4 spots per class per booking,
// and never more than the seats remaining.
export const MAX_SPOTS_PER_CLASS = 4;

export function checkSpots(spots, remaining, max = MAX_SPOTS_PER_CLASS) {
  if (!Number.isInteger(spots)) {
    return { ok: false, code: "invalid", allowed: 0, message: "Enter a whole number of spots." };
  }
  if (remaining <= 0) {
    return { ok: false, code: "sold-out", allowed: 0, message: "This class is sold out." };
  }
  const allowed = Math.min(max, remaining);
  if (spots < 1) {
    return { ok: false, code: "too-few", allowed, message: "Book at least 1 spot." };
  }
  if (spots > allowed) {
    const message =
      remaining < max
        ? `Only ${remaining} spot${remaining === 1 ? "" : "s"} left in this class.`
        : `Maximum ${max} spots per class in one booking.`;
    return { ok: false, code: "too-many", allowed, message };
  }
  return { ok: true, code: "ok", allowed, message: "" };
}
