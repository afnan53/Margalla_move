// Search + filter + sort in one pure function, so all three always work together.
export function filterClasses(classes, filters, getStatus, remainingOf) {
  const q = filters.q.trim().toLowerCase();
  const result = classes.filter((c) => {
    const text = `${c.title} ${c.instructor} ${c.type} ${c.level} ${c.description}`.toLowerCase();
    if (q && !text.includes(q)) return false;
    if (filters.type !== "all" && c.type !== filters.type) return false;
    if (filters.level !== "all" && c.level !== filters.level) return false;
    if (filters.open && !getStatus(c).canBook) return false;
    return true;
  });
  const sorters = {
    soonest: (a, b) => a.startsAt - b.startsAt,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    seats: (a, b) => remainingOf(b) - remainingOf(a),
  };
  return [...result].sort(sorters[filters.sort] ?? sorters.soonest);
}
