const RISK = {
  low: { color: "#10b981", label: "Low" },
  medium: { color: "#f59e0b", label: "Medium" },
  high: { color: "#f43f5e", label: "High" },
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function RiskRing({ value = 50, risk = "medium", size = 220 }) {
  const meta = RISK[risk] ?? RISK.medium;
  const v = clamp(value, 0, 100);
  const r = (size - 24) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={meta.color} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="12" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(.16,1,.3,1)" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-4xl">🧠</div>
        <div className="mt-2 font-black tracking-wide text-6xl leading-none">{Math.round(v)}%</div>
        <div className="mt-1 text-sm font-extrabold text-slate-700">
          Predicted risk
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center rounded-full px-4 py-1 text-xs font-extrabold border border-white/70 bg-white/55">
            <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: meta.color }} />
            {meta.label} level
          </span>
        </div>
      </div>
    </div>
  );
}

