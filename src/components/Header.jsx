import { Link, NavLink } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export default function Header() {
  const { plan } = useBooking();
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link to="/" className="brand">Margalla Move</Link>
        <nav aria-label="Main">
          <NavLink to="/" end>Classes</NavLink>
          <NavLink to="/plan">
            My plan <span className="count" aria-label={`${plan.length} classes in plan`}>{plan.length}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
