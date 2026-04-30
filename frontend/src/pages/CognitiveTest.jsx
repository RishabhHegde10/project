import { useState, useEffect, useRef } from "react";
import Button from "../components/ui/Button";
import RiskBadge from "../components/ui/RiskBadge";

const QUESTIONS_BY_AGE = {
  "7-9": [
    {
      id: 1,
      type: "Rhyming",
      question: "Which word rhymes with 'cat'?",
      options: ["Dog", "Hat", "Cup", "Sun"],
      correct: 1,
    },
    {
      id: 2,
      type: "Memory",
      question: "Remember this order: 🍎 🐶 🌟 — Which came first?",
      options: ["🐶", "🌟", "🍎", "🌈"],
      correct: 2,
    },
    {
      id: 3,
      type: "Pattern",
      question: "What comes next? 2 → 4 → 6 → ?",
      options: ["7", "8", "9", "10"],
      correct: 1,
    },
    {
      id: 4,
      type: "Spelling",
      question: "Which spelling is correct?",
      options: ["Skool", "Scool", "School", "Schol"],
      correct: 2,
    },
    {
      id: 5,
      type: "Rhyming",
      question: "Which word rhymes with 'ball'?",
      options: ["Bell", "Tall", "Bill", "Bull"],
      correct: 1,
    },
    {
      id: 6,
      type: "Pattern",
      question: "What comes next? 🔴 🔵 🔴 🔵 ?",
      options: ["🟡", "🔴", "🟢", "🔵"],
      correct: 1,
    },
  ],

  "10-11": [
    {
      id: 1,
      type: "Rhyming",
      question: "Which word rhymes with 'motion'?",
      options: ["Mention", "Ocean", "Station", "Fiction"],
      correct: 1,
    },
    {
      id: 2,
      type: "Memory",
      question: "Remember: Blue, Circle, Seven, Apple. Which was the number?",
      options: ["Three", "Five", "Seven", "Nine"],
      correct: 2,
    },
    {
      id: 3,
      type: "Pattern",
      question: "What comes next? 3 → 6 → 12 → 24 → ?",
      options: ["36", "42", "48", "30"],
      correct: 2,
    },
    {
      id: 4,
      type: "Spelling",
      question: "Which word is spelled correctly?",
      options: ["Recieve", "Receive", "Receve", "Receeve"],
      correct: 1,
    },
    {
      id: 5,
      type: "Memory",
      question: "Remember this sequence: 5, 9, 2, 7. What was the third number?",
      options: ["5", "9", "2", "7"],
      correct: 2,
    },
    {
      id: 6,
      type: "Pattern",
      question: "Which shape completes the pattern: △ □ △ □ △ ?",
      options: ["△", "○", "□", "◇"],
      correct: 2,
    },
  ],

  "12-13": [
    {
      id: 1,
      type: "Rhyming",
      question: "Which pair of words rhymes correctly?",
      options: ["Choir / Wire", "Gauge / Page", "Psalm / Calm", "Sword / Word"],
      correct: 2,
    },
    {
      id: 2,
      type: "Memory",
      question: "Remember: Falcon, 47, Crimson, Delta, 19. What was the second number?",
      options: ["47", "19", "Delta", "Crimson"],
      correct: 1,
    },
    {
      id: 3,
      type: "Pattern",
      question: "What comes next? 1 → 1 → 2 → 3 → 5 → 8 → ?",
      options: ["11", "12", "13", "14"],
      correct: 2,
    },
    {
      id: 4,
      type: "Spelling",
      question: "Which word is spelled correctly?",
      options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"],
      correct: 1,
    },
    {
      id: 5,
      type: "Memory",
      question: "Remember: Jupiter, Red, 83, Triangle, Flute. What was the shape?",
      options: ["Circle", "Square", "Triangle", "Pentagon"],
      correct: 2,
    },
    {
      id: 6,
      type: "Pattern",
      question: "If A=1, B=2, C=3... what is the value of G + D?",
      options: ["9", "10", "11", "8"],
      correct: 1,
    },
  ],
};

const TYPE_META = {
  Rhyming: { icon: "🎵", color: "text-violet-700",  bg: "bg-violet-50/60",  border: "border-violet-200/70"  },
  Memory:  { icon: "🧩", color: "text-sky-700",     bg: "bg-sky-50/60",     border: "border-sky-200/70"     },
  Pattern: { icon: "🔢", color: "text-emerald-700", bg: "bg-emerald-50/60", border: "border-emerald-200/70" },
  Spelling:{ icon: "✏️", color: "text-fuchsia-700", bg: "bg-fuchsia-50/60", border: "border-fuchsia-200/70" },
};

export default function CognitiveTest({ ageGroup = "10-11", onComplete, setPage }) {
  const questions = QUESTIONS_BY_AGE[ageGroup] ?? QUESTIONS_BY_AGE["10-11"];

  const [phase, setPhase]         = useState("intro");
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState({});
  const [timeTaken, setTimeTaken] = useState(0);

  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "test") {
      startRef.current = performance.now();
      timerRef.current = setInterval(() => {
        setTimeTaken(Math.floor((performance.now() - startRef.current) / 1000));
      }, 500);
    }
    if (phase === "results") clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function handleAnswer(idx) {
    setAnswers((prev) => ({ ...prev, [questions[current].id]: idx }));
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      finish();
    }
  }

  function finish() {
    clearInterval(timerRef.current);
    const finalTime      = Math.floor((performance.now() - startRef.current) / 1000);
    setTimeTaken(finalTime);
    const correct        = questions.filter((q) => answers[q.id] === q.correct).length;
    const cognitiveScore = Math.round((correct / questions.length) * 100);
    onComplete?.({ cognitive_score: cognitiveScore });
    setPhase("results");
  }

  function handleRetry() {
    setCurrent(0);
    setAnswers({});
    setTimeTaken(0);
    setPhase("intro");
  }

  const currentQ        = questions[current];
  const currentAnswered = answers[currentQ?.id] !== undefined;
  const progressPct     = ((current + (currentAnswered ? 1 : 0)) / questions.length) * 100;
  const correctCount    = questions.filter((q) => answers[q.id] === q.correct).length;
  const score           = Math.round((correctCount / questions.length) * 100);
  const riskLevel       = score >= 67 ? "low" : score >= 34 ? "medium" : "high";

  const typeBreakdown = Object.keys(TYPE_META).map((type) => {
    const qs      = questions.filter((q) => q.type === type);
    const correct = qs.filter((q) => answers[q.id] === q.correct).length;
    return { type, correct, total: qs.length, meta: TYPE_META[type] };
  }).filter((t) => t.total > 0);

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Cognitive Tests · Age {ageGroup}
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
            {phase === "intro"   && "Cognitive Assessment Battery"}
            {phase === "test"    && `${currentQ.type} Test — Question ${current + 1} of ${questions.length}`}
            {phase === "results" && "Cognitive Assessment Results"}
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed max-w-2xl">
            {phase === "intro"   && `${questions.length} questions across Rhyming, Memory, Pattern and Spelling — adapted for age ${ageGroup}.`}
            {phase === "test"    && "Select the best answer and proceed to the next question."}
            {phase === "results" && "Review your performance across all cognitive domains below."}
          </p>
        </div>

        {phase === "test" && (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft px-4 py-3">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Time</div>
              <div className="mt-1 font-black text-2xl text-slate-900">{timeTaken}s</div>
            </div>
          </div>
        )}

        {phase === "results" && (
          <div className="flex items-center gap-3">
            <RiskBadge risk={riskLevel} />
            <Button variant="secondary" onClick={handleRetry}>Retry</Button>
            {/* Fixed: navigate to survey */}
            <Button variant="primary" onClick={() => setPage?.("survey")}>
              Next: Survey →
            </Button>
          </div>
        )}
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {Object.entries(TYPE_META).map(([type, meta]) => (
              <div key={type} className={`rounded-2xl border p-4 text-center ${meta.bg} ${meta.border}`}>
                <div className="text-3xl mb-2">{meta.icon}</div>
                <div className={`font-extrabold text-sm ${meta.color}`}>{type}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  {type === "Rhyming"  && "Language ability"}
                  {type === "Memory"   && "Sequence recall"}
                  {type === "Pattern"  && "Logic reasoning"}
                  {type === "Spelling" && "Language processing"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-sm font-bold text-slate-600 max-w-md">
              {questions.length} questions · Timed · One at a time · Age{" "}
              <span className="text-violet-700">{ageGroup}</span>
            </div>
            <Button variant="primary" onClick={() => setPhase("test")}>Begin Assessment</Button>
          </div>
        </div>
      )}

      {/* ── TEST ── */}
      {phase === "test" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Progress</div>
              <div className="text-xs font-extrabold text-slate-600">{current + 1}/{questions.length}</div>
            </div>
            <div className="h-3 rounded-full bg-white/40 border border-white/70 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {questions.map((q, i) => {
                const meta      = TYPE_META[q.type];
                const done      = answers[q.id] !== undefined;
                const isCurrent = i === current;
                return (
                  <div
                    key={q.id}
                    className={[
                      "px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all",
                      isCurrent
                        ? `${meta.bg} ${meta.border} ${meta.color}`
                        : done
                        ? "bg-white/30 border-white/50 text-slate-400"
                        : "bg-white/20 border-white/30 text-slate-300",
                    ].join(" ")}
                  >
                    {meta.icon} {q.type}
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`relative rounded-3xl border backdrop-blur-xl shadow-soft p-6 overflow-hidden ${TYPE_META[currentQ.type].bg} ${TYPE_META[currentQ.type].border}`}>
            <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/20 blur-2xl pointer-events-none" />
            <div className="relative">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold mb-4 bg-white/50 border ${TYPE_META[currentQ.type].border} ${TYPE_META[currentQ.type].color}`}>
                <span>{TYPE_META[currentQ.type].icon}</span>
                {currentQ.type} Test
              </div>
              <div className="font-black text-slate-900 text-lg mb-5 leading-relaxed">{currentQ.question}</div>
              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt, idx) => {
                  const selected = answers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={[
                        "text-left px-4 py-3 rounded-2xl border font-bold text-sm transition-all duration-200",
                        selected
                          ? "border-violet-400/70 bg-violet-50/80 text-violet-800 shadow-soft"
                          : "border-white/70 bg-white/50 text-slate-700 hover:bg-white/70 hover:border-white/90",
                      ].join(" ")}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-between items-center">
                <div className="text-xs font-bold text-slate-500">
                  {currentAnswered ? "Answer selected ✓" : "Select an answer to continue"}
                </div>
                <Button variant="primary" onClick={handleNext} disabled={!currentAnswered}>
                  {current < questions.length - 1 ? "Next →" : "Submit Test"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {typeBreakdown.map(({ type, correct, total, meta }) => {
                const pct = Math.round((correct / total) * 100);
                return (
                  <div key={type} className={`rounded-3xl border p-5 ${meta.bg} ${meta.border}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{meta.icon}</span>
                      <span className={`font-extrabold text-sm ${meta.color}`}>{type}</span>
                    </div>
                    <div className={`text-3xl font-black ${meta.color}`}>{pct}%</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">{correct}/{total} correct</div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Question review</div>
              <div className="space-y-3">
                {questions.map((q, qi) => {
                  const userAns   = answers[q.id];
                  const isCorrect = userAns === q.correct;
                  const meta      = TYPE_META[q.type];
                  return (
                    <div
                      key={q.id}
                      className={[
                        "rounded-2xl border p-4",
                        isCorrect ? "border-emerald-200/70 bg-emerald-50/50" : "border-rose-200/70 bg-rose-50/50",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">{isCorrect ? "✅" : "❌"}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border} ${meta.color}`}>
                              {meta.icon} {q.type}
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-400">Q{qi + 1}</span>
                          </div>
                          <div className="font-extrabold text-slate-800 text-sm mb-1">{q.question}</div>
                          <div className="text-xs font-bold text-slate-500">
                            Your answer:{" "}
                            <span className={isCorrect ? "text-emerald-700" : "text-rose-600"}>
                              {q.options[userAns]}
                            </span>
                          </div>
                          {!isCorrect && (
                            <div className="text-xs font-bold text-emerald-700 mt-1">
                              Correct: {q.options[q.correct]}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            {[
              {
                label: "Overall Score",
                value: `${score}%`,
                sub: `${correctCount}/${questions.length} correct`,
                color: score >= 67 ? "text-emerald-700" : score >= 34 ? "text-amber-700" : "text-rose-700",
              },
              { label: "Time Taken", value: `${timeTaken}s`, sub: "total assessment time", color: "text-violet-700" },
              { label: "Avg per Q",  value: `${Math.round(timeTaken / questions.length)}s`, sub: "seconds per question", color: "text-sky-700" },
              {
                label: "Risk Level",
                value: riskLevel.toUpperCase(),
                sub: "based on cognitive score",
                color: riskLevel === "low" ? "text-emerald-700" : riskLevel === "medium" ? "text-amber-700" : "text-rose-700",
              },
            ].map((m) => (
              <div key={m.label} className="rounded-3xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft p-5">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{m.label}</div>
                <div className={`mt-2 text-3xl font-black ${m.color}`}>{m.value}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
