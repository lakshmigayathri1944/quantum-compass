import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Analytics() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");

      const storedUserId =
        localStorage.getItem("user_id");

      if (!storedUserId) {
        throw new Error(
          "No logged-in user found."
        );
      }

      const userId =
        Number(storedUserId);

      if (
        !Number.isInteger(userId) ||
        userId <= 0
      ) {
        throw new Error(
          "Invalid user ID."
        );
      }

      console.log(
        "Loading analytics for user:",
        userId
      );

      const response =
        await fetch(
          `${API_URL}/analytics/${userId}`
        );

      const data =
        await response.json();

      console.log(
        "Analytics response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Analytics request failed: ${response.status}`
        );
      }

      if (
        data.status &&
        data.status !== "success"
      ) {
        throw new Error(
          data.message ||
            "Unable to load analytics."
        );
      }

      setAnalytics(data);
    } catch (err) {
      console.error(
        "ANALYTICS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>

        <div style={styles.loadingCard}>

          <div style={styles.loadingIcon}>
            📊
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Analytics...
          </h2>

          <p style={styles.muted}>
            Analyzing your Quantum Compass
            progress...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div style={styles.page}>

        <div style={styles.errorCard}>

          <div style={styles.errorIcon}>
            ⚠️
          </div>

          <h2>
            Analytics Unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={loadAnalytics}
            style={styles.primaryButton}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // SAFE DATA
  // =====================================================

  const completedCount =
    Number(
      analytics?.completed_count ??
      analytics?.completed_skills ??
      0
    );

  const totalSkills =
    Number(
      analytics?.total_skills ??
      0
    );

  const rawPercentage =
    analytics?.completion_percentage ??
    analytics?.progress ??
    "0";

  const percentage =
    Math.min(
      100,
      Math.max(
        0,
        Number(
          String(rawPercentage)
            .replace("%", "")
        ) || 0
      )
    );

  const level =
    analytics?.current_level ||
    analytics?.level ||
    "Beginner";

  const completedSkills =
    Array.isArray(
      analytics?.completed_skills
    )
      ? analytics.completed_skills
      : [];

  const nextSkill =
    analytics?.recommended_next ||
    analytics?.next_skill ||
    null;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>

        <div>

          <div style={styles.badge}>
            📊 LEARNING ANALYTICS
          </div>

          <h1 style={styles.title}>
            Your Quantum Progress
          </h1>

          <p style={styles.subtitle}>
            Track your learning journey
            and discover what to master
            next.
          </p>

        </div>

        <button
          onClick={loadAnalytics}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>

      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            🎯
          </div>

          <div>

            <p style={styles.statLabel}>
              Completed Skills
            </p>

            <h2 style={styles.statValue}>
              {completedCount}

              <span style={styles.statTotal}>
                {" "}
                / {totalSkills}
              </span>
            </h2>

          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            📈
          </div>

          <div>

            <p style={styles.statLabel}>
              Overall Progress
            </p>

            <h2 style={styles.statValue}>
              {percentage}%
            </h2>

          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            ⚡
          </div>

          <div>

            <p style={styles.statLabel}>
              Current Level
            </p>

            <h2 style={styles.statValue}>
              {level}
            </h2>

          </div>

        </div>

        <div style={styles.statCard}>

          <div style={styles.statIcon}>
            🚀
          </div>

          <div>

            <p style={styles.statLabel}>
              Next Focus
            </p>

            <h2 style={styles.nextValue}>
              {nextSkill ||
                "Python Basics"}
            </h2>

          </div>

        </div>

      </div>

      {/* PROGRESS */}
      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              🚀 Learning Progress
            </h2>

            <p style={styles.muted}>
              Your overall Quantum Compass
              completion
            </p>

          </div>

          <strong style={styles.percentage}>
            {percentage}%
          </strong>

        </div>

        <div style={styles.progressBackground}>

          <div
            style={{
              ...styles.progressBar,
              width: `${percentage}%`,
            }}
          />

        </div>

        <div style={styles.progressFooter}>

          <span>
            {completedCount}
            {" "}
            skills completed
          </span>

          <span>
            {totalSkills}
            {" "}
            total skills
          </span>

        </div>

      </div>

      {/* LEVEL */}
      <div style={styles.card}>

        <h2 style={styles.sectionTitle}>
          🏆 Current Skill Level
        </h2>

        <div style={styles.levelBox}>

          <div style={styles.levelIcon}>
            {level === "Advanced"
              ? "🔥"
              : level === "Intermediate"
              ? "⚡"
              : "🌱"}
          </div>

          <div>

            <h2 style={styles.levelTitle}>
              {level}
            </h2>

            <p style={styles.muted}>
              {level === "Advanced"
                ? "Excellent! You have completed the core roadmap."
                : level === "Intermediate"
                ? "Great progress! Keep building your quantum foundation."
                : "You are beginning your quantum learning journey."}
            </p>

          </div>

        </div>

      </div>

      {/* COMPLETED SKILLS */}
      <div style={styles.card}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              ✅ Completed Skills
            </h2>

            <p style={styles.muted}>
              Skills you have successfully
              completed
            </p>

          </div>

          <span style={styles.countBadge}>
            {completedSkills.length}
          </span>

        </div>

        {completedSkills.length === 0 ? (

          <div style={styles.emptyBox}>

            <span style={styles.emptyIcon}>
              📚
            </span>

            <p>
              No completed skills yet.
            </p>

            <p style={styles.smallText}>
              Start with Python Basics
              from your roadmap.
            </p>

          </div>

        ) : (

          <div style={styles.skillGrid}>

            {completedSkills.map(
              (skill, index) => (

                <div
                  key={`${skill}-${index}`}
                  style={styles.skillItem}
                >

                  <span style={styles.check}>
                    ✓
                  </span>

                  <span>
                    {skill}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* RECOMMENDATION */}
      <div style={styles.recommendation}>

        <div style={styles.recommendIcon}>
          🎯
        </div>

        <div style={{ flex: 1 }}>

          <p style={styles.recommendLabel}>
            AI RECOMMENDATION
          </p>

          <h2 style={styles.recommendTitle}>

            {nextSkill
              ? `Focus next on ${nextSkill}`
              : "Your core roadmap is complete! 🎉"}

          </h2>

          <p style={styles.recommendText}>

            {nextSkill
              ? "Master this skill before moving deeper into advanced quantum topics."
              : "You are ready to move into specialization, advanced algorithms, QML and research projects."}

          </p>

        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
    boxSizing: "border-box",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.6px",
    marginBottom: "12px",
  },

  title: {
    margin: "0",
    fontSize: "34px",
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
    fontSize: "15px",
  },

  refreshButton: {
    border: "none",
    borderRadius: "12px",
    padding: "11px 18px",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "22px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.06)",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    background: "#eef2ff",
    fontSize: "22px",
    flexShrink: 0,
  },

  statLabel: {
    margin: "0 0 5px",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "600",
  },

  statValue: {
    margin: "0",
    color: "#111827",
    fontSize: "25px",
    fontWeight: "800",
  },

  statTotal: {
    color: "#9ca3af",
    fontSize: "16px",
  },

  nextValue: {
    margin: "0",
    color: "#111827",
    fontSize: "17px",
    fontWeight: "800",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: "0",
    color: "#111827",
    fontSize: "21px",
    fontWeight: "800",
  },

  muted: {
    color: "#6b7280",
    margin: "7px 0 0",
    lineHeight: "1.6",
  },

  percentage: {
    fontSize: "25px",
    color: "#4f46e5",
  },

  progressBackground: {
    width: "100%",
    height: "14px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, #4f46e5, #7c3aed)",
    borderRadius: "999px",
    transition: "width 0.6s ease",
  },

  progressFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    color: "#6b7280",
    fontSize: "13px",
  },

  levelBox: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "18px",
    marginTop: "18px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
  },

  levelIcon: {
    fontSize: "35px",
  },

  levelTitle: {
    margin: "0",
    color: "#111827",
    fontSize: "24px",
  },

  countBadge: {
    minWidth: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#eef2ff",
    color: "#4f46e5",
    fontWeight: "800",
  },

  skillGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },

  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    borderRadius: "12px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    color: "#374151",
    fontWeight: "600",
  },

  check: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    fontWeight: "900",
  },

  recommendation: {
    display: "flex",
    alignItems: "flex-start",
    gap: "18px",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #eef2ff, #f5f3ff)",
    border: "1px solid #ddd6fe",
  },

  recommendIcon: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "#ffffff",
    fontSize: "24px",
    flexShrink: 0,
  },

  recommendLabel: {
    margin: "0 0 5px",
    color: "#6d28d9",
    fontSize: "12px",
    fontWeight: "900",
    letterSpacing: "0.8px",
  },

  recommendTitle: {
    margin: "0",
    color: "#111827",
    fontSize: "20px",
  },

  recommendText: {
    margin: "8px 0 0",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  loadingCard: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "45px",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
  },

  loadingIcon: {
    fontSize: "50px",
  },

  loadingTitle: {
    color: "#111827",
  },

  errorCard: {
    maxWidth: "550px",
    margin: "100px auto",
    padding: "40px",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #fecaca",
  },

  errorIcon: {
    fontSize: "50px",
  },

  primaryButton: {
    marginTop: "15px",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    background: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyBox: {
    padding: "30px",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyIcon: {
    display: "block",
    fontSize: "35px",
    marginBottom: "8px",
  },

  smallText: {
    fontSize: "13px",
    color: "#9ca3af",
  },
};

export default Analytics;