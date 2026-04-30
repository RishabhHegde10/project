export default function LineChart({ data, color = "#7c3aed", height = 180 }) {
  const mx = Math.max(...data, 1);
  const w = 680;
  const h = height;
  const pad = 22;

  const points = data
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (data.length - 1 || 1);
      const y = pad + (1 - v / mx) * (h - pad * 2);
      return { x, y };
    })
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} className="block">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 1, 2, 3].map((i) => {
          const y = pad + (i * (h - pad * 2)) / 3;
          return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="rgba(124,58,237,0.12)" />;
        })}

        {/* Area */}
        <polygon
          points={`${points} ${w - pad},${h - pad} ${pad},${h - pad}`}
          fill="url(#fillGrad)"
          stroke="none"
        />

        {/* Line */}
        <polyline points={points} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

