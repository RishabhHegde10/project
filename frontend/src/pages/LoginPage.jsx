import { useState } from "react";

/* ─────────────────────────────────────────────
   FLOATING STICKERS  –  always visible behind
───────────────────────────────────────────── */
const STICKERS = [
  { emoji: "🌈", x: 5,  y: 8,  size: 52, dur: 7, delay: 0   },
  { emoji: "⭐", x: 18, y: 75, size: 44, dur: 5, delay: 0.8 },
  { emoji: "🦄", x: 88, y: 12, size: 56, dur: 8, delay: 1.2 },
  { emoji: "🎨", x: 75, y: 80, size: 48, dur: 6, delay: 0.3 },
  { emoji: "🚀", x: 50, y: 5,  size: 50, dur: 9, delay: 2   },
  { emoji: "🎈", x: 92, y: 50, size: 46, dur: 6, delay: 1.5 },
  { emoji: "🌸", x: 3,  y: 45, size: 44, dur: 7, delay: 0.5 },
  { emoji: "🍭", x: 35, y: 90, size: 48, dur: 5, delay: 1.8 },
  { emoji: "🎉", x: 65, y: 88, size: 50, dur: 8, delay: 0.9 },
  { emoji: "🐱", x: 12, y: 22, size: 42, dur: 6, delay: 2.3 },
  { emoji: "🌻", x: 82, y: 30, size: 46, dur: 7, delay: 0.7 },
  { emoji: "💎", x: 47, y: 78, size: 40, dur: 5, delay: 1.1 },
  { emoji: "🎵", x: 28, y: 55, size: 44, dur: 9, delay: 1.6 },
  { emoji: "🦋", x: 70, y: 18, size: 48, dur: 6, delay: 2.8 },
  { emoji: "🍩", x: 58, y: 45, size: 42, dur: 7, delay: 0.4 },
  { emoji: "🤖", x: 22, y: 88, size: 50, dur: 8, delay: 1.9 },
  { emoji: "🌙", x: 93, y: 70, size: 44, dur: 5, delay: 3.1 },
  { emoji: "🏆", x: 40, y: 15, size: 46, dur: 7, delay: 2.5 },
];

function FloatingStickers() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {STICKERS.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          fontSize: s.size, lineHeight: 1,
          animation: `floatBob ${s.dur}s ease-in-out ${s.delay}s infinite`,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
          userSelect: "none", willChange: "transform",
        }}>{s.emoji}</div>
      ))}
    </div>
  );
}

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

    @keyframes floatBob{
      0%,100%{transform:translateY(0px) rotate(-3deg)}
      25%{transform:translateY(-18px) rotate(3deg)}
      50%{transform:translateY(-8px) rotate(-2deg)}
      75%{transform:translateY(-22px) rotate(4deg)}
    }
    @keyframes slideUp{
      from{opacity:0;transform:translateY(30px)}
      to{opacity:1;transform:translateY(0)}
    }
    @keyframes popIn{
      0%{opacity:0;transform:scale(0.7)}
      70%{transform:scale(1.05)}
      100%{opacity:1;transform:scale(1)}
    }
    @keyframes wiggle{
      0%,100%{transform:rotate(-4deg)}
      50%{transform:rotate(4deg)}
    }
    @keyframes spinSlow { to { transform: rotate(360deg) } }
    @keyframes bounceIn{
      0%{opacity:0;transform:scale(0.3)}
      50%{transform:scale(1.1)}
      70%{transform:scale(0.95)}
      100%{opacity:1;transform:scale(1)}
    }
    @keyframes gradMove{
      0%,100%{background-position:0% 50%}
      50%{background-position:100% 50%}
    }

    .glass{
      background:rgba(255,255,255,0.55);
      backdrop-filter:blur(20px) saturate(160%);
      -webkit-backdrop-filter:blur(20px) saturate(160%);
      border:2px solid rgba(255,255,255,0.85);
      box-shadow:0 8px 32px rgba(120,80,200,0.10), 0 2px 8px rgba(0,0,0,0.06);
      border-radius:28px;
    }
    .glass:hover{
      box-shadow:0 12px 48px rgba(120,80,200,0.18), 0 4px 16px rgba(0,0,0,0.08);
      transition:all 0.3s cubic-bezier(.16,1,.3,1);
    }
    .btn-fun{
      border:none; cursor:pointer;
      font-family:'Fredoka One',cursive;
      letter-spacing:0.04em;
      transition:all 0.2s cubic-bezier(.16,1,.3,1);
    }
    .btn-fun:hover{transform:scale(1.06) translateY(-2px);}
    .btn-fun:active{transform:scale(0.97);}

    input { box-sizing: border-box; }
  `}</style>
);

// ── Shared input style helper ──────────────────────────────────────────────
function inputStyle(focused, color = "#a78bfa", shadowColor = "rgba(167,139,250,0.2)") {
  return {
    width: "100%", padding: "13px 16px", borderRadius: 16,
    fontSize: 15, fontFamily: "'Nunito',sans-serif", fontWeight: 600,
    border: focused ? `2.5px solid ${color}` : "2.5px solid #e9d5ff",
    background: focused ? `${color}14` : "rgba(255,255,255,0.7)",
    outline: "none", color: "#3730a3",
    boxShadow: focused ? `0 0 0 4px ${shadowColor}` : "none",
    transition: "all 0.25s",
  };
}

const BASE_URL = "http://127.0.0.1:5000";

// ─────────────────────────────────────────────────────────────────────────────
//  LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin, onSwitchToRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [focusE, setFocusE]     = useState(false);
  const [focusP, setFocusP]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields! 📝");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend returns error message in data.error or data.message
        setError(data.error || data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Save user_id and email to localStorage for use across the app
      localStorage.setItem("user_id",    data.user_id);
      localStorage.setItem("user_email", data.email || email.trim());
      localStorage.setItem("child_name", data.child_name || "");

      // Pass full user object up
      onLogin?.({
        user_id:    data.user_id,
        email:      data.email || email.trim(),
        child_name: data.child_name || "",
      });

    } catch (err) {
      setError("Cannot reach the server. Is Flask running on port 5000? 🔌");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#3730a3", marginBottom: 4 }}>
        Sign in to learn! 📚
      </h2>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24, fontWeight: 600 }}>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToRegister}
          style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
          Register here →
        </button>
      </p>

      {/* Email */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          📧 Email
        </label>
        <input
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocusE(true)} onBlur={() => setFocusE(false)}
          placeholder="your@email.com"
          style={inputStyle(focusE, "#a78bfa", "rgba(167,139,250,0.2)")}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          🔒 Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPw ? "text" : "password"} value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusP(true)} onBlur={() => setFocusP(false)}
            placeholder="Enter password"
            style={{ ...inputStyle(focusP, "#f472b6", "rgba(244,114,182,0.2)"), paddingRight: 48 }}
          />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
            {showPw ? "🙈" : "👀"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "linear-gradient(135deg,#fff0f0,#ffe4ef)", border: "2px solid #fca5a5", borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "#dc2626", fontWeight: 700, marginBottom: 16, animation: "slideUp 0.3s ease both" }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn-fun" disabled={loading} style={{
        width: "100%", padding: "15px", borderRadius: 18, fontSize: 17,
        background: loading ? "linear-gradient(135deg,#c4b5fd,#fbcfe8)" : "linear-gradient(135deg,#7c3aed,#db2777,#ea580c)",
        backgroundSize: "200% 200%",
        animation: loading ? "none" : "gradMove 3s ease infinite",
        color: "#fff", boxShadow: "0 6px 24px rgba(124,58,237,0.4)", letterSpacing: "0.05em",
      }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 18, height: 18, border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} />
            Signing in…
          </span>
        ) : "Let's Go! 🚀"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  REGISTER FORM
// ─────────────────────────────────────────────────────────────────────────────
function RegisterForm({ onRegistered, onSwitchToLogin }) {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge]             = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showPw, setShowPw]       = useState(false);

  const [focusE, setFocusE] = useState(false);
  const [focusP, setFocusP] = useState(false);
  const [focusN, setFocusN] = useState(false);
  const [focusA, setFocusA] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !childName.trim() || !age) {
      setError("Please fill in all fields! 📝");
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 4 || Number(age) > 18) {
      setError("Please enter a valid age between 4 and 18.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:      email.trim(),
          password,
          child_name: childName.trim(),
          age:        Number(age),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Registration failed. Try again.");
        setLoading(false);
        return;
      }

      // Auto-login after registration if backend returns user_id
      if (data.user_id) {
        localStorage.setItem("user_id",    data.user_id);
        localStorage.setItem("user_email", email.trim());
        localStorage.setItem("child_name", childName.trim());
        onRegistered?.({ user_id: data.user_id, email: email.trim(), child_name: childName.trim() });
      } else {
        // Registration succeeded but no auto-login — switch to login
        onSwitchToLogin?.();
      }

    } catch {
      setError("Cannot reach the server. Is Flask running on port 5000? 🔌");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#3730a3", marginBottom: 4 }}>
        Create account! 🎉
      </h2>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20, fontWeight: 600 }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin}
          style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>
          Sign in →
        </button>
      </p>

      {/* Child name */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          👶 Child's Name
        </label>
        <input type="text" value={childName} onChange={e => setChildName(e.target.value)}
          onFocus={() => setFocusN(true)} onBlur={() => setFocusN(false)}
          placeholder="e.g. Aryan"
          style={inputStyle(focusN, "#a78bfa", "rgba(167,139,250,0.2)")} />
      </div>

      {/* Age */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          🎂 Child's Age
        </label>
        <input type="number" value={age} onChange={e => setAge(e.target.value)}
          onFocus={() => setFocusA(true)} onBlur={() => setFocusA(false)}
          placeholder="e.g. 9" min="4" max="18"
          style={inputStyle(focusA, "#f472b6", "rgba(244,114,182,0.2)")} />
      </div>

      {/* Email */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          📧 Email
        </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocusE(true)} onBlur={() => setFocusE(false)}
          placeholder="parent@email.com"
          style={inputStyle(focusE, "#a78bfa", "rgba(167,139,250,0.2)")} />
      </div>

      {/* Password */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#6d28d9", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          🔒 Password
        </label>
        <div style={{ position: "relative" }}>
          <input type={showPw ? "text" : "password"} value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusP(true)} onBlur={() => setFocusP(false)}
            placeholder="Choose a password"
            style={{ ...inputStyle(focusP, "#f472b6", "rgba(244,114,182,0.2)"), paddingRight: 48 }} />
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
            {showPw ? "🙈" : "👀"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "linear-gradient(135deg,#fff0f0,#ffe4ef)", border: "2px solid #fca5a5", borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "#dc2626", fontWeight: 700, marginBottom: 16, animation: "slideUp 0.3s ease both" }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn-fun" disabled={loading} style={{
        width: "100%", padding: "15px", borderRadius: 18, fontSize: 17,
        background: loading ? "linear-gradient(135deg,#c4b5fd,#fbcfe8)" : "linear-gradient(135deg,#7c3aed,#db2777,#ea580c)",
        backgroundSize: "200% 200%",
        animation: loading ? "none" : "gradMove 3s ease infinite",
        color: "#fff", boxShadow: "0 6px 24px rgba(124,58,237,0.4)", letterSpacing: "0.05em",
      }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 18, height: 18, border: "3px solid rgba(255,255,255,0.4)", borderTop: "3px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spinSlow 0.7s linear infinite" }} />
            Creating account…
          </span>
        ) : "Register! 🌟"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage({ onLogin }) {
  const [mode, setMode]       = useState("login");   // "login" | "register"
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  function handleLoginSuccess(user) {
    setUserName(user.child_name || user.email);
    setSuccess(true);
    setTimeout(() => onLogin?.(user), 1200);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: 24 }}>
      <G />
      <FloatingStickers />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 2, animation: "slideUp 0.7s cubic-bezier(.16,1,.3,1) both" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 88, height: 88, borderRadius: 28, background: "linear-gradient(135deg,#a78bfa,#f472b6,#fb923c)", fontSize: 44, animation: "wiggle 2s ease-in-out infinite", boxShadow: "0 8px 32px rgba(167,139,250,0.5)", marginBottom: 16 }}>
            🧠
          </div>
          <h1 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 38, color: "#6d28d9", letterSpacing: "0.02em", lineHeight: 1, marginBottom: 6 }}>
            DysLearn<span style={{ color: "#f472b6" }}>AI</span>
          </h1>
          <p style={{ fontSize: 15, color: "#7c6b9e", fontWeight: 600 }}>Your smart learning buddy! 🌟</p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: "36px 32px 32px", animation: "popIn 0.6s cubic-bezier(.16,1,.3,1) 0.15s both" }}>

          {/* Success state */}
          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 72, animation: "bounceIn 0.6s ease both" }}>🎉</div>
              <h2 style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#16a34a", marginTop: 12 }}>
                Welcome{userName ? `, ${userName}` : ""}!
              </h2>
              <p style={{ color: "#6d28d9", marginTop: 8, fontWeight: 600 }}>Loading your dashboard…</p>
              <div style={{ width: 48, height: 48, margin: "20px auto 0", border: "5px solid #e9d5ff", borderTop: "5px solid #7c3aed", borderRadius: "50%", animation: "spinSlow 0.8s linear infinite" }} />
            </div>
          ) : mode === "login" ? (
            <LoginForm
              onLogin={handleLoginSuccess}
              onSwitchToRegister={() => setMode("register")}
            />
          ) : (
            <RegisterForm
              onRegistered={handleLoginSuccess}
              onSwitchToLogin={() => setMode("login")}
            />
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Made with 💜 for little learners</span>
        </div>
      </div>
    </div>
  );
}
