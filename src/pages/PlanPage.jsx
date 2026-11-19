import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import ClassImage from "../components/ClassImage.jsx";
import DataGate from "../components/DataGate.jsx";
import SpotsControl from "../components/SpotsControl.jsx";
import SummaryBox from "../components/SummaryBox.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { formatPrice, formatStart } from "../utils/format.js";

function PlanItem({ item }) {
  const { classesById, remainingOf, conflicts, setPlanSpots, removeFromPlan } = useBooking();
  const cls = classesById.get(item.classId);
  const mine = conflicts.filter((c) => c.classId === item.classId);

  if (!cls) {
    return (
      <li className="plan-item">
        <div>
          <h2>Unknown class</h2>
          <p className="error-text">Problem: this class is no longer offered.</p>
          <button type="button" className="btn btn-secondary" onClick={() => removeFromPlan(item.classId)}>Remove</button>
        </div>
      </li>
    );
  }
  return (
    <li className="plan-item">
      <ClassImage cls={cls} />
      <div>
        <h2><Link to={`/classes/${cls.id}`}>{cls.title}</Link></h2>
        <p className="meta">{formatStart(cls.startsAt)} · {formatPrice(cls.price)} per spot</p>
        <SpotsControl id={`spots-${cls.id}`} value={item.spots} remaining={remainingOf(cls)} onChange={(n) => setPlanSpots(cls.id, n)} />
        {mine.filter((c) => c.code === "cutoff").map((c) => (
          <p key={c.code} className="error-text" role="alert">Problem: {c.message}</p>
        ))}
        {mine.some((c) => c.fixSpots) && (
          <button type="button" className="btn btn-secondary" onClick={() => setPlanSpots(cls.id, mine.find((c) => c.fixSpots).fixSpots)}>
            Change to {mine.find((c) => c.fixSpots).fixSpots} spot(s)
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => removeFromPlan(cls.id)}>Remove</button>
      </div>
    </li>
  );
}

function Plan() {
  const { plan, summary, conflicts } = useBooking();
  if (plan.length === 0) {
    return (
      <section className="state">
        <h1>Your plan is empty</h1>
        <p>Add a class to start a booking.</p>
        <Link className="btn btn-primary" to="/">Browse classes</Link>
      </section>
    );
  }
  const blocked = conflicts.length > 0;
  return (
    <>
      <h1>Your plan</h1>
      {blocked && (
        <p className="notice notice-error" role="alert">
          Some classes need attention before you can continue ({conflicts.length} problem{conflicts.length === 1 ? "" : "s"}). Fix or remove them below.
        </p>
      )}
      <div className="two-col">
        <ul className="plan-list">{plan.map((i) => <PlanItem key={i.classId} item={i} />)}</ul>
        <div>
          <SummaryBox summary={summary} />
          {blocked ? (
            <button type="button" className="btn btn-primary btn-wide" disabled>Continue to details</button>
          ) : (
            <Link className="btn btn-primary btn-wide" to="/checkout">Continue to details</Link>
          )}
          <Link className="btn btn-secondary btn-wide" to="/">Add more classes</Link>
        </div>
      </div>
    </>
  );
}

export default function PlanPage() {
  usePageTitle("My plan");
  return <DataGate><Plan /></DataGate>;
}
