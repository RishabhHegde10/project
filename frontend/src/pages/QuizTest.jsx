import { useState, useEffect, useRef } from "react";
import Button from "../components/ui/Button";
import RiskBadge from "../components/ui/RiskBadge";

const QUIZ_BANK = {
  "7-9": [
    {
      id: 1,
      question: "What is 5 + 3?",
      options: ["6", "7", "8", "9"],
      correct: 2,
    },
    {
      id: 2,
      question: "Which animal says 'moo'?",
      options: ["Dog", "Cat", "Cow", "Duck"],
      correct: 2,
    },
    {
      id: 3,
      question: "How many days are in a week?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      id: 4,
      question: "What colour is the sky on a sunny day?",
      options: ["Green", "Red", "Blue", "Yellow"],
      correct: 2,
    },
    {
      id: 5,
      question: "Which of these is a fruit?",
      options: ["Carrot", "Potato", "Apple", "Onion"],
      correct: 2,
    },
  ],

  "10-11": [
    {
      id: 1,
      question: "What is 12 × 7?",
      options: ["74", "84", "94", "96"],
      correct: 1,
    },
    {
      id: 2,
      question: "Which planet is closest to the Sun?",
      options: ["Earth", "Venus", "Mercury", "Mars"],
      correct: 2,
    },
    {
      id: 3,
      question: "What is the capital city of France?",
      options: ["Berlin", "Madrid", "Rome", "Paris"],
      correct: 3,
    },
    {
      id: 4,
      question: "If a train travels 60 km in 1 hour, how far does it travel in 2.5 hours?",
      options: ["120 km", "130 km", "150 km", "180 km"],
      correct: 2,
    },
    {
      id: 5,
      question: "What is the process by which plants make their own food?",
      options: ["Respiration", "Digestion", "Photosynthesis", "Evaporation"],
      correct: 2,
    },
  ],

  "12-13": [
    {
      id: 1,
      question: "Which of the following is a common early sign of dyslexia?",
      options: [
        "Exceptional mathematical ability",
        "Difficulty recognising rhyming words",
        "Preference for writing over speaking",
        "Strong visual memory for faces",
      ],
      correct: 1,
    },
    {
      id: 2,
      question: "A child reverses letters like 'b' and 'd' frequently. This may indicate:",
      options: [
        "Advanced creative thinking",
        "Poor eyesight only",
        "A phonological processing difficulty",
        "Boredom in the classroom",
      ],
      correct: 2,
    },
    {
      id: 3,
      question: "Which strategy best supports a child with reading difficulties?",
      options: [
        "Asking them to read faster",
        "Reducing all reading tasks",
        "Using multisensory learning approaches",
        "Isolating them for individual study",
      ],
      correct: 2,
    },
    {
      id: 4,
      question: "In the context of DysLearnAI, what does a HIGH risk score suggest?",
      options: [
        "The child is gifted",
        "Strong indicators of learning difficulty detected",
        "The typing assessment was not completed",
        "The child needs no further support",
      ],
      correct: 1,
    },
    {
      id: 5,
      question: "What does WPM stand for in typing assessments?",
      options: ["Words Per Metric", "Words Per Minute", "Writing Performance Measure", "Writing Per Module"],
      correct: 1,
    },
  ],
};

export default function QuizTest({ ageGroup = "10-11", onQuizComplete, setPage }) {
  const questions = QUIZ_BANK[ageGroup] ?? QUIZ_BANK["10-11"];

  const [phase, setPhase]         = useState("intro"); // intro | quiz | results
  const [answers, setAnswers]     = useState({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [current, setCurrent]     = useState(0);

  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "quiz") {
      startRef.current = performance.now();
      timerRef.current = setInterval(() => {
        setTimeTaken(Math.floor((performance.now() - startRef.current) / 1000));
      }, 500);
    }
    if (phase === "results") clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function handleAnswer(idx) {
    const qid = questions[current].id;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    const finalTime = Math.floor((performance.now() - startRef.current) / 1000);
    setTimeTaken(finalTime);
    clearInterval(timerRef.current);

    const correct  = questions.filter((q) => answers[q.id] === q.correct).length;
    const accuracy = Math.round((correct / questions.length) * 100);

    onQuizComplete?.({ quiz_accuracy: accuracy, quiz_time: finalTime, correct, total: questions.length });
    setPhase("results");
  }

  function handleRetry() {
    setPhase("intro");
    setAnswers({});
    setTimeTaken(0);
    setCurrent(0);
  }

  const correctCount = questions.filter((q) => answers[q.id] === q.correct).length;
  const accuracy     = Math.round((correctCount / questions.length) * 100);
  const riskLevel    = accuracy >= 67 ? "low" : accuracy >= 34 ? "medium" : "high";

  const currentQ       = questions[current];
  const currentAnswered = answers[currentQ?.id] !== undefined;
  const progressPct    = ((current + (currentAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Quiz Module · Age {ageGroup}
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
            {phase === "intro"   && "Knowledge & Awareness Quiz"}
            {phase === "quiz"    && `Question ${current + 1} of ${questions.length}`}
            {phase === "results" && "Quiz Results"}
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed max-w-2xl">
            {phase === "intro"   && `${questions.length} multiple-choice questions adapted for age group ${ageGroup}.`}
            {phase === "quiz"    && "Select the best answer and proceed to the next question."}
            {phase === "results" && "Review your answers and accuracy score below."}
          </p>
        </div>

        {phase === "quiz" && (
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
            <Button variant="secondary" onClick={handleRetry}>Retry Quiz</Button>
            {setPage && (
              <Button variant="primary" onClick={() => setPage("report")}>
                View Report →
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-8 flex flex-col items-center gap-6 text-center">
          <div className="text-6xl">🧩</div>
          <div>
            <div className="font-black text-xl text-slate-900 mb-2">
              {ageGroup === "7-9"   && "Fun Knowledge Quiz"}
              {ageGroup === "10-11" && "Knowledge & Skills Quiz"}
              {ageGroup === "12-13" && "Learning Disability Awareness Quiz"}
            </div>
            <div className="text-sm font-bold text-slate-600 max-w-md">
              {questions.length} questions · Timed · Multiple choice · Adapted for age{" "}
              <span className="text-violet-700">{ageGroup}</span>.
            </div>
          </div>
          <Button variant="primary" onClick={() => setPhase("quiz")}>Start Quiz</Button>
        </div>
      )}

      {/* ── QUIZ (one question at a time) ── */}
      {phase === "quiz" && (
        <div className="space-y-4">
          {/* Progress bar */}
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
          </div>

          {/* Question card */}
          <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
              Question {current + 1}
            </div>
            <div className="font-black text-slate-900 text-lg mb-5">{currentQ.question}</div>
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
                        : "border-white/70 bg-white/40 text-slate-700 hover:bg-white/60 hover:border-white/80",
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
                {current < questions.length - 1 ? "Next →" : "Submit Quiz"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && (
        <div className="grid grid-cols-12 gap-4">
          {/* Answer review */}
          <div className="col-span-12 lg:col-span-8 rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Answer review</div>
            <div className="space-y-3">
              {questions.map((q, qi) => {
                const userAns   = answers[q.id];
                const isCorrect = userAns === q.correct;
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
                        <div className="font-extrabold text-slate-800 text-sm mb-1">Q{qi + 1}: {q.question}</div>
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

          {/* Metric sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {[
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                sub: `${correctCount}/${questions.length} correct`,
                color: accuracy >= 67 ? "text-emerald-700" : accuracy >= 34 ? "text-amber-700" : "text-rose-700",
              },
              { label: "Time taken",  value: `${timeTaken}s`, sub: "total quiz time",          color: "text-violet-700" },
              { label: "Avg per Q",   value: `${Math.round(timeTaken / questions.length)}s`, sub: "seconds per question", color: "text-sky-700" },
            ].map((m) => (
              <div key={m.label} className="rounded-3xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft p-5">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{m.label}</div>
                <div className={`mt-2 text-4xl font-black ${m.color}`}>{m.value}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
