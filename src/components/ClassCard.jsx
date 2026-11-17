import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import { getAvailability } from "../utils/availability.js";
import { formatMinutes, formatPrice, formatStart } from "../utils/format.js";
import ClassImage from "./ClassImage.jsx";
import StatusBadge from "./StatusBadge.jsx";

// Availability, price, time and level are visible on the card so options can be compared.
export default function ClassCard({ cls, search }) {
  const { remainingOf, now, plan, setPlanSpots } = useBooking();
  const status = getAvailability(cls, remainingOf(cls), now);
  const inPlan = plan.find((i) => i.classId === cls.id);

  return (
    <li className="card">
      <ClassImage cls={cls} />
      <div className="card-body">
        <StatusBadge tone={status.tone} label={status.label} />
        <h2><Link to={`/classes/${cls.id}`} state={{ search }}>{cls.title}</Link></h2>
        <p className="meta">{cls.type} · {cls.level} · {cls.instructor}</p>
        <p className="meta">{formatStart(cls.startsAt)} · {formatMinutes(cls.durationMin)}</p>
        <p className="price">{formatPrice(cls.price)} <span>per spot</span></p>
        <div className="card-actions">
          {inPlan ? (
            <Link className="btn btn-secondary" to="/plan">In plan ({inPlan.spots}) – view</Link>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!status.canBook} onClick={() => setPlanSpots(cls.id, 1)}>
              {status.canBook ? "Add to plan" : "Unavailable"}
            </button>
          )}
          <Link className="btn btn-secondary" to={`/classes/${cls.id}`} state={{ search }}>Details</Link>
        </div>
      </div>
    </li>
  );
}
