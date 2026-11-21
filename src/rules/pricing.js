// Derived summary: nothing here is stored, it is recalculated from the plan.
export const BOOKING_FEE = 100;        // Rs, once per booking
export const GROUP_MIN_SPOTS = 4;      // total spots needed for the group discount
export const GROUP_DISCOUNT_RATE = 0.1;

export function computeSummary(items) {
  const valid = items.filter((i) => i.cls);
  const totalSpots = valid.reduce((n, i) => n + Math.max(0, i.spots), 0);
  const subtotal = valid.reduce((n, i) => n + i.cls.price * Math.max(0, i.spots), 0);
  const discount = totalSpots >= GROUP_MIN_SPOTS ? Math.round(subtotal * GROUP_DISCOUNT_RATE) : 0;
  const fee = valid.length > 0 ? BOOKING_FEE : 0;
  const totalMinutes = valid.reduce((n, i) => n + i.cls.durationMin, 0);
  return { classCount: valid.length, totalSpots, totalMinutes, subtotal, discount, fee, total: subtotal - discount + fee };
}
