import RiskBadge from "../ui/RiskBadge";

const riskMeta = {
  low: { color: "#10b981", title: "Low", desc: "Monitor occasionally", glow: "from-emerald-500/20 to-emerald-400/0" },
  medium: { color: "#f59e0b", title: "Medium", desc: "Needs attention", glow: "from-amber-500/25 to-amber-400/0" },
  high: { color: "#f43f5e", title: "High", desc: "High support needed", glow: "from-rose-500/25 to-rose-400/0" },
};

function getRisk(value) {
  if (value >= 70) return "high";
  if (value >= 40) return "medium";
  return "low";
}

export default function RiskScoreCard({ value = 62 }) {
  const risk = getRisk(value);
  const meta = riskMeta[risk];

  return (
    <div
      className={[
        "rounded-3xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft overflow-hidden relative",
        "transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/55",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 260px at 30% 0%, rgba(167,139,250,0.20) 0%, rgba(167,139,250,0) 65%), radial-gradient(420px 200px at 90% 20%, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0) 60%)",
        }}
      />
      <div className="p-6 md:p-7 relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Overall risk score</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-5xl font-black text-slate-900 leading-none" style={{ color: meta.color }}>
                {Math.round(value)}
              </div>
              <RiskBadge risk={risk} />
            </div>
            <div className="mt-2 text-sm font-extrabold text-slate-700">{meta.desc}</div>
          </div>
          <div className="hidden sm:block">
            <div
              className="h-20 w-20 rounded-3xl border border-white/70 bg-white/55 flex items-center justify-center"
              style={{
                boxShadow: `0 16px 50px rgba(124,58,237,0.18)`,
              }}
            >
              <span className="text-3xl">🧭</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

