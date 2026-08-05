import React, { useCallback, useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Projects() {
  const userId = localStorage.getItem("user_id") || "1";

  const [projects, setProjects] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(6);
  const [progress, setProgress] = useState("0%");
  const [loading, setLoading] = useState(true);
  const [busyProject, setBusyProject] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PROJECTS
  ===================================================== */

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${userId}`
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message || `Projects API failed: ${response.status}`
        );
      }

      const projectList = Array.isArray(data.projects)
        ? data.projects
        : [];

      setProjects(projectList);
      setCompleted(Number(data.completed) || 0);
      setTotal(Number(data.total) || projectList.length || 6);
      setProgress(data.progress || "0%");
    } catch (err) {
      console.error("Projects loading error:", err);

      setError(
        err.message ||
          "Unable to load projects from Quantum Compass backend."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  /* =====================================================
     START PROJECT
  ===================================================== */

  async function startProject(projectId) {
    if (busyProject !== null) return;

    try {
      setBusyProject(projectId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${userId}/${projectId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message || "Unable to start project."
        );
      }

      setMessage(
        data.message || "Project started successfully."
      );

      await loadProjects();
    } catch (err) {
      console.error("Start project error:", err);

      setError(
        err.message || "Unable to start project."
      );
    } finally {
      setBusyProject(null);
    }
  }

  /* =====================================================
     COMPLETE PROJECT
  ===================================================== */

  async function completeProject(projectId) {
    if (busyProject !== null) return;

    try {
      setBusyProject(projectId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/projects/${userId}/${projectId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(
          data.message || "Unable to complete project."
        );
      }

      setMessage(
        data.message ||
          "Project completed successfully!"
      );

      /*
        Immediately update the progress shown on screen
        using the backend response.
      */
      if (data.completed !== undefined) {
        setCompleted(Number(data.completed));
      }

      if (data.total !== undefined) {
        setTotal(Number(data.total));
      }

      if (data.progress) {
        setProgress(data.progress);
      }

      /*
        Reload the complete project list so the
        individual card changes to COMPLETED.
      */
      await loadProjects();
    } catch (err) {
      console.error(
        "Complete project error:",
        err
      );

      setError(
        err.message ||
          "Unable to complete project."
      );
    } finally {
      setBusyProject(null);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}>⚛</div>

          <h2 style={styles.heading}>
            Loading Project Lab...
          </h2>

          <p style={styles.text}>
            Connecting to Quantum Compass AI
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && projects.length === 0) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠</div>

          <h2 style={styles.heading}>
            Project Lab unavailable
          </h2>

          <p style={styles.text}>
            {error}
          </p>

          <button
            style={styles.primaryButton}
            onClick={loadProjects}
          >
            ↻ Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN PROJECT LAB
  ===================================================== */

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <div style={styles.eyebrow}>
            BUILD & PRACTICE
          </div>

          <h1 style={styles.title}>
            Build Real Quantum Projects
          </h1>

          <p style={styles.subtitle}>
            Practice quantum computing through
            beginner, intermediate and advanced
            portfolio projects.
          </p>
        </div>

        {/* PROGRESS */}

        <div style={styles.progressCard}>

          <div style={styles.progressNumber}>
            {completed}/{total}
          </div>

          <div style={styles.progressLabel}>
            PROJECTS COMPLETED
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: progress,
              }}
            />
          </div>

          <strong style={styles.progressText}>
            {progress}
          </strong>

        </div>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div style={styles.successMessage}>
          <span>✓</span>

          <span>{message}</span>

          <button
            style={styles.closeButton}
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div style={styles.warningMessage}>
          <span>⚠</span>

          <span>{error}</span>

          <button
            style={styles.closeButton}
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* PROJECT GRID */}

      <div style={styles.grid}>

        {projects.map((project, index) => {

          const isCompleted =
            project.status === "Completed";

          const isStarted =
            project.status === "Started";

          const isBusy =
            busyProject === project.id;

          return (
            <div
              key={project.id}
              style={{
                ...styles.projectCard,
                ...(isCompleted
                  ? styles.completedCard
                  : {}),
              }}
            >

              {/* PROJECT TOP */}

              <div style={styles.projectTop}>

                <span style={styles.projectNumber}>
                  PROJECT{" "}
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  style={{
                    ...styles.status,
                    ...(isCompleted
                      ? styles.completedStatus
                      : isStarted
                      ? styles.startedStatus
                      : {}),
                  }}
                >
                  {isCompleted
                    ? "✓ COMPLETED"
                    : isStarted
                    ? "● IN PROGRESS"
                    : "AVAILABLE"}
                </span>

              </div>

              {/* TITLE */}

              <h2 style={styles.projectTitle}>
                {project.title}
              </h2>

              {/* DESCRIPTION */}

              <p style={styles.description}>
                {project.description}
              </p>

              {/* LEVEL / DURATION */}

              <div style={styles.infoRow}>
                <span>
                  🎯 {project.level}
                </span>

                <span>
                  ⏱ {project.duration}
                </span>
              </div>

              {/* CATEGORY */}

              <div style={styles.category}>
                {project.category}
              </div>

              {/* SKILLS */}

              <div style={styles.skills}>

                {Array.isArray(project.skills) &&
                  project.skills.map(
                    (skill, skillIndex) => (
                      <span
                        key={`${skill}-${skillIndex}`}
                        style={styles.skill}
                      >
                        {skill}
                      </span>
                    )
                  )}

              </div>

              {/* ACTION */}

              <div style={styles.actions}>

                {isCompleted ? (

                  <div style={styles.completedBox}>
                    ✓ Project Completed
                  </div>

                ) : isStarted ? (

                  <button
                    style={{
                      ...styles.primaryButton,
                      ...(isBusy
                        ? styles.disabledButton
                        : {}),
                    }}
                    disabled={isBusy}
                    onClick={() =>
                      completeProject(project.id)
                    }
                  >
                    {isBusy
                      ? "Completing..."
                      : "Complete Project ✓"}
                  </button>

                ) : (

                  <button
                    style={{
                      ...styles.primaryButton,
                      ...(isBusy
                        ? styles.disabledButton
                        : {}),
                    }}
                    disabled={isBusy}
                    onClick={() =>
                      startProject(project.id)
                    }
                  >
                    {isBusy
                      ? "Starting..."
                      : "Start Project →"}
                  </button>

                )}

              </div>

            </div>
          );
        })}

      </div>

      {/* NO PROJECTS */}

      {projects.length === 0 && (
        <div style={styles.emptyCard}>
          <div style={styles.spinner}>⚛</div>

          <h2>No projects available</h2>

          <p style={styles.text}>
            Your project roadmap is currently empty.
          </p>

          <button
            style={styles.primaryButton}
            onClick={loadProjects}
          >
            ↻ Reload Projects
          </button>
        </div>
      )}

      {/* PROJECT JOURNEY */}

      <div style={styles.bottomCard}>

        <div>

          <div style={styles.eyebrow}>
            PROJECT JOURNEY
          </div>

          <h2 style={styles.bottomTitle}>

            {completed >= total
              ? "All projects completed! 🚀"
              : `${completed} of ${total} projects completed`}

          </h2>

          <p style={styles.text}>
            Complete practical projects to build
            a strong quantum computing portfolio.
          </p>

        </div>

        <div style={styles.bigProgress}>
          {progress}
        </div>

      </div>

    </div>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = {

  wrapper: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 0 40px",
    color: "#f5f7ff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: "#9b8cff",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: 1.2,
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#aeb6d0",
    maxWidth: "700px",
    lineHeight: 1.6,
  },

  progressCard: {
    minWidth: "210px",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    textAlign: "center",
  },

  progressNumber: {
    fontSize: "30px",
    fontWeight: "900",
  },

  progressLabel: {
    fontSize: "10px",
    letterSpacing: "1.5px",
    color: "#9da6c2",
    marginTop: "4px",
  },

  progressTrack: {
    height: "7px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.10)",
    overflow: "hidden",
    marginTop: "15px",
  },

  progressFill: {
    height: "100%",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg,#8b5cf6,#22d3ee)",
    transition: "width 0.4s ease",
  },

  progressText: {
    display: "block",
    marginTop: "8px",
    fontSize: "12px",
    color: "#cbd5ff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  projectCard: {
    padding: "24px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 15px 45px rgba(0,0,0,0.18)",
    transition: "transform 0.2s ease",
  },

  completedCard: {
    border:
      "1px solid rgba(34,211,238,0.35)",
  },

  projectTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },

  projectNumber: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    color: "#8f98b8",
  },

  status: {
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1px",
    padding: "6px 9px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    color: "#b8c0d8",
  },

  completedStatus: {
    background:
      "rgba(34,211,238,0.12)",
    color: "#67e8f9",
  },

  startedStatus: {
    background:
      "rgba(139,92,246,0.15)",
    color: "#c4b5fd",
  },

  projectTitle: {
    margin: 0,
    fontSize: "21px",
    lineHeight: 1.3,
  },

  description: {
    color: "#aeb6d0",
    fontSize: "14px",
    lineHeight: 1.6,
    minHeight: "68px",
    marginTop: "12px",
  },

  infoRow: {
    display: "flex",
    gap: "18px",
    color: "#c8cee0",
    fontSize: "12px",
    marginTop: "15px",
  },

  category: {
    display: "inline-block",
    marginTop: "14px",
    padding: "6px 10px",
    borderRadius: "8px",
    background:
      "rgba(139,92,246,0.12)",
    color: "#c4b5fd",
    fontSize: "11px",
    fontWeight: "700",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "16px",
    minHeight: "48px",
  },

  skill: {
    padding: "5px 8px",
    borderRadius: "7px",
    background:
      "rgba(255,255,255,0.06)",
    color: "#b8c0d8",
    fontSize: "10px",
  },

  actions: {
    marginTop: "20px",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    cursor: "pointer",
    color: "#ffffff",
    fontWeight: "800",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "wait",
  },

  completedBox: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderRadius: "10px",
    textAlign: "center",
    background:
      "rgba(34,211,238,0.10)",
    color: "#67e8f9",
    fontWeight: "800",
    fontSize: "13px",
  },

  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "12px",
    background:
      "rgba(34,197,94,0.10)",
    border:
      "1px solid rgba(34,197,94,0.25)",
    color: "#86efac",
  },

  warningMessage: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "13px 16px",
    borderRadius: "12px",
    background:
      "rgba(245,158,11,0.10)",
    border:
      "1px solid rgba(245,158,11,0.25)",
    color: "#fcd34d",
  },

  closeButton: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    fontSize: "20px",
    cursor: "pointer",
  },

  bottomCard: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg,rgba(124,58,237,0.16),rgba(8,145,178,0.10))",
    border:
      "1px solid rgba(139,92,246,0.20)",
  },

  bottomTitle: {
    margin: 0,
    fontSize: "22px",
  },

  bigProgress: {
    fontSize: "42px",
    fontWeight: "900",
    background:
      "linear-gradient(90deg,#a78bfa,#67e8f9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  loadingCard: {
    padding: "50px",
    textAlign: "center",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.05)",
  },

  spinner: {
    fontSize: "42px",
    marginBottom: "15px",
  },

  errorCard: {
    padding: "40px",
    textAlign: "center",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.05)",
  },

  emptyCard: {
    marginTop: "25px",
    padding: "40px",
    textAlign: "center",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  errorIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  heading: {
    margin: 0,
  },

  text: {
    color: "#aeb6d0",
    lineHeight: 1.6,
  },
};

export default Projects;
