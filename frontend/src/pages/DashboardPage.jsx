import { useState, useEffect } from "react";

// ── Data ─────────────────────────────────────────────────────────────────────

const QUOTES = [
  { text: "Every child learns differently — and that's their superpower.", author: "DysLearnAI" },
  { text: "Dyslexia is not a limitation. It's a different way of thinking.", author: "Sally Shaywitz, Neuroscientist" },
  { text: "The children who need love the most will ask for it in the most unloving ways.", author: "Russell Barkley" },
  { text: "intelligence is not fixed — it grows with the right support.", author: "Carol Dweck" },
  { text: "Reading is not a race. It's a journey worth taking at your own pace.", author: "DysLearnAI" },
  { text: "Many brilliant people have dyslexia — Einstein, da Vinci, Steven Spielberg.", author: "DysLearnAI" },
];

const RECOMMENDATIONS = [
  { icon: "📖", title: "Read Aloud Daily", desc: "Even 10 minutes of reading aloud builds fluency and confidence. Choose books the child enjoys." },
  { icon: "🔤", title: "Use Phonics Tools", desc: "Apps like Nessy or Reading Eggs use phonics-based methods proven to help children with dyslexia." },
  { icon: "✂️", title: "Break Tasks Into Steps", desc: "Divide writing and reading tasks into small, manageable chunks to reduce overwhelm." },
  { icon: "🎧", title: "Try Audiobooks", desc: "Audiobooks let children access stories and learning without the barrier of decoding text." },
  { icon: "🌈", title: "Use Coloured Overlays", desc: "Tinted overlays or background colours on screens can reduce visual stress for some children." },
];

const DYSLEXIA_SIGNS = [
  { icon: "🔄", text: "Reversing or mixing up letters like 'b' and 'd', 'p' and 'q'" },
  { icon: "⏱️", text: "Reading more slowly than peers, losing place on the page" },
  { icon: "📝", text: "Difficulty with spelling, especially inconsistent spelling of the same word" },
  { icon: "💭", text: "Trouble following multi-step spoken instructions" },
];

const DYSLEXIA_STRENGTHS = [
  { icon: "🎨", label: "Creativity",        desc: "Strong imagination and artistic thinking" },
  { icon: "🔭", label: "Big-picture thinking", desc: "Sees connections others often miss" },
  { icon: "🗣️", label: "Verbal ability",    desc: "Often excellent communicators and storytellers" },
  { icon: "🧩", label: "Problem solving",   desc: "Approaches challenges in innovative ways" },
];

const FAMOUS_PEOPLE = [
  { name: "Albert Einstein",     field: "Physicist",      emoji: "🔬" },
  { name: "Leonardo da Vinci",   field: "Artist & Inventor", emoji: "🎨" },
  { name: "Steven Spielberg",    field: "Film Director",  emoji: "🎬" },
  { name: "Agatha Christie",     field: "Author",         emoji: "📚" },
  { name: "Richard Branson",     field: "Entrepreneur",   emoji: "🚀" },
  { name: "Whoopi Goldberg",     field: "Actress",        emoji: "⭐" },
];

// ── Small reusable components ─────────────────────────────────────────────────

function SectionHeading({ emoji, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-lg font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="text-sm font-semibold text-slate-500 ml-7">{subtitle}</p>}
    </div>
  );
}

function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-3xl border border-white/70 bg-white/50 backdrop-blur-xl shadow-soft transition-all duration-300 hover:bg-white/65 hover:-translate-y-0.5 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ── Section 1: Risk Overview ─────────────────────────────────────────────────

function RiskOverviewCard({ riskLevel = "medium" }) {
  const config = {
    low: {
      color:   "text-emerald-600",
      bg:      "bg-emerald-50/80",
      border:  "border-emerald-200/70",
      ring:    "#34d399",
      badge:   "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon:    "🟢",
      label:   "Low Risk",
      message: "Your child is performing well across assessments. No significant indicators of learning difficulty detected at this time.",
      detail:  "Continue regular practice and check in with us next month.",
    },
    medium: {
      color:   "text-amber-600",
      bg:      "bg-amber-50/80",
      border:  "border-amber-200/70",
      ring:    "#fbbf24",
      badge:   "bg-amber-100 text-amber-700 border-amber-200",
      icon:    "🟡",
      label:   "Moderate Risk",
      message: "Your child shows some signs worth monitoring — mild difficulty in reading speed but good cognitive performance overall.",
      detail:  "With the right support strategies, most children show significant improvement.",
    },
    high: {
      color:   "text-rose-600",
      bg:      "bg-rose-50/80",
      border:  "border-rose-200/70",
      ring:    "#f87171",
      badge:   "bg-rose-100 text-rose-700 border-rose-200",
      icon:    "🔴",
      label:   "Needs Attention",
      message: "Several indicators suggest your child may benefit from specialist support. This is not a diagnosis — it's a signal to explore further.",
      detail:  "Many children with these patterns thrive with the right guidance and support.",
    },
  };

  const c = config[riskLevel] || config.medium;

  return (
    <GlassCard className={`p-6 ${c.bg} ${c.border} border-2`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <span className="text-4xl">{c.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-extrabold border ${c.badge}`}>
              {c.label}
            </span>
            <span className="text-xs font-bold text-slate-500">Based on latest assessment</span>
          </div>
          <p className="text-base font-bold text-slate-800 leading-relaxed mb-2">{c.message}</p>
          <p className="text-sm font-semibold text-slate-500 leading-relaxed">{c.detail}</p>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Section 2: Key Observations ──────────────────────────────────────────────

function ObservationCard({ icon, title, detail, tone }) {
  const toneStyles = {
    positive: "border-emerald-200/70 bg-emerald-50/60",
    neutral:  "border-sky-200/70 bg-sky-50/60",
    concern:  "border-amber-200/70 bg-amber-50/60",
  };
  return (
    <GlassCard className={`p-4 ${toneStyles[tone] || toneStyles.neutral}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5 flex-shrink-0">{icon}</span>
        <div>
          <div className="font-extrabold text-slate-800 text-sm mb-1">{title}</div>
          <div className="text-xs font-semibold text-slate-600 leading-relaxed">{detail}</div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Section 3: Understanding Dyslexia ────────────────────────────────────────

function DyslexiaEducationSection() {
  const [tab, setTab] = useState("signs");

  return (
    <GlassCard className="p-6">
      <SectionHeading
        emoji="🧠"
        title="Understanding Dyslexia"
        subtitle="Knowledge is the first step toward the right support"
      />

      {/* Hero explanation */}
      <div className="rounded-2xl border border-violet-200/70 bg-violet-50/60 p-4 mb-5">
        <p className="text-sm font-bold text-slate-700 leading-relaxed">
          <span className="text-violet-700 font-extrabold">Dyslexia</span> is a learning difference
          that affects how the brain processes written and spoken language. It has{" "}
          <span className="font-extrabold text-slate-800">nothing to do with intelligence</span> —
          many people with dyslexia are highly creative, strategic thinkers who simply process
          information differently.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "signs",     label: "Common Signs",  emoji: "🔍" },
          { id: "strengths", label: "Strengths",     emoji: "💪" },
          { id: "famous",    label: "Famous People", emoji: "⭐" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "px-4 py-2 rounded-2xl text-xs font-extrabold border transition-all duration-200",
              tab === t.id
                ? "border-violet-300/70 bg-violet-50/80 text-violet-700 shadow-soft"
                : "border-white/70 bg-white/40 text-slate-500 hover:bg-white/60",
            ].join(" ")}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Signs */}
      {tab === "signs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DYSLEXIA_SIGNS.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/40 p-3"
            >
              <span className="text-lg mt-0.5 flex-shrink-0">{s.icon}</span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Strengths */}
      {tab === "strengths" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DYSLEXIA_STRENGTHS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center rounded-2xl border border-white/70 bg-white/40 p-4 gap-2"
            >
              <span className="text-3xl">{s.icon}</span>
              <div className="font-extrabold text-sm text-slate-800">{s.label}</div>
              <div className="text-[11px] font-semibold text-slate-500 leading-snug">{s.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Famous people */}
      {tab === "famous" && (
        <div>
          <p className="text-xs font-bold text-slate-500 mb-3">
            These remarkable people all had dyslexia — and changed the world.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FAMOUS_PEOPLE.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/40 p-3"
              >
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <div className="font-extrabold text-sm text-slate-800">{p.name}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{p.field}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ── Section 4: Recommendations ────────────────────────────────────────────────

function RecommendationsSection() {
  return (
    <GlassCard className="p-6">
      <SectionHeading
        emoji="🌱"
        title="What You Can Do Today"
        subtitle="Small, consistent actions make the biggest difference"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECOMMENDATIONS.map((r, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/70 bg-white/40 p-4 hover:bg-white/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-3xl">{r.icon}</span>
            <div className="mt-3 font-extrabold text-slate-800 text-sm mb-1">{r.title}</div>
            <div className="text-xs font-semibold text-slate-600 leading-relaxed">{r.desc}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ── Section 5: Motivational Quote ─────────────────────────────────────────────

function QuoteCard() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[idx];

  return (
    <GlassCard
      className="p-6 border-2"
      style={{
        background: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(196,181,253,0.08), rgba(99,179,237,0.08))",
        borderColor: "rgba(167,139,250,0.3)",
      }}
    >
      <div className="flex items-start gap-4">
        <span
          className="text-5xl leading-none flex-shrink-0 font-black"
          style={{ color: "#a78bfa", fontFamily: "Georgia, serif", lineHeight: 0.8 }}
        >
          "
        </span>
        <div
          className="flex-1"
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p className="text-base font-bold text-slate-800 leading-relaxed mb-3 italic">
            {quote.text}
          </p>
          <p className="text-xs font-extrabold text-violet-600 uppercase tracking-widest">
            — {quote.author}
          </p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-4 justify-center">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-6 bg-violet-500" : "w-1.5 bg-violet-200"
            }`}
          />
        ))}
      </div>
    </GlassCard>
  );
}

// ── Section 6: Assessment Progress ────────────────────────────────────────────

function AssessmentProgressCard({ setPage }) {
  const steps = [
    { id: "typing",    label: "Typing Assessment",  emoji: "⌨️",  desc: "Measures speed, accuracy and pause patterns" },
    { id: "reading",   label: "Reading Assessment", emoji: "📖",  desc: "Evaluates comprehension and reading fluency" },
    { id: "cognitive", label: "Cognitive Tests",    emoji: "🧠",  desc: "Assesses memory, pattern and language skills" },
    { id: "survey",    label: "Behavioural Survey", emoji: "📋",  desc: "Parent/teacher observations (A1–A10)" },
  ];

  return (
    <GlassCard className="p-6">
      <SectionHeading
        emoji="📊"
        title="Assessment Modules"
        subtitle="Complete all four for the most accurate report"
      />
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/40 px-4 py-3 hover:bg-white/60 transition-all duration-200 cursor-pointer"
            onClick={() => setPage?.(step.id)}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-100 to-sky-100 border border-white/70 flex items-center justify-center text-xl flex-shrink-0">
                {step.emoji}
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-800">{step.label}</div>
                <div className="text-xs font-semibold text-slate-500">{step.desc}</div>
              </div>
            </div>
            <span className="text-violet-400 font-black text-sm flex-shrink-0">→</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => setPage?.("typing")}
        className="mt-4 w-full py-3 rounded-2xl font-extrabold text-sm text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
        style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
      >
        🚀 Start Full Assessment
      </button>
    </GlassCard>
  );
}

// ── Did you know strip ─────────────────────────────────────────────────────────

function DidYouKnow() {
  const facts = [
    "1 in 5 people have dyslexia — it's the most common learning difference.",
    "Dyslexia is neurological, not caused by poor teaching or laziness.",
    "Early identification before age 8 leads to the best outcomes.",
    "Children with dyslexia often have above-average intelligence.",
    "With the right support, children with dyslexia can become strong readers.",
  ];
  const [idx] = useState(() => Math.floor(Math.random() * facts.length));

  return (
    <div
      className="rounded-2xl border px-5 py-3 flex items-center gap-3"
      style={{ background: "rgba(6,182,212,0.07)", borderColor: "rgba(6,182,212,0.25)" }}
    >
      <span className="text-xl flex-shrink-0">💡</span>
      <p className="text-sm font-bold text-slate-700 leading-relaxed">
        <span className="font-extrabold text-cyan-700">Did you know? </span>
        {facts[idx]}
      </p>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function DashboardPage({ setPage, ageGroup }) {
  // In a real app these would come from the assessment state
  const riskLevel = "medium";

  const observations = [
    {
      icon: "📖",
      title: "Reading speed is slightly below average",
      detail: "Your child takes a little more time than peers to process written text — this is very common and very manageable with practice.",
      tone: "concern",
    },
    {
      icon: "🧠",
      title: "Strong cognitive performance",
      detail: "Pattern recognition and memory scores are solid, suggesting good underlying intelligence and reasoning ability.",
      tone: "positive",
    },
    {
      icon: "⌨️",
      title: "Typing shows some hesitation patterns",
      detail: "Pauses mid-word during typing may indicate phonological processing difficulty — the brain working harder to connect sounds to letters.",
      tone: "concern",
    },
    {
      icon: "✨",
      title: "Attention and focus are within normal range",
      detail: "No significant attention inconsistency detected. Your child appears to stay engaged during timed tasks.",
      tone: "positive",
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-1">
            👋 Welcome back
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Your child's learning journey
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Age group: <span className="text-violet-600 font-extrabold">{ageGroup || "Not set"}</span>
            &nbsp;·&nbsp;DysLearnAI is here to help, not to judge.
          </p>
        </div>
        <button
          onClick={() => setPage?.("report")}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl text-sm font-extrabold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
        >
          📊 View Full Report
        </button>
      </div>

      {/* ── Did you know ── */}
      <DidYouKnow />

      {/* ── Row 1: Risk + Quote ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-3">
            <SectionHeading
              emoji="📊"
              title="Your Child's Current Status"
              subtitle="Based on the most recent assessment data"
            />
          </div>
          <RiskOverviewCard riskLevel={riskLevel} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="mb-3">
            <SectionHeading
              emoji="🌟"
              title="Words of Encouragement"
              subtitle="A reminder for every parent and child"
            />
          </div>
          <QuoteCard />
        </div>
      </div>

      {/* ── Row 2: Key Observations ── */}
      <div>
        <SectionHeading
          emoji="💡"
          title="Key Observations"
          subtitle="What the assessment data is telling us — in plain language"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {observations.map((obs, i) => (
            <ObservationCard key={i} {...obs} />
          ))}
        </div>
      </div>

      {/* ── Row 3: Recommendations + Assessment modules ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <RecommendationsSection />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <AssessmentProgressCard setPage={setPage} />
        </div>
      </div>

      {/* ── Row 4: Education section ── */}
      <DyslexiaEducationSection />

      {/* ── Footer note ── */}
      <div className="rounded-2xl border border-white/60 bg-white/30 p-4">
        <p className="text-xs font-bold text-slate-500 leading-relaxed text-center">
          🔒 All data stays private. DysLearnAI provides <strong>screening guidance only</strong> — not a clinical diagnosis.
          Always consult an educational specialist for formal evaluation.
        </p>
      </div>

    </div>
  );
}
