const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "typing", label: "Typing", icon: "⌨️" },
  { id: "report", label: "Report", icon: "🧠" },
];

export default function MobileTopBar({ active, onNavigate }) {
  return (
    <header className="lg:hidden sticky top-0 z-20 backdrop-blur-xl bg-white/55 border-b border-white/70">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-soft">
            🧠
          </div>
          <div className="leading-tight">
            <div className="font-black tracking-wide text-violet-800">
              DysLearn<span className="text-fuchsia-600">AI</span>
            </div>
            <div className="text-xs font-bold text-slate-600">Early detection</div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-2xl border border-white/70 bg-white/35 p-1">
          {ITEMS.map((it) => (
            <button
              key={it.id}
              onClick={() => onNavigate?.(it.id)}
              className={[
                "rounded-xl px-2 py-2 text-xs font-extrabold transition-all duration-300",
                it.id === active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-soft"
                  : "text-slate-700 hover:bg-white/60",
              ].join(" ")}
              aria-current={it.id === active ? "page" : undefined}
            >
              <span className="mr-1">{it.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

