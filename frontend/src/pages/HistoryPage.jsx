import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { fetchHistory } from "../api.js";

function safeNum(val, fallback = 0) {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function RiskPill({ level }) {
  const styles = {
    high:   "bg-rose-100 text-rose-700 border-rose-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  const icons = { high: "🔴", medium: "🟡", low: "🟢" };
  const key = (level || "low").toLowerCase();
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${styles[key] || styles.low}`}>
      {icons[key]} {key.charAt(0).toUpperCase() + key.slice(1)} Risk
    </span>
  );
}

export default function HistoryPage({ setPage, user }) {
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const userId = user?.user_id || Number(localStorage.getItem("user_id"));

  useEffect(() => {
    if (!userId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }

    fetchHistory(userId)
      .then((data) => {
        // Backend may return array directly or wrapped in { history: [...] }
        const list = Array.isArray(data) ? data : (data.history || data.results || []);
        setHistory(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load history. Is Flask running?");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Assessment History
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
            Previous Results
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-600">
            All assessments saved for{" "}
            <span className="text-violet-700">{user?.child_name || user?.email || "your child"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPage?.("report")}>← Back to Report</Button>
          <Button variant="primary"   onClick={() => setPage?.("typing")}>New Assessment</Button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm font-bold text-slate-500">Loading history…</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="rounded-3xl border border-rose-200/70 bg-rose-50/60 p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="font-extrabold text-rose-700 text-sm mb-2">Could not load history</div>
          <div className="text-xs font-bold text-slate-600">{error}</div>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && history.length === 0 && (
        <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-10 flex flex-col items-center gap-4 text-center">
          <div className="text-5xl">📋</div>
          <div className="font-black text-slate-800 text-lg">No assessments yet</div>
          <div className="text-sm font-bold text-slate-500 max-w-sm">
            Complete your first assessment to see results here.
          </div>
          <Button variant="primary" onClick={() => setPage?.("typing")}>
            Start First Assessment →
          </Button>
        </div>
      )}

      {/* ── History list ── */}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-3">
          {/* Summary bar */}
          <div className="rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xl px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
              {history.length} assessment{history.length !== 1 ? "s" : ""} on record
            </span>
            <div className="flex gap-3 text-xs font-bold text-slate-500">
              <span>🔴 High: {history.filter(h => (h.risk_level || "").toLowerCase() === "high").length}</span>
              <span>🟡 Medium: {history.filter(h => (h.risk_level || "").toLowerCase() === "medium").length}</span>
              <span>🟢 Low: {history.filter(h => (h.risk_level || "").toLowerCase() === "low").length}</span>
            </div>
          </div>

          {/* Cards */}
          {[...history].reverse().map((item, i) => (
            <div
              key={item.id || i}
              className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-5 hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 border border-white/70 flex items-center justify-center font-extrabold text-violet-700 text-sm flex-shrink-0">
                    #{history.length - i}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-800 text-sm">
                      Assessment #{history.length - i}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : item.date || "Date not recorded"}
                    </div>
                  </div>
                </div>
                <RiskPill level={item.risk_level} />
              </div>

              {/* Metrics grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Typing Speed",  value: item.typing_speed     != null ? `${Math.round(safeNum(item.typing_speed))} WPM` : "—" },
                  { label: "Accuracy",      value: item.overall_accuracy  != null ? `${Math.round(safeNum(item.overall_accuracy))}%`  : "—" },
                  { label: "Total Errors",  value: item.total_errors      != null ? safeNum(item.total_errors)                         : "—" },
                  { label: "Cognitive",     value: item.cognitive_score   != null ? `${Math.round(safeNum(item.cognitive_score))}%`    : "—" },
                ].map(m => (
                  <div key={m.label} className="rounded-2xl border border-white/70 bg-white/40 px-3 py-2 text-center">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">{m.label}</div>
                    <div className="font-black text-slate-800 text-sm">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* ML probability bar */}
              {item.probability != null && (
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-extrabold text-slate-500 mb-1">
                    <span>ML Probability</span>
                    <span>{(safeNum(item.probability) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/40 border border-white/70 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${safeNum(item.probability) * 100}%`,
                        background: safeNum(item.probability) >= 0.7 ? "#f87171" : safeNum(item.probability) >= 0.4 ? "#fbbf24" : "#34d399",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
