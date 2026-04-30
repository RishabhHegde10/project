import { useState } from "react";

const QUESTIONS = [
  { key: "A1_Score", text: "Does the child struggle with reading?" },
  { key: "A2_Score", text: "Does the child confuse letters (b/d, p/q)?" },
  { key: "A3_Score", text: "Does the child make spelling mistakes?" },
  { key: "A4_Score", text: "Does the child have writing difficulty?" },
  { key: "A5_Score", text: "Does the child forget instructions?" },
  { key: "A6_Score", text: "Does the child have poor attention?" },
  { key: "A7_Score", text: "Does the child read slowly?" },
  { key: "A8_Score", text: "Does the child skip words while reading?" },
  { key: "A9_Score", text: "Does the child struggle to understand text?" },
  { key: "A10_Score", text: "Does the child avoid reading or writing tasks?" },
];

export default function SurveyTest({ setPage, onComplete, assessment = {} }) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      // ✅ Ensure all answers exist
      const finalAnswers = {};
      QUESTIONS.forEach((q) => {
        finalAnswers[q.key] = answers[q.key] ?? 0;
      });

      // 🔥 Combine FULL DATA (THIS WAS YOUR BUG)
      const fullData = {
        ...assessment,   // typing + reading + cognitive
        ...finalAnswers  // survey
      };

      console.log("SENDING FULL DATA:", fullData);

      // 🔥 CALL ML API (CORRECT ENDPOINT)
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      console.log("ML RESULT:", data);

      // ✅ Save everything globally
      onComplete?.({
        ...finalAnswers,
        ml_probability: data.probability,
        ml_prediction: data.prediction,
      });

      // Go to report
      setPage("report");

    } catch (err) {
      console.error(err);
      alert("Backend connection failed. Check server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-bold">Behavioral Survey</h1>

      {QUESTIONS.map((q) => (
        <div key={q.key} className="p-4 bg-white rounded-lg shadow">
          <p className="font-medium">{q.text}</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleChange(q.key, 1)}
              className={`px-4 py-1 rounded ${
                answers[q.key] === 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Yes
            </button>

            <button
              onClick={() => handleChange(q.key, 0)}
              className={`px-4 py-1 rounded ${
                answers[q.key] === 0
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              No
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}