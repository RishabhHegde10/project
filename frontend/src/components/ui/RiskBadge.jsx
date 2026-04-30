const RISK = {
  low: { label: "Low", className: "text-emerald-700 bg-emerald-100/70 border-emerald-200", ring: "ring-emerald-200/60" },
  medium: { label: "Medium", className: "text-amber-700 bg-amber-100/70 border-amber-200", ring: "ring-amber-200/60" },
  high: { label: "High", className: "text-rose-700 bg-rose-100/70 border-rose-200", ring: "ring-rose-200/60" },
};

export default function RiskBadge({ risk, className = "" }) {
  const meta = RISK[risk] ?? RISK.medium;
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold",
        meta.className,
        "ring-1 ring-inset",
        meta.ring,
        className,
      ].join(" ")}
    >
      {meta.label}
    </span>
  );
}

