export default function BarsChart({
  labels = [],
  data = [],
  color = "#7c3aed",
  height = 160,
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-3 h-[180px]">
        {data.map((v, i) => {
          const pct = (v / max) * 100;
          const lbl = labels[i] ?? "";
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-xl border border-white/55 bg-white/40 shadow-soft relative overflow-hidden"
                style={{
                  height: `${pct}%`,
                }}
              >
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "100%",
                    background: `linear-gradient(180deg, ${color} 0%, rgba(167,139,250,0.2) 100%)`,
                    opacity: 0.9,
                  }}
                />
              </div>
              {lbl ? (
                <div className="text-[11px] font-extrabold text-slate-600 text-center truncate w-full">
                  {lbl}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

