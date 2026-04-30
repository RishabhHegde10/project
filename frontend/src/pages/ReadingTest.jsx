import { useState, useEffect, useRef } from "react";
import Button from "../components/ui/Button";
import RiskBadge from "../components/ui/RiskBadge";

const PASSAGES = {
  "7-9": {
    title: "The Happy Dog",
    text: "The sun is big and bright. A little dog runs in the green park. He sees a red ball and jumps to catch it. The dog wags his tail. He is very happy. A girl comes to play with him. They run together all day long.",
    questions: [
      {
        id: 1,
        question: "How does the dog feel?",
        options: ["Sad", "Happy", "Angry", "Scared"],
        correct: 1,
      },
      {
        id: 2,
        question: "What does the dog see in the park?",
        options: ["A cat", "A tree", "A red ball", "A pond"],
        correct: 2,
      },
      {
        id: 3,
        question: "Who comes to play with the dog?",
        options: ["A boy", "A girl", "A teacher", "A puppy"],
        correct: 1,
      },
    ],
  },

  "10-11": {
    title: "The Market Trip",
    text: "On Saturday morning, Riya and her mother went to the local market to buy fresh vegetables and fruits. The market was very busy with many colourful stalls. Riya helped carry the bags and counted the change when they paid. On the way home, her mother explained how eating fresh food helps the body stay strong and healthy.",
    questions: [
      {
        id: 1,
        question: "When did Riya go to the market?",
        options: ["Friday evening", "Saturday morning", "Sunday afternoon", "Monday morning"],
        correct: 1,
      },
      {
        id: 2,
        question: "What did Riya do at the market?",
        options: [
          "She played games",
          "She helped carry bags and counted change",
          "She bought toys",
          "She read a book",
        ],
        correct: 1,
      },
      {
        id: 3,
        question: "What did Riya's mother explain on the way home?",
        options: [
          "How to cook rice",
          "How fresh food keeps the body healthy",
          "How to count money",
          "How to reach the market",
        ],
        correct: 1,
      },
    ],
  },

  "12-13": {
    title: "Artificial Intelligence in Education",
    text: "Artificial intelligence is rapidly transforming the field of education by enabling personalised learning experiences tailored to each student's unique pace and ability. Unlike traditional classrooms where all students follow the same curriculum, AI-powered systems can identify areas where a student struggles and adapt lessons accordingly. Early detection tools, such as DysLearnAI, analyse behavioural patterns in typing and reading to flag potential learning difficulties before they significantly impact academic performance. Critics, however, argue that over-reliance on technology may reduce meaningful human interaction in learning environments.",
    questions: [
      {
        id: 1,
        question: "How does AI differ from traditional classroom teaching?",
        options: [
          "AI uses printed textbooks",
          "AI gives the same lesson to all students",
          "AI adapts lessons to individual student needs",
          "AI replaces teachers completely",
        ],
        correct: 2,
      },
      {
        id: 2,
        question: "What does DysLearnAI analyse to detect learning difficulties?",
        options: [
          "Sleep patterns and diet",
          "Behavioural patterns in typing and reading",
          "Student attendance records",
          "Exam scores only",
        ],
        correct: 1,
      },
      {
        id: 3,
        question: "What concern do critics raise about AI in education?",
        options: [
          "AI is too expensive to build",
          "AI cannot detect learning patterns",
          "Over-reliance on AI may reduce human interaction",
          "AI makes students work too hard",
        ],
        correct: 2,
      },
    ],
  },
};

export default function ReadingTest({ ageGroup = "10-11", onReadingComplete, setPage }) {
  const passage = PASSAGES[ageGroup] ?? PASSAGES["10-11"];

  const [phase, setPhase]             = useState("intro");
  const [readingTime, setReadingTime] = useState(0);
  const [answers, setAnswers]         = useState({});
  const [timeTaken, setTimeTaken]     = useState(0);

  const startRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "reading") {
      startRef.current = performance.now();
      timerRef.current = setInterval(() => {
        setReadingTime(Math.floor((performance.now() - startRef.current) / 1000));
      }, 500);
    }

    if (phase === "questions") {
      const rt = Math.floor((performance.now() - startRef.current) / 1000);
      setReadingTime(rt);
      clearInterval(timerRef.current);
      startRef.current = performance.now();
      timerRef.current = setInterval(() => {
        setTimeTaken(Math.floor((performance.now() - startRef.current) / 1000));
      }, 500);
    }

    if (phase === "results") clearInterval(timerRef.current);

    return () => clearInterval(timerRef.current);
  }, [phase]);

  function handleAnswer(qid, idx) {
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  }

  function handleSubmit() {
    const finalTime    = Math.floor((performance.now() - startRef.current) / 1000);
    setTimeTaken(finalTime);
    clearInterval(timerRef.current);

    const correct = passage.questions.filter((q) => answers[q.id] === q.correct).length;
    const score   = Math.round((correct / passage.questions.length) * 100);

    onReadingComplete?.({ reading_time: readingTime, reading_score: score });
    setPhase("results");
  }

  function handleRetry() {
    setPhase("intro");
    setAnswers({});
    setReadingTime(0);
    setTimeTaken(0);
  }

  const allAnswered  = passage.questions.every((q) => answers[q.id] !== undefined);
  const correctCount = passage.questions.filter((q) => answers[q.id] === q.correct).length;
  const score        = phase === "results" ? Math.round((correctCount / passage.questions.length) * 100) : 0;
  const riskLevel    = score >= 67 ? "low" : score >= 34 ? "medium" : "high";

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Reading Assessment · Age {ageGroup}
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
            {phase === "intro"     && "Reading & Comprehension Test"}
            {phase === "reading"   && "Read carefully at your own pace"}
            {phase === "questions" && "Answer comprehension questions"}
            {phase === "results"   && "Reading results"}
          </h2>
          <p className="mt-2 text-sm font-bold text-slate-600 leading-relaxed max-w-2xl">
            {phase === "intro"     && "Read the passage, then answer comprehension questions. Your reading time and accuracy are recorded."}
            {phase === "reading"   && "Take your time. Click \"Done Reading\" when finished."}
            {phase === "questions" && "Select the best answer for each question, then submit."}
            {phase === "results"   && "Review your reading speed and comprehension score below."}
          </p>
        </div>

        {phase === "reading" && (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft px-4 py-3">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Reading time</div>
              <div className="mt-1 font-black text-2xl text-slate-900">{readingTime}s</div>
            </div>
            <Button variant="primary" onClick={() => setPhase("questions")}>Done Reading →</Button>
          </div>
        )}

        {phase === "questions" && (
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/40 backdrop-blur-xl shadow-soft px-4 py-3">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Q time</div>
              <div className="mt-1 font-black text-2xl text-slate-900">{timeTaken}s</div>
            </div>
            <Button variant="primary" onClick={handleSubmit} disabled={!allAnswered}>
              Submit Answers
            </Button>
          </div>
        )}

        {phase === "results" && (
          <div className="flex items-center gap-3">
            <RiskBadge risk={riskLevel} />
            <Button variant="secondary" onClick={handleRetry}>Retry</Button>
            {/* Fixed: navigate to cognitive, not dashboard */}
            <Button variant="primary" onClick={() => setPage?.("cognitive")}>
              Next: Cognitive Tests →
            </Button>
          </div>
        )}
      </div>

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-8 flex flex-col items-center gap-6 text-center">
          <div className="text-6xl">📖</div>
          <div>
            <div className="font-black text-xl text-slate-900 mb-2">"{passage.title}"</div>
            <div className="text-sm font-bold text-slate-600 max-w-md">
              A passage for age group <span className="text-violet-700">{ageGroup}</span> followed by{" "}
              {passage.questions.length} comprehension questions.
            </div>
          </div>
          <Button variant="primary" onClick={() => setPhase("reading")}>Start Reading</Button>
        </div>
      )}

      {/* ── READING ── */}
      {phase === "reading" && (
        <div className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3">
            Passage — {passage.title}
          </div>
          <p className="text-slate-800 text-base font-semibold leading-8">{passage.text}</p>
        </div>
      )}

      {/* ── QUESTIONS ── */}
      {phase === "questions" && (
        <div className="space-y-4">
          {passage.questions.map((q, qi) => (
            <div key={q.id} className="rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-5">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-2">
                Question {qi + 1} of {passage.questions.length}
              </div>
              <div className="font-black text-slate-900 text-base mb-4">{q.question}</div>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, idx) => {
                  const selected = answers[q.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(q.id, idx)}
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
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSubmit} disabled={!allAnswered}>
              Submit Answers
            </Button>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 rounded-3xl border border-white/70 bg-white/45 backdrop-blur-xl shadow-soft p-6">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">Answer review</div>
            <div className="space-y-3">
              {passage.questions.map((q, qi) => {
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

          <div className="col-span-12 lg:col-span-4 space-y-4">
            {[
              { label: "Reading time", value: `${readingTime}s`, sub: "seconds to read",      color: "text-violet-700" },
              { label: "Q&A time",     value: `${timeTaken}s`,   sub: "seconds on questions", color: "text-sky-700" },
              {
                label: "Score", value: `${score}%`,
                sub: `${correctCount}/${passage.questions.length} correct`,
                color: score >= 67 ? "text-emerald-700" : score >= 34 ? "text-amber-700" : "text-rose-700",
              },
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
