import { useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";
import ClassCard from "../components/ClassCard.jsx";
import DataGate from "../components/DataGate.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { getAvailability } from "../utils/availability.js";
import { filterClasses } from "../utils/filterClasses.js";

const TYPES = ["all", "Yoga", "HIIT", "Strength", "Dance"];
const LEVELS = ["all", "Beginner", "Intermediate", "Advanced"];

function Listing() {
  const { classes, plan, classesById, remainingOf, now } = useBooking();
  const [params, setParams] = useSearchParams();
  const { search } = useLocation();

  // Filters live in the URL, so Back/Forward and links keep them.
  const filters = {
    q: params.get("q") || "",
    type: params.get("type") || "all",
    level: params.get("level") || "all",
    sort: params.get("sort") || "soonest",
    open: params.get("open") === "1",
  };
  const hasFilters = filters.q || filters.type !== "all" || filters.level !== "all" || filters.open;

  function update(key, value) {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all" || (key === "sort" && value === "soonest")) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  }

  const results = useMemo(
    () => filterClasses(classes, filters, (c) => getAvailability(c, remainingOf(c), now), remainingOf),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, params, remainingOf, now]
  );

  // Selected classes that the current filters hide: tell the user, don't drop them.
  const visibleIds = new Set(results.map((c) => c.id));
  const hiddenSelected = plan.map((i) => classesById.get(i.classId)).filter((c) => c && !visibleIds.has(c.id));

  return (
    <>
      <h1>Classes in Islamabad</h1>
      <p className="lead">Pick a class, add spots to your plan, and book in a few steps.</p>

      <form className="filters" role="search" aria-label="Search and filter classes" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="q">Search</label>
          <input id="q" type="search" value={filters.q} placeholder="Title, coach or type" onChange={(e) => update("q", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" value={filters.type} onChange={(e) => update("type", e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All types" : t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="level">Level</label>
          <select id="level" value={filters.level} onChange={(e) => update("level", e.target.value)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l === "all" ? "All levels" : l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="soonest">Soonest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="seats">Most spots left</option>
          </select>
        </div>
        <label className="inline">
          <input type="checkbox" checked={filters.open} onChange={(e) => update("open", e.target.checked ? "1" : "")} />
          Only bookable classes
        </label>
      </form>

      <p role="status" aria-live="polite" className="count-line">{results.length} of {classes.length} classes shown</p>

      {hiddenSelected.length > 0 && (
        <p className="notice" role="status">
          {hiddenSelected.length} class{hiddenSelected.length === 1 ? "" : "es"} in your plan {hiddenSelected.length === 1 ? "is" : "are"} hidden by these filters
          ({hiddenSelected.map((c) => c.title).join(", ")}). <Link to="/plan">Review plan</Link>
        </p>
      )}

      {classes.length === 0 ? (
        <section className="state"><h2>No classes are scheduled yet</h2><p>New timetables are published every Sunday. Please check back soon.</p></section>
      ) : results.length === 0 ? (
        <section className="state">
          <h2>No classes match your search</h2>
          <p>Try a different word, or remove a filter{hasFilters ? " to see more classes" : ""}.</p>
          <button type="button" className="btn btn-primary" onClick={() => setParams({}, { replace: true })}>Clear all filters</button>
        </section>
      ) : (
        <ul className="grid">{results.map((c) => <ClassCard key={c.id} cls={c} search={search} />)}</ul>
      )}
    </>
  );
}

export default function ClassesPage() {
  usePageTitle("Classes");
  return <DataGate><Listing /></DataGate>;
}
