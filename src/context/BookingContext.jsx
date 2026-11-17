import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadClasses } from "../api/mockLoader.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { findPlanConflicts } from "../rules/planConflicts.js";
import { computeSummary } from "../rules/pricing.js";
import { EMPTY_FORM } from "../rules/validateForm.js";

const BookingContext = createContext(null);

const isPlan = (v) => Array.isArray(v) && v.every((i) => i && typeof i.classId === "string" && Number.isInteger(i.spots));
const isCounts = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isBool = (v) => typeof v === "boolean";
const isBooking = (v) => v === null || (v && typeof v.reference === "string" && Array.isArray(v.items));

export function BookingProvider({ children }) {
  // Persisted: plan, seats taken by simulated bookings, demo flag, last booking
  const [plan, setPlan] = useLocalStorage("mm.plan", [], isPlan);
  const [seatsTaken, setSeatsTaken] = useLocalStorage("mm.seatsTaken", {}, isCounts);
  const [simulateFailure, setSimulateFailure] = useLocalStorage("mm.simulateFailure", false, isBool);
  const [lastBooking, setLastBooking] = useLocalStorage("mm.lastBooking", null, isBooking);
  // Memory only: form values (personal details are never saved to storage)
  const [formValues, setFormValues] = useState(EMPTY_FORM);

  const [data, setData] = useState({ status: "loading", classes: [], error: "" });
  const [attempt, setAttempt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  // Load data. The cancelled flag is the cleanup so stale results are ignored.
  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, status: "loading", error: "" }));
    loadClasses({ shouldFail: simulateFailure })
      .then((classes) => !cancelled && setData({ status: "ready", classes, error: "" }))
      .catch((err) => !cancelled && setData({ status: "error", classes: [], error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [attempt, simulateFailure]);

  // Clock tick so the booking cutoff is re-checked while the page stays open.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const classesById = useMemo(() => new Map(data.classes.map((c) => [c.id, c])), [data.classes]);
  const remainingOf = useCallback(
    (cls) => Math.max(0, cls.capacity - cls.booked - (seatsTaken[cls.id] || 0)),
    [seatsTaken]
  );

  const conflicts = useMemo(
    () => (data.status === "ready" ? findPlanConflicts(plan, classesById, remainingOf, now) : []),
    [data.status, plan, classesById, remainingOf, now]
  );
  const summary = useMemo(
    () => computeSummary(plan.map((i) => ({ cls: classesById.get(i.classId), spots: i.spots }))),
    [plan, classesById]
  );

  // Callback actions: pages call these, only this file changes the state.
  const setPlanSpots = (classId, spots) =>
    setPlan((prev) =>
      prev.some((i) => i.classId === classId)
        ? prev.map((i) => (i.classId === classId ? { ...i, spots } : i))
        : [...prev, { classId, spots }]
    );
  const removeFromPlan = (classId) => setPlan((prev) => prev.filter((i) => i.classId !== classId));
  const retry = () => setAttempt((a) => a + 1);

  function placeBooking() {
    const items = plan
      .filter((i) => classesById.has(i.classId))
      .map((i) => {
        const c = classesById.get(i.classId);
        return { classId: c.id, title: c.title, startsAt: c.startsAt, price: c.price, spots: i.spots };
      });
    const reference = `MM-${Date.now().toString(36).toUpperCase()}`;
    setSeatsTaken((prev) => {
      const next = { ...prev };
      items.forEach((i) => (next[i.classId] = (next[i.classId] || 0) + i.spots));
      return next;
    });
    setLastBooking({ reference, placedAt: Date.now(), items, summary });
    setPlan([]);
    setFormValues(EMPTY_FORM);
    return reference;
  }

  // Demo controls
  const sellOut = (classId) => {
    const c = classesById.get(classId);
    if (c) setSeatsTaken((prev) => ({ ...prev, [classId]: c.capacity - c.booked }));
  };
  const resetDemo = () => {
    setSeatsTaken({});
    setLastBooking(null);
    setSimulateFailure(false);
  };

  const value = {
    status: data.status, error: data.error, classes: data.classes, classesById,
    plan, conflicts, summary, now, remainingOf, lastBooking, formValues, setFormValues,
    setPlanSpots, removeFromPlan, placeBooking, retry,
    simulateFailure, setSimulateFailure, sellOut, resetDemo,
  };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
