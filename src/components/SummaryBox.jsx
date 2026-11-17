import { GROUP_MIN_SPOTS } from "../rules/pricing.js";
import { formatMinutes, formatPrice } from "../utils/format.js";

export default function SummaryBox({ summary }) {
  const s = summary;
  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Summary</h2>
      <dl>
        <div><dt>Classes</dt><dd>{s.classCount}</dd></div>
        <div><dt>Total spots</dt><dd>{s.totalSpots}</dd></div>
        <div><dt>Class time</dt><dd>{formatMinutes(s.totalMinutes)}</dd></div>
        <div><dt>Subtotal</dt><dd>{formatPrice(s.subtotal)}</dd></div>
        <div><dt>Group discount (10%)</dt><dd>{s.discount ? `− ${formatPrice(s.discount)}` : "Rs 0"}</dd></div>
        <div><dt>Booking fee</dt><dd>{formatPrice(s.fee)}</dd></div>
        <div className="total"><dt>Total</dt><dd>{formatPrice(s.total)}</dd></div>
      </dl>
      {s.totalSpots > 0 && s.totalSpots < GROUP_MIN_SPOTS && (
        <p className="hint">Book {GROUP_MIN_SPOTS}+ spots in total to save 10%.</p>
      )}
    </section>
  );
}
