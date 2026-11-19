import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import ClassImage from "../components/ClassImage.jsx";
import DataGate from "../components/DataGate.jsx";
import SpotsControl from "../components/SpotsControl.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import NotFoundPage from "./NotFoundPage.jsx";
import { CUTOFF_HOURS } from "../rules/cutoffRule.js";
import { MAX_SPOTS_PER_CLASS, checkSpots } from "../rules/capacityRule.js";
import { getAvailability } from "../utils/availability.js";
import { formatMinutes, formatPrice, formatStart } from "../utils/format.js";

function Details({ cls }) {
  const { remainingOf, now, plan, setPlanSpots, removeFromPlan } = useBooking();
  const { state } = useLocation();
  const inPlan = plan.find((i) => i.classId === cls.id);
  const [spots, setSpots] = useState(inPlan?.spots ?? 1);
  const remaining = remainingOf(cls);
  const status = getAvailability(cls, remaining, now);
  const valid = checkSpots(spots, remaining).ok;
  usePageTitle(cls.title);

  return (
    <article className="details">
      <Link to={{ pathname: "/", search: state?.search || "" }}>← Back to classes</Link>
      <div className="details-grid">
        <ClassImage cls={cls} />
        <div>
          <StatusBadge tone={status.tone} label={status.label} />
          <h1>{cls.title}</h1>
          <p className="meta">{cls.type} · {cls.level} · with {cls.instructor}</p>
          <p>{cls.description}</p>
          <dl className="facts">
            <div><dt>Starts</dt><dd>{formatStart(cls.startsAt)}</dd></div>
            <div><dt>Duration</dt><dd>{formatMinutes(cls.durationMin)}</dd></div>
            <div><dt>Price</dt><dd>{formatPrice(cls.price)} per spot</dd></div>
            <div><dt>Bring</dt><dd>{cls.equipment}</dd></div>
          </dl>
          <h2>Booking conditions</h2>
          <ul>
            <li>1 to {MAX_SPOTS_PER_CLASS} spots per booking, depending on seats left.</li>
            <li>Booking closes {CUTOFF_HOURS} hours before the class starts.</li>
            {cls.level === "Advanced" && <li>Needs Intermediate or Advanced experience (confirmed at checkout).</li>}
            <li>Booking fee Rs 100 per order. 10% off when you book 4 or more spots in total.</li>
          </ul>

          {status.canBook ? (
            <div className="buy">
              <SpotsControl id="spots" value={spots} remaining={remaining} onChange={setSpots} />
              <button type="button" className="btn btn-primary" disabled={!valid} onClick={() => setPlanSpots(cls.id, spots)}>
                {inPlan ? "Update plan" : "Add to plan"}
              </button>
              {inPlan && (
                <>
                  <p className="success-text" role="status">Success: {inPlan.spots} spot{inPlan.spots === 1 ? "" : "s"} in your plan.</p>
                  <button type="button" className="btn btn-secondary" onClick={() => removeFromPlan(cls.id)}>Remove from plan</button>
                  <Link className="btn btn-secondary" to="/plan">Go to plan</Link>
                </>
              )}
            </div>
          ) : (
            <p className="notice" role="status">This class can’t be booked: {status.label.toLowerCase()}. <Link to="/">See other classes</Link></p>
          )}
        </div>
      </div>
    </article>
  );
}

function Lookup() {
  const { id } = useParams();
  const { classesById } = useBooking();
  const cls = classesById.get(id);
  if (!cls) return <NotFoundPage what="class" />;
  return <Details key={cls.id} cls={cls} />;
}

export default function ClassDetailsPage() {
  return <DataGate><Lookup /></DataGate>;
}
