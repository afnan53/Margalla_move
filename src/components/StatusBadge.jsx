// Colour is never the only signal: the label text always says the status.
const ICONS = { ok: "●", warn: "▲", error: "✕", neutral: "○" };

export default function StatusBadge({ tone, label }) {
  return (
    <span className={`badge badge-${tone}`}>
      <span aria-hidden="true">{ICONS[tone]} </span>
      {label}
    </span>
  );
}
