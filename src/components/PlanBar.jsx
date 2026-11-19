import { Link, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { formatPrice } from "../utils/format.js";

// Mobile-only bar so the primary action stays within thumb reach while browsing.
export default function PlanBar() {
  const { summary, plan } = useBooking();
  const { pathname } = useLocation();
  const hidden = ["/plan", "/checkout", "/confirmation"].includes(pathname);
  if (hidden || plan.length === 0) return null;
  return (
    <div className="plan-bar">
      <span>{summary.totalSpots} spot{summary.totalSpots === 1 ? "" : "s"} · {formatPrice(summary.total)}</span>
      <Link className="btn btn-primary" to="/plan">Review plan</Link>
    </div>
  );
}
