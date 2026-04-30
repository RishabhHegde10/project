export default function MetricCard({ label, value, sub, trendColor = "text-violet-700" }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-4 transition-all duration-300 hover:-translate-y-0.5">
      <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="font-black text-3xl leading-none text-slate-900">{value}</div>
        {sub ? (
          <div className={`text-xs font-extrabold ${trendColor} bg-white/50 border border-white/70 rounded-full px-3 py-1`}>
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
}

