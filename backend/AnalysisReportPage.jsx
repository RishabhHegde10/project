import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import RiskBadge from "../components/ui/RiskBadge";

// ── Helpers ──────────────────────────────────────────────────────────────────

function safeNum(val, fallback = 0) {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

// Local fallback risk calculation when Flask is not running
function computeLocalProbability(data) {
  const wpm       = safeNum(data.wpm, 30);
  const accuracy  = safeNum(data.accuracy, 80);
  const errors    = safeNum(data.errors, 0);
  const pause     = safeNum(data.pauseSeconds, 0);
  const reading   = safeNum(data.reading_score, 70);
  const cognitive = safeNum(data.cognitive_score, 70);
  const survey    = safeNum(data.survey_probability, null);

  // If survey already gave us an ML probability, use it
  if (data.survey_probability != null) {
    return safeNum(data.survey_probability);
  }

  const wpmRisk       = Math.max(0, Math.min(1, 1 - wpm / 60));
  const accRisk       = Math.max(0, Math.min(1, 1 - accuracy / 100));
  const errorRisk     = Math.min(1, errors / 20);
  const pauseRisk     = Math.min(1, pause / 30);
  const readingRisk   = Math.max(0, Math.min(1, 1 - reading / 100));
  const cognitiveRisk = Math.max(0, Math.min(1, 1 - cognitive / 100));

  const combined =
    wpmRisk       * 0.15 +
    accRisk       * 0.20 +
    errorRisk     * 0.15 +
    pauseRisk     * 0.10 +
    readingRisk   * 0.20 +
    cognitiveRisk * 0.20;

  return Math.min(1, Math.max(0, combined));
}

function getExplanations(data, probability) {
  const explanations = [];

  const errors    = safeNum(data.errors, 0);
  const pause     = safeNum(data.pauseSeconds, 0);
  const wpm       = safeNum(data.wpm, 0);
  const reading   = data.reading_score   != null ? safeNum(data.reading_score)   : null;
  const cognitive = data.cognitive_score != null ? safeNum(data.cognitive_score) : null;
  const surveyYes = data.survey_yes_count != null ? safeNum(data.survey_yes_count) : null;

  // ML model explanation (always shown)
  explanations.push({
    icon: "🤖",
    title: probability >= 0.7
      ? "AI Model: High Risk Detected"
      : probability >= 0.4
      ? "AI Model: Moderate Risk"
      : "AI Model: Low Risk",
    body: `The machine learning model predicts a ${(probability * 100).toFixed(1)}% probability of learning difficulty based on combined behavioral patterns.`,
    severity: probability >= 0.7 ? "high" : probability >= 0.4 ? "medium" : "low",
  });

  // Typing
  if (wpm > 0 && wpm < 20) {
    explanations.push({
      icon: "⌨️",
      title: "Low Typing Speed",
      body: `${Math.round(wpm)} WPM is below the expected benchmark. This may reflect slower processing speed or letter-sound difficulties.`,
      severity: "medium",
    });
  }

  if (errors > 10) {
    explanations.push({
      icon: "✏️",
      title: "High Error Rate Detected",
      body: `${errors} typing errors recorded. High error rates are associated with phonological encoding difficulties and dyslexia markers.`,
      severity: errors > 20 ? "high" : "medium",
    });
  }

  if (pause > 15) {
    explanations.push({
      icon: "⏸️",
      title: "High Pause Time Detected",
      body: `${pause}s of pause time during typing. Extended pauses indicate cognitive hesitation and working-memory load.`,
      severity: pause > 25 ? "high" : "medium",
    });
  }

  // Reading
  if (reading !== null && reading < 50) {
    explanations.push({
      icon: "📖",
      title: "Low Reading Comprehension",
      body: `${reading}% comprehension score. Difficulty understanding passages may indicate decoding fluency or vocabulary limitations.`,
      severity: reading < 34 ? "high" : "medium",
    });
  }

  // Cognitive
  if (cognitive !== null && cognitive < 50) {
    explanations.push({
      icon: "🧠",
      title: "Low Cognitive Test Score",
      body: `${cognitive}% across rhyming, memory, pattern and spelling tasks. Difficulty across multiple domains is a strong indicator of learning difficulties.`,
      severity: cognitive < 34 ? "high" : "medium",
    });
  }

  // Survey
  if (surveyYes !== null && surveyYes >= 6) {
    explanations.push({
      icon: "📋",
      title: "High Behavioural Risk Indicators",
      body: `${surveyYes}/10 behavioural indicators flagged by the survey. This strongly supports further professional evaluation.`,
      severity: surveyYes >= 8 ? "high" : "medium",
    });
  }

  return explanations;
}

const SEVERITY_STYLES = {
  high:   { border: "border-rose-200/70",    bg: "bg-rose-50/50",    badge: "bg-rose-100 text-rose-700 border-rose-200",         dot: "bg-rose-500"    },
  medium: { border: "border-amber-200/70",   bg: "bg-amber-50/50",   badge: "bg-amber-100 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
  low:    { border: "border-emerald-200/70", bg: "bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

const DECISION_CONFIG = {
  high: {
    icon: "🔴",
    title: "High Risk — Professional Consultation Recommended",
    body: "The ML model detected strong indicators of learning difficulty. A formal evaluation by an educational psychologist is strongly recommended.",
    border: "border-rose-300/70",
    bg: "bg-rose-50/60",
    titleColor: "text-rose-700",
    tags: ["🩺 Seek professional evaluation", "📚 Specialist literacy support", "🧩 Multisensory learning plan"],
  },
  medium: {
    icon: "🟡",
    title: "Moderate Risk — Monitor and Consider Evaluation",
    body: "The ML model indicates moderate risk. Continued monitoring and targeted support are advised. Consider a formal screening if difficulties persist.",
    border: "border-amber-300/70",
    bg: "bg-amber-50/60",
    titleColor: "text-amber-700",
    tags: ["👁 Monitor over next 3 months", "📋 Consider formal screening", "🎮 Targeted learning support"],
  },
  low: {
    icon: "🟢",
    title: "Low Risk — No Immediate Concern",
    body: "The ML model indicates low probability of learning difficulty. Continue regular assessment as part of standard educational practice.",
    border: "border-emerald-300/70",
    bg: "bg-emerald-50/60",
    titleColor: "text-emerald-700",
    tags: ["✅ Continue regular assessment", "📈 Track progress each term"],
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AnalysisReportPage({ data = {}, ageGroup, setPage }) {
  const [probability, setProbability] = useState(null);   // null = loading
  const [mlSource, setMlSource]       = useState("loading"); // "api" | "local"

  // ── Fetch prediction from Flask on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchPrediction() {
      try {
        const res = await fetch("/predict", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(data),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        if (!cancelled) {
          setProbability(safeNum(result.probability, 0));
          setMlSource("api");
        }
      } catch {
        // Flask not running — use local fallback
        if (!cancelled) {
          setProbability(computeLocalProbability(data));
          setMlSource("local");
        }
      }
    }

    fetchPrediction();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── While fetching ────────────────────────────────────────────────────
  if (probability === null) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Analysing results…</p>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────
  const riskPct      = Math.round(probability * 100);
  const riskLevel    = probability >= 0.7 ? "high" : probability >= 0.4 ? "medium" : "low";
  const explanations = getExplanations(data, probability);
  const decision     = DECISION_CONFIG[riskLevel];

  const ringColor =
    riskLevel === "high"   ? "#f87171" :
    riskLevel === "medium" ? "#fbbf24" : "#34d399";

  // Which modules have data
  const hasTyping    = data.wpm           != null;
  const hasReading   = data.reading_score  != null;
  const hasCognitive = data.cognitive_score != null;
  const hasSurvey    = data.survey_yes_count != null || data.survey_probability != null;

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Analysis Report · Age {ageGroup}
            {mlSource === "local" && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200 text-[10px]">
                Local estimate (Flask offline)
              </span>
            )}
            {mlSource === "api" && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 text-[10px]">
                ✓ ML model connected
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
            AI Assessment Report
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed max-w-2xl">
            Based on combined analysis of all completed assessments.
          </p>
        </div>
        <RiskBadge risk={riskLevel} />
      </div>

      {/* ── Risk Score Card ── */}
      <div className="relative rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-400/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center gap-8">
          {/* SVG ring */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={ringColor}
                strokeWidth="10"
                strokeDasharray={`${(riskPct / 100) * 314.16} 314.16`}
                strokeDashoffset="78.54"
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: ringColor }}>{riskPct}</span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">/100</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">
              ML Probability Score
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {(probability * 100).toFixed(1)}%
            </div>
            <div className="text-sm font-bold text-slate-600 mb-4">
              Probability of learning difficulty
            </div>

            {/* Module completion pills */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hasTyping ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                {hasTyping ? "✓" : "○"} Typing
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hasReading ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                {hasReading ? "✓" : "○"} Reading
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hasCognitive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                {hasCognitive ? "✓" : "○"} Cognitive
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hasSurvey ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                {hasSurvey ? "✓" : "○"} Survey
              </span>
            </div>
          </div>

          {/* Score breakdown sidebar */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            {[
              { label: "WPM",       value: hasTyping    ? `${Math.round(safeNum(data.wpm))}` : "—",              color: safeNum(data.wpm) < 20 ? "text-rose-600" : "text-emerald-600" },
              { label: "Accuracy",  value: hasTyping    ? `${Math.round(safeNum(data.accuracy))}%` : "—",         color: safeNum(data.accuracy) < 70 ? "text-rose-600" : "text-emerald-600" },
              { label: "Reading",   value: hasReading   ? `${safeNum(data.reading_score)}%` : "—",               color: safeNum(data.reading_score) < 50 ? "text-rose-600" : "text-emerald-600" },
              { label: "Cognitive", value: hasCognitive ? `${safeNum(data.cognitive_score)}%` : "—",             color: safeNum(data.cognitive_score) < 50 ? "text-rose-600" : "text-emerald-600" },
              { label: "Survey",    value: hasSurvey    ? `${safeNum(data.survey_yes_count)}/10 yes` : "—",       color: safeNum(data.survey_yes_count) >= 6 ? "text-rose-600" : "text-emerald-600" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center rounded-xl border border-white/70 bg-white/40 px-3 py-2">
                <span className="text-xs font-extrabold text-slate-500">{item.label}</span>
                <span className={`text-xs font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Explanations ── */}
      <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
          Detailed Analysis
        </div>
        <div className="space-y-3">
          {explanations.map((exp, i) => {
            const s = SEVERITY_STYLES[exp.severity];
            return (
              <div key={i} className={`rounded-2xl border p-4 ${s.border} ${s.bg}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 flex-shrink-0">{exp.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-extrabold text-slate-800 text-sm">{exp.title}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${s.badge}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${s.dot}`} />
                        {exp.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">{exp.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Final Decision ── */}
      <div className={`rounded-3xl border p-6 ${decision.border} ${decision.bg}`}>
        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
          Final Decision
        </div>
        <div className="flex items-start gap-4">
          <span className="text-4xl flex-shrink-0">{decision.icon}</span>
          <div>
            <div className={`font-black text-xl mb-2 ${decision.titleColor}`}>{decision.title}</div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">{decision.body}</p>
            <div className="flex flex-wrap gap-2">
              {decision.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${SEVERITY_STYLES[riskLevel === "high" ? "high" : riskLevel === "medium" ? "medium" : "low"].badge}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-2xl border border-white/60 bg-white/30 backdrop-blur-xl p-4">
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> This report is for screening purposes only and does not constitute a clinical diagnosis. All results should be interpreted by a qualified educational professional or psychologist.
        </p>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setPage("typing")}>Retake Test</Button>
        <Button variant="primary"   onClick={() => setPage("dashboard")}>Dashboard</Button>
      </div>
    </div>
  );
}
