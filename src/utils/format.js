export const formatPrice = (n) => `Rs ${n.toLocaleString("en-PK")}`;
export const formatStart = (ts) =>
  new Date(ts).toLocaleString("en-PK", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
export const formatMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`);
