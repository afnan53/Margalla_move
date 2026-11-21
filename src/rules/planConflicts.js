import { checkSpots } from "./capacityRule.js";
import { checkCutoff } from "./cutoffRule.js";

// Re-checks every selection against CURRENT data (used for restored or changed plans).
export function findPlanConflicts(plan, classesById, remainingOf, now) {
  return plan.flatMap(({ classId, spots }) => {
    const cls = classesById.get(classId);
    if (!cls) {
      return [{ classId, title: "Unknown class", code: "missing", message: "This class is no longer offered.", fixSpots: null }];
    }
    const found = [];
    const cutoff = checkCutoff(cls.startsAt, now);
    if (!cutoff.ok) found.push({ classId, title: cls.title, code: "cutoff", message: cutoff.message, fixSpots: null });
    const cap = checkSpots(spots, remainingOf(cls));
    if (!cap.ok) {
      const fixSpots = cap.allowed > 0 ? Math.min(Math.max(1, Number.isInteger(spots) ? spots : 1), cap.allowed) : null;
      found.push({ classId, title: cls.title, code: cap.code, message: cap.message, fixSpots });
    }
    return found;
  });
}
