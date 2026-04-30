import Button from "../ui/Button";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "typing", label: "Typing Assessment", icon: "⌨️" },
  { id: "report", label: "Analysis Report", icon: "🧠" },
];

export default function SidebarNav({ active = "dashboard", onNavigate }) {
  return (
    <aside
      className="hidden lg:flex w-80 shrink-0 flex-col gap-4 rounded-3xl border border-white/65 bg-white/45 backdrop-blur-xl shadow-soft p-5"
      aria-label="Primary"
    >
      <div className="flex items-center gap-3 px-1">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-soft">
          🧠
        </div>
        <div className="leading-tight">
          <div className="font-black tracking-wide text-violet-800 text-lg">
            DysLearn<span className="text-fuchsia-600">AI</span>
          </div>
          <div className="text-xs font-bold text-slate-600">Early detection</div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 px-1 mb-3">
          Navigation
        </div>
        <nav className="flex flex-col gap-2">
          {ITEMS.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={[
                  "group flex items-center justify-between rounded-2xl px-3 py-3 text-left",
                  "border transition-all duration-300",
                  isActive
                    ? "border-violet-300/70 bg-white/70 shadow-soft"
                    : "border-transparent bg-white/30 hover:bg-white/55 hover:border-white/60",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "h-10 w-10 rounded-2xl flex items-center justify-center border transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-br from-violet-600/15 to-fuchsia-600/15 border-violet-200/80 text-violet-700"
                        : "bg-white/40 border-white/60 text-slate-700 group-hover:text-violet-700",
                    ].join(" ")}
                  >
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-800 group-hover:text-violet-700 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500">AI driven</div>
                  </div>
                </div>

                <div className="text-violet-700 opacity-70 group-hover:opacity-100 transition-opacity font-black">
                  {isActive ? "→" : " "}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="rounded-2xl border border-white/60 bg-white/40 p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="font-extrabold text-slate-800 text-sm">Clinical-ready insights</div>
              <div className="text-xs font-bold text-slate-600 mt-1">
                Transparent risk scoring with behavioral signals.
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" className="w-full" onClick={() => onNavigate?.("report")}>
              View latest report
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

