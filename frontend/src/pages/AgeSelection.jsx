import { useState } from "react";
import Button from "../components/ui/Button";

export default function AgeSelection({ onContinue }) {
  const [ageGroup, setAgeGroup] = useState("");

  const options = [
    { label: "7 – 9 years", value: "7-9" },
    { label: "10 – 11 years", value: "10-11" },
    { label: "12 – 13 years", value: "12-13" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-sky-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-soft p-8 text-center">
        
        <h1 className="text-2xl font-black text-slate-900">
          Select Age Group
        </h1>

        <p className="mt-2 text-sm text-slate-600 font-bold">
          This helps personalize assessment difficulty
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAgeGroup(opt.value)}
              className={`px-4 py-3 rounded-2xl border font-bold transition-all ${
                ageGroup === opt.value
                  ? "bg-violet-100 border-violet-400 text-violet-800"
                  : "bg-white/40 border-white/70 text-slate-700 hover:bg-white/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={!ageGroup}
            onClick={() => onContinue(ageGroup)}
          >
            Continue →
          </Button>
        </div>
      </div>
    </div>
  );
}