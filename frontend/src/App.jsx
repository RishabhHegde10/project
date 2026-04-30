import { useState, useMemo, useEffect } from "react";

import SidebarNav from "./components/nav/SidebarNav.jsx";

import LoginPage            from "./pages/LoginPage";
import AgeSelection         from "./pages/AgeSelection";
import DashboardPage        from "./pages/DashboardPage";
import TypingAssessmentPage from "./pages/TypingAssessmentPage";
import ReadingTest          from "./pages/ReadingTest";
import CognitiveTest        from "./pages/CognitiveTest";
import SurveyTest           from "./pages/SurveyTest";
import AnalysisReportPage   from "./pages/AnalysisReportPage";
import HistoryPage          from "./pages/HistoryPage";

import { loadUserFromStorage, saveUserToStorage, clearUserFromStorage } from "./api.js";

export default function App() {
  const [page, setPage]             = useState("login");
  const [ageGroup, setAgeGroup]     = useState(null);
  const [assessment, setAssessment] = useState({});
  const [user, setUser]             = useState(null);   // { user_id, email, child_name }

  // ── Restore session from localStorage on first load ───────────────────
  useEffect(() => {
    const saved = loadUserFromStorage();
    if (saved) {
      setUser(saved);
      setPage("age"); // go to age selection (or "dashboard" if you want to skip)
    }
  }, []);

  function mergeAssessment(newData) {
    setAssessment((prev) => ({ ...prev, ...newData }));
  }

  function handleLogin(userData) {
    saveUserToStorage(userData);
    setUser(userData);
    setPage("age");
  }

  function handleLogout() {
    clearUserFromStorage();
    setUser(null);
    setAgeGroup(null);
    setAssessment({});
    setPage("login");
  }

  const content = useMemo(() => {
    if (page === "login") {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (page === "age") {
      return (
        <AgeSelection
          onContinue={(age) => {
            setAgeGroup(age);
            setPage("dashboard");
          }}
        />
      );
    }

    switch (page) {
      case "dashboard":
        return (
          <DashboardPage
            setPage={setPage}
            ageGroup={ageGroup}
            user={user}
          />
        );

      case "typing":
        return (
          <TypingAssessmentPage
            setPage={setPage}
            ageGroup={ageGroup}
            onTypingComplete={(data) => {
              mergeAssessment(data);
              setPage("reading");
            }}
          />
        );

      case "reading":
        return (
          <ReadingTest
            setPage={setPage}
            ageGroup={ageGroup}
            onReadingComplete={(data) => {
              mergeAssessment(data);
              setPage("cognitive");
            }}
          />
        );

      case "cognitive":
        return (
          <CognitiveTest
            setPage={setPage}
            ageGroup={ageGroup}
            onComplete={(data) => {
              mergeAssessment(data);
              setPage("survey");
            }}
          />
        );

      case "survey":
        return (
          <SurveyTest
            setPage={setPage}
            ageGroup={ageGroup}
            onComplete={(data) => {
              mergeAssessment(data);
              setPage("report");
            }}
          />
        );

      case "report":
        return (
          <AnalysisReportPage
            setPage={setPage}
            ageGroup={ageGroup}
            data={assessment}
            user={user}                  // ← pass user so report can call /predict with user_id
          />
        );

      case "history":
        return (
          <HistoryPage
            setPage={setPage}
            user={user}
          />
        );

      default:
        return <DashboardPage setPage={setPage} ageGroup={ageGroup} user={user} />;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ageGroup, assessment, user]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-50 to-sky-50">
      {page !== "login" && page !== "age" && (
        <SidebarNav
          active={page}
          onNavigate={setPage}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <div className="flex-1 p-6">{content}</div>
    </div>
  );
}
