import { MAX_SPOTS_PER_CLASS, checkSpots } from "../rules/capacityRule.js";

// Controlled quantity control. The limit is shown beside it and errors are specific.
export default function SpotsControl({ id, value, remaining, onChange }) {
  const result = checkSpots(value, remaining);
  const limit = Math.min(MAX_SPOTS_PER_CLASS, remaining);
  return (
    <div className="spots">
      <label htmlFor={id}>Spots</label>
      <div className="spots-row">
        <button type="button" className="btn btn-secondary btn-sq" aria-label="Fewer spots" onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <input id={id} type="number" inputMode="numeric" value={value} min="1" max={limit}
          aria-describedby={`${id}-hint`} aria-invalid={!result.ok}
          onChange={(e) => onChange(Math.trunc(Number(e.target.value) || 0))} />
        <button type="button" className="btn btn-secondary btn-sq" aria-label="More spots" onClick={() => onChange(value + 1)}>+</button>
      </div>
      <p id={`${id}-hint`} className="hint">Limit: 1 to {MAX_SPOTS_PER_CLASS} per class{remaining < MAX_SPOTS_PER_CLASS ? ` (${remaining} left)` : ""}.</p>
      {!result.ok && <p className="error-text" role="alert">Error: {result.message}</p>}
    </div>
  );
}
