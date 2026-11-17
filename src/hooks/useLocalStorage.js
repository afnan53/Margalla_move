import { useEffect, useState } from "react";

// State that survives reloads. isValid guards against old or corrupted saved data.
export function useLocalStorage(key, initial, isValid) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed = JSON.parse(raw);
      return isValid(parsed) ? parsed : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: the app still works without it */
    }
  }, [key, value]);
  return [value, setValue];
}
