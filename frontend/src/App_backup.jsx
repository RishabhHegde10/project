import { useEffect, useMemo, useState } from "react";
import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import TypingAssessmentPage from "./pages/TypingAssessmentPage";
import AnalysisReportPage from "./pages/AnalysisReportPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [active, setActive] = useState("dashboard"); // dashboard | typing | report
  const [assessment, setAssessment] = useState(null);
  const [user, setUser] = useState(null);

  const pageEl = useMemo(() => {
    const commonAnim = { animation: "fadeUp 280ms ease both" };

    if (active === "typing") {
      return (
        <div style={commonAnim} key="typing">
          <TypingAssessmentPage onAssessmentComplete={(a) => setAssessment(a)} />
        </div>
      );
    }

    if (active === "report") {
      return (
        <div style={commonAnim} key="report">
          <AnalysisReportPage assessment={assessment} />
        </div>
      );
    }

    return (
      <div style={commonAnim} key="dashboard">
        <DashboardPage />
      </div>
    );
  }, [active, assessment]);

  useEffect(() => {
    // If user lands on typing, they can later navigate to report with the latest telemetry.
    // This is a placeholder for real auth + persisted sessions.
  }, []);

  return (
    <>
      {!user ? (
        <LoginPage
          onLogin={(u) => {
            setUser(u);
            setActive("dashboard");
          }}
        />
      ) : (
        <AppShell active={active} onNavigate={(id) => setActive(id)}>
          {pageEl}
        </AppShell>
      )}
    </>
  );
}

