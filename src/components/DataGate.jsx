import { useBooking } from "../context/BookingContext.jsx";

// Shows loading and error (with retry) states; children render only when data is ready.
export default function DataGate({ children }) {
  const { status, error, retry } = useBooking();
  if (status === "loading") return <p className="state" role="status">Loading classes…</p>;
  if (status === "error") {
    return (
      <div className="state state-error" role="alert">
        <h2>We couldn’t load the classes</h2>
        <p>{error}</p>
        <button type="button" className="btn btn-primary" onClick={retry}>Try again</button>
      </div>
    );
  }
  return children;
}
