// RULE 2 (eligibility): Advanced classes need Intermediate or Advanced experience.
export const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const REQUIRED_EXPERIENCE = { Beginner: "Beginner", Intermediate: "Beginner", Advanced: "Intermediate" };

export function checkEligibility(classLevel, experience) {
  const needed = REQUIRED_EXPERIENCE[classLevel] ?? "Beginner";
  if (EXPERIENCE_LEVELS.indexOf(experience) >= EXPERIENCE_LEVELS.indexOf(needed)) {
    return { ok: true };
  }
  return { ok: false, code: "experience", message: `${classLevel} classes need at least ${needed} experience.` };
}
