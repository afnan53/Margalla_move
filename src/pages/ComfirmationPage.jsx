import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import SummaryBox from "../components/SummaryBox.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { formatStart } from "../utils/format.js";

export default function ConfirmationPage() {
  usePageTitle("Booking confirmed");
  const { lastBooking } = useBooking();
  if (!lastBooking) {
    return (
      <section className="state">
        <h1>No recent booking</h1>
        <p>Make a booking and its confirmation will appear here.</p>
        <Link className="btn btn-primary" to="/">Browse classes</Link>
      </section>
    );
  }
  return (
    <>
      <h1>Booking confirmed (simulated)</h1>
      <p className="notice notice-ok" role="status">Success: your reference is <strong>{lastBooking.reference}</strong>. No payment was taken.</p>
      <div className="two-col">
        <section>
          <h2>Your classes</h2>
          <ul className="plain">
            {lastBooking.items.map((i) => (
              <li key={i.classId}>{i.title} · {formatStart(i.startsAt)} · {i.spots} spot{i.spots === 1 ? "" : "s"}</li>
            ))}
          </ul>
          <Link className="btn btn-primary" to="/">Book another class</Link>
        </section>
        <SummaryBox summary={lastBooking.summary} />
      </div>
    </>
  );
}
