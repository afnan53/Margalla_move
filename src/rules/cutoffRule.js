// RULE 3 (fulfilment): booking closes 3 hours before the class starts.
export const CUTOFF_HOURS = 3;

export function checkCutoff(startsAt, now = Date.now(), cutoffHours = CUTOFF_HOURS) {
  const hoursLeft = (startsAt - now) / 3600000;
  if (hoursLeft < cutoffHours) {
    return { ok: false, code: "cutoff", message: `Booking closes ${cutoffHours} hours before the class starts.` };
  }
  return { ok: true };
}
