import { useState } from "react";
import { useBooking } from "../context/BookingContext.jsx";

// Clearly labelled demonstration controls for the edge-case checks.
export default function DemoPanel() {
  const { classes, simulateFailure, setSimulateFailure, sellOut, retry, resetDemo } = useBooking();
  const [pick, setPick] = useState("");
  const chosen = pick || classes[0]?.id || "";
  return (
    <details className="demo">
      <summary>Demo controls (for testing)</summary>
      <div className="demo-body">
        <label className="inline">
          <input type="checkbox" checked={simulateFailure} onChange={(e) => setSimulateFailure(e.target.checked)} />
          Simulate loading failure
        </label>
        <div className="demo-row">
          <label htmlFor="demo-class">Change availability</label>
          <select id="demo-class" value={chosen} onChange={(e) => setPick(e.target.value)} disabled={classes.length === 0}>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button type="button" className="btn btn-secondary" disabled={!chosen} onClick={() => sellOut(chosen)}>Sell out</button>
        </div>
        <div className="demo-row">
          <button type="button" className="btn btn-secondary" onClick={retry}>Reload data</button>
          <button type="button" className="btn btn-secondary" onClick={resetDemo}>Reset demo data</button>
        </div>
      </div>
    </details>
  );
}
