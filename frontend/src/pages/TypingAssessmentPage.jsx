import { useMemo, useRef, useState } from "react";
import Button from "../components/ui/Button";
import MetricCard from "../components/typing/MetricCard";
import TypingTarget from "../components/typing/TypingTarget";
import RiskBadge from "../components/ui/RiskBadge";

const PAUSE_THRESHOLD_MS = 900;

const TARGETS = {
  "7-9":   "The cat sat on the mat. The dog ran to the park. The sun is big and bright.",
  "10-11": "Every child learns at their own pace. Reading and writing are important skills that help us grow.",
  "12-13": "Every child learns at their own pace. DysLearn AI analyzes typing behavior to detect early learning difficulties."
};

function getRiskFromMetrics({ accuracy }) {
  const risk = Math.round(100 * (1 - accuracy / 100));

  if (risk >= 70) return { risk, level: "high" };
  if (risk >= 40) return { risk, level: "medium" };
  return { risk, level: "low" };
}

export default function TypingAssessmentPage({
  ageGroup = "10-11",
  onTypingComplete,
  setPage
}) {
  const target = useMemo(() => TARGETS[ageGroup], [ageGroup]);

  const [phase, setPhase] = useState("ready");
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [pauseMs, setPauseMs] = useState(0);

  const lastTypeAtRef = useRef(null);
  const prevTypedLenRef = useRef(0);
  const startTimeRef = useRef(null); // ✅ NEW

  // Accuracy calculation
  const accuracy = useMemo(() => {
    let correct = 0;
    let err = 0;

    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) correct++;
      else err++;
    }

    setErrors(err);

    return typed.length ? (correct / typed.length) * 100 : 0;
  }, [typed, target]);

  const risk = useMemo(() => getRiskFromMetrics({ accuracy }), [accuracy]);

  function startAssessment() {
    setPhase("running");
    setTyped("");
    setErrors(0);
    setBackspaces(0);
    setPauseMs(0);

    lastTypeAtRef.current = null;
    prevTypedLenRef.current = 0;

    startTimeRef.current = Date.now(); // ✅ START TIMER
  }

  // Typing + pause detection
  function handleChange(value) {
    if (phase !== "running") return;

    const now = performance.now();

    if (lastTypeAtRef.current) {
      const gap = now - lastTypeAtRef.current;

      if (gap > PAUSE_THRESHOLD_MS && gap < 5000) {
        setPauseMs(p => p + gap);
      }
    }

    const prevLen = prevTypedLenRef.current;
    const nextLen = value.length;

    if (nextLen < prevLen) {
      setBackspaces(b => b + (prevLen - nextLen));
    }

    lastTypeAtRef.current = now;
    prevTypedLenRef.current = nextLen;

    setTyped(value);
  }

  // ✅ FINAL FIXED SUBMISSION
  function finishAssessment() {
    const endTime = Date.now();
    const timeMinutes = (endTime - startTimeRef.current) / 1000 / 60;

    const words = typed.trim().split(" ").length;

    const wpm = Math.round(words / Math.max(timeMinutes, 0.01));

    const finalPauseSeconds = Math.round(pauseMs / 1000);

    console.log("Typing Result:", {
      wpm,
      errors,
      pauseSeconds: finalPauseSeconds,
      accuracy
    });

    onTypingComplete?.({
      wpm,                     // ✅ ML feature
      errors,                  // ✅ ML feature
      pauseSeconds: finalPauseSeconds,
      accuracy
    });

    setPhase("finished");
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black">Typing Assessment</h2>
          <p className="text-sm text-slate-600">
            We focus on accuracy and behavior, not typing speed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge risk={risk.level} />

          {phase !== "running" ? (
            <Button onClick={startAssessment}>Start</Button>
          ) : (
            <Button variant="secondary" onClick={finishAssessment}>
              Finish
            </Button>
          )}
        </div>
      </div>

      {/* Typing area */}
      <div className="rounded-3xl border bg-white/40 p-5">
        <TypingTarget target={target} typed={typed} />

        <textarea
          value={typed}
          disabled={phase !== "running"}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full mt-4 p-4 border rounded-xl"
          placeholder="Start typing..."
        />

        <div className="mt-4 text-sm">
          {typed.length}/{target.length} characters
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Accuracy" value={accuracy.toFixed(1)} sub="%" />
        <MetricCard label="Errors" value={errors} sub="mismatches" />
        <MetricCard label="Backspaces" value={backspaces} sub="count" />
        <MetricCard label="Pause time" value={Math.round(pauseMs / 1000)} sub="seconds" />
      </div>

      {/* Next */}
      {phase === "finished" && (
        <div className="mt-4">
          <Button onClick={() => setPage("reading")}>
            Next → Reading Test
          </Button>
        </div>
      )}

    </div>
  );
}