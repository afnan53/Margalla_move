import { CLASSES } from "../data/classes.js";

// Simulates a network request. shouldFail lets the demo panel force an error.
export function loadClasses({ shouldFail = false, delay = 700 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Could not load classes (simulated network failure)."));
        return;
      }
      const base = Date.now();
      resolve(CLASSES.map((c) => ({ ...c, startsAt: base + c.startsInHours * 3600000 })));
    }, delay);
  });
}
