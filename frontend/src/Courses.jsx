import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

const COURSE_DATA = [
  {
    id: 1,
    skill: "Python Basics",
    level: "Beginner",
    duration: "3 Days",
    icon: "🐍",
    description:
      "Learn the Python foundations required for quantum programming.",
    lessons: [
      "Python variables and data types",
      "Operators and expressions",
      "Conditions and loops",
      "Functions",
      "Lists, tuples and dictionaries",
      "Basic problem solving",
    ],
  },
  {
    id: 2,
    skill: "Linear Algebra Basics",
    level: "Beginner",
    duration: "4 Days",
    icon: "📐",
    description:
      "Understand the mathematics used to represent quantum states and operations.",
    lessons: [
      "Vectors and matrices",
      "Matrix operations",
      "Identity matrix",
      "Complex numbers",
      "Eigenvalues and eigenvectors",
      "Quantum state representation",
    ],
  },
  {
    id: 3,
    skill: "Quantum Fundamentals",
    level: "Beginner",
    duration: "4 Days",
    icon: "⚛️",
    description:
      "Understand the core concepts behind quantum computing.",
    lessons: [
      "Classical computing vs quantum computing",
      "Qubits",
      "Superposition",
      "Measurement",
      "Quantum states",
      "Quantum interference",
    ],
  },
  {
    id: 4,
    skill: "Qubits",
    level: "Beginner",
    duration: "3 Days",
    icon: "◉",
    description:
      "Learn how qubits represent and store quantum information.",
    lessons: [
      "Qubit state",
      "|0⟩ and |1⟩ states",
      "Superposition",
      "Bloch sphere",
      "Measurement probabilities",
      "Single-qubit experiments",
    ],
  },
  {
    id: 5,
    skill: "Quantum Gates",
    level: "Intermediate",
    duration: "4 Days",
    icon: "🔷",
    description:
      "Learn the fundamental operations used to manipulate qubits.",
    lessons: [
      "Pauli-X gate",
      "Pauli-Y gate",
      "Pauli-Z gate",
      "Hadamard gate",
      "CNOT gate",
      "Quantum circuits",
    ],
  },
  {
    id: 6,
    skill: "Qiskit Programming",
    level: "Intermediate",
    duration: "5 Days",
    icon: "💻",
    description:
      "Build and execute quantum circuits using Python and Qiskit.",
    lessons: [
      "Installing and using Qiskit",
      "Creating quantum circuits",
      "Adding quantum gates",
      "Measurements",
      "Circuit simulation",
      "Running quantum experiments",
    ],
  },
  {
    id: 7,
    skill: "Grover Algorithm",
    level: "Advanced",
    duration: "5 Days",
    icon: "🔎",
    description:
      "Learn quantum search and amplitude amplification.",
    lessons: [
      "Classical search",
      "Quantum search",
      "Oracle construction",
      "Amplitude amplification",
      "Grover iteration",
      "Implementing Grover with Qiskit",
    ],
  },
  {
    id: 8,
    skill: "QAOA",
    level: "Advanced",
    duration: "6 Days",
    icon: "⚡",
    description:
      "Learn the Quantum Approximate Optimization Algorithm.",
    lessons: [
      "Optimization problems",
      "Combinatorial optimization",
      "Cost Hamiltonian",
      "Mixer Hamiltonian",
      "Parameterized circuits",
      "QAOA implementation",
    ],
  },
  {
    id: 9,
    skill: "Quantum Projects",
    level: "Advanced",
    duration: "10 Days",
    icon: "🚀",
    description:
      "Apply your knowledge by building practical quantum projects.",
    lessons: [
      "Project planning",
      "Quantum Random Number Generator",
      "Quantum Teleportation",
      "Grover Search Project",
      "QAOA Optimization Project",
      "Quantum Compass Capstone",
    ],
  },
];

function Courses() {
  const userId = localStorage.getItem("user_id") || "1";

  const [completedSkills, setCompletedSkills] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProgress() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/dashboard/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Dashboard request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const completed = Array.isArray(
        data.completed_skills
      )
        ? data.completed_skills
        : [];

      setCompletedSkills(completed);
    } catch (err) {
      console.error("Course progress error:", err);

      setError(
        "Unable to load your course progress."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProgress();
  }, []);

  function isCompleted(skill) {
    return completedSkills.includes(skill);
  }

  function getStatus(course) {
    if (isCompleted(course.skill)) {
      return "Completed";
    }

    const index = COURSE_DATA.findIndex(
      (item) => item.id === course.id
    );

    if (index === 0) {
      return "Next Skill";
    }

    const previousCourse =
      COURSE_DATA[index - 1];

    if (isCompleted(previousCourse.skill)) {
      return "Next Skill";
    }

    return "Upcoming";
  }

  async function completeCourse(course) {
    if (isCompleted(course.skill)) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            skill: course.skill,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update course progress."
        );
      }

      setMessage(
        data.message ||
          `${course.skill} completed successfully.`
      );

      await loadProgress();

      setSelectedCourse(null);
    } catch (err) {
      console.error(
        "Course completion error:",
        err
      );

      setError(
        err.message ||
          "Unable to complete the course."
      );
    } finally {
      setSaving(false);
    }
  }

  const completedCount =
    COURSE_DATA.filter((course) =>
      completedSkills.includes(course.skill)
    ).length;

  const totalCourses = COURSE_DATA.length;

  const progress =
    Math.round(
      (completedCount / totalCourses) * 100
    );

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIcon}>
          ⚛️
        </div>

        <h2>
          Loading Quantum Courses...
        </h2>

        <p>
          Preparing your personalized learning path.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <div style={styles.eyebrow}>
            LEARNING PATH
          </div>

          <h1 style={styles.title}>
            Quantum Computing Courses
          </h1>

          <p style={styles.subtitle}>
            Follow a structured path from Python
            fundamentals to quantum algorithms
            and real projects.
          </p>
        </div>

        <div style={styles.progressCard}>

          <div style={styles.progressNumber}>
            {completedCount}/{totalCourses}
          </div>

          <div style={styles.progressLabel}>
            COURSES COMPLETED
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>

          <strong>
            {progress}%
          </strong>

        </div>

      </div>

      {/* MESSAGES */}

      {message && (
        <div style={styles.success}>
          <span>✓</span>

          <span>
            {message}
          </span>

          <button
            style={styles.close}
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <span>⚠</span>

          <span>
            {error}
          </span>

          <button
            style={styles.close}
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* COURSE LIST */}

      <div style={styles.courseGrid}>

        {COURSE_DATA.map((course) => {

          const status =
            getStatus(course);

          const completed =
            status === "Completed";

          const next =
            status === "Next Skill";

          return (
            <div
              key={course.id}
              style={{
                ...styles.courseCard,
                ...(completed
                  ? styles.completedCard
                  : {}),
                ...(next
                  ? styles.nextCard
                  : {}),
              }}
            >

              <div style={styles.courseTop}>

                <div style={styles.icon}>
                  {course.icon}
                </div>

                <span
                  style={{
                    ...styles.status,
                    ...(completed
                      ? styles.completedStatus
                      : next
                      ? styles.nextStatus
                      : {}),
                  }}
                >
                  {completed
                    ? "✓ COMPLETED"
                    : next
                    ? "● NEXT SKILL"
                    : "UPCOMING"}
                </span>

              </div>

              <div style={styles.courseNumber}>
                MODULE{" "}
                {String(course.id).padStart(2, "0")}
              </div>

              <h2 style={styles.courseTitle}>
                {course.skill}
              </h2>

              <p style={styles.description}>
                {course.description}
              </p>

              <div style={styles.meta}>

                <span>
                  🎯 {course.level}
                </span>

                <span>
                  ⏱ {course.duration}
                </span>

              </div>

              <div style={styles.lessonCount}>
                📖 {course.lessons.length} lessons
              </div>

              <button
                style={
                  completed
                    ? styles.completedButton
                    : styles.primaryButton
                }
                onClick={() =>
                  setSelectedCourse(course)
                }
              >
                {completed
                  ? "Review Course"
                  : "Open Course →"}
              </button>

            </div>
          );
        })}

      </div>

      {/* COURSE MODAL */}

      {selectedCourse && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <button
              style={styles.modalClose}
              onClick={() =>
                setSelectedCourse(null)
              }
            >
              ×
            </button>

            <div style={styles.modalIcon}>
              {selectedCourse.icon}
            </div>

            <div style={styles.eyebrow}>
              MODULE{" "}
              {String(
                selectedCourse.id
              ).padStart(2, "0")}
            </div>

            <h2 style={styles.modalTitle}>
              {selectedCourse.skill}
            </h2>

            <p style={styles.modalDescription}>
              {selectedCourse.description}
            </p>

            <div style={styles.lessonHeader}>
              <strong>
                Course Lessons
              </strong>

              <span>
                {selectedCourse.lessons.length} lessons
              </span>
            </div>

            <div style={styles.lessons}>

              {selectedCourse.lessons.map(
                (lesson, index) => (
                  <div
                    key={lesson}
                    style={styles.lesson}
                  >

                    <span style={styles.lessonNumber}>
                      {index + 1}
                    </span>

                    <span>
                      {lesson}
                    </span>

                  </div>
                )
              )}

            </div>

            <div style={styles.modalActions}>

              <button
                style={styles.secondaryButton}
                onClick={() =>
                  setSelectedCourse(null)
                }
              >
                Close
              </button>

              {!isCompleted(
                selectedCourse.skill
              ) && (
                <button
                  style={{
                    ...styles.primaryButton,
                    ...(saving
                      ? styles.disabledButton
                      : {}),
                  }}
                  disabled={saving}
                  onClick={() =>
                    completeCourse(
                      selectedCourse
                    )
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Mark Course Complete ✓"}
                </button>
              )}

              {isCompleted(
                selectedCourse.skill
              ) && (
                <div style={styles.alreadyComplete}>
                  ✓ Course Completed
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* ============================================================
   INLINE STYLES
   No Course.css required.
============================================================ */

const styles = {

  container: {
    width: "100%",
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
    color: "#a78bfa",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "2px",
    marginBottom: "9px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    lineHeight: 1.2,
  },

  subtitle: {
    color: "#aeb6d0",
    lineHeight: 1.6,
    maxWidth: "700px",
    marginTop: "10px",
  },

  progressCard: {
    minWidth: "190px",
    padding: "20px",
    borderRadius: "18px",
    textAlign: "center",
    background:
      "rgba(255,255,255,0.05)",
    border:
      "1px solid rgba(255,255,255,0.10)",
  },

  progressNumber: {
    fontSize: "28px",
    fontWeight: "900",
  },

  progressLabel: {
    marginTop: "5px",
    fontSize: "10px",
    letterSpacing: "1.5px",
    color: "#9da6c2",
  },

  progressBar: {
    height: "7px",
    marginTop: "14px",
    borderRadius: "10px",
    overflow: "hidden",
    background:
      "rgba(255,255,255,0.10)",
  },

  progressFill: {
    height: "100%",
    borderRadius: "10px",
    background:
      "linear-gradient(90deg,#8b5cf6,#22d3ee)",
    transition: "width .4s ease",
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 16px",
    marginBottom: "20px",
    borderRadius: "12px",
    color: "#86efac",
    background:
      "rgba(34,197,94,.10)",
    border:
      "1px solid rgba(34,197,94,.25)",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 16px",
    marginBottom: "20px",
    borderRadius: "12px",
    color: "#fca5a5",
    background:
      "rgba(239,68,68,.10)",
    border:
      "1px solid rgba(239,68,68,.25)",
  },

  close: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    color: "inherit",
    fontSize: "20px",
    cursor: "pointer",
  },

  courseGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
  },

  courseCard: {
    padding: "23px",
    borderRadius: "20px",
    background:
      "rgba(255,255,255,.045)",
    border:
      "1px solid rgba(255,255,255,.09)",
    boxShadow:
      "0 15px 40px rgba(0,0,0,.16)",
  },

  completedCard: {
    border:
      "1px solid rgba(34,211,238,.30)",
  },

  nextCard: {
    border:
      "1px solid rgba(139,92,246,.40)",
  },

  courseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  icon: {
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    fontSize: "23px",
    background:
      "rgba(139,92,246,.12)",
  },

  status: {
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
    padding: "6px 9px",
    borderRadius: "20px",
    color: "#9da6c2",
    background:
      "rgba(255,255,255,.07)",
  },

  completedStatus: {
    color: "#67e8f9",
    background:
      "rgba(34,211,238,.10)",
  },

  nextStatus: {
    color: "#c4b5fd",
    background:
      "rgba(139,92,246,.13)",
  },

  courseNumber: {
    marginTop: "18px",
    fontSize: "10px",
    letterSpacing: "1.5px",
    fontWeight: "800",
    color: "#7f89a8",
  },

  courseTitle: {
    margin: "8px 0 0",
    fontSize: "20px",
  },

  description: {
    minHeight: "65px",
    color: "#aeb6d0",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  meta: {
    display: "flex",
    gap: "16px",
    color: "#c7cde0",
    fontSize: "11px",
    marginTop: "15px",
  },

  lessonCount: {
    marginTop: "12px",
    color: "#8f99b8",
    fontSize: "11px",
  },

  primaryButton: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "800",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
  },

  completedButton: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    border: "1px solid rgba(34,211,238,.25)",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#67e8f9",
    fontWeight: "800",
    background:
      "rgba(34,211,238,.08)",
  },

  disabledButton: {
    opacity: .6,
    cursor: "wait",
  },

  secondaryButton: {
    padding: "12px 20px",
    border:
      "1px solid rgba(255,255,255,.12)",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#d7dcf0",
    background:
      "rgba(255,255,255,.06)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background:
      "rgba(4,7,18,.82)",
    backdropFilter: "blur(8px)",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "30px",
    borderRadius: "22px",
    background:
      "#10162a",
    border:
      "1px solid rgba(255,255,255,.12)",
    boxShadow:
      "0 30px 100px rgba(0,0,0,.5)",
  },

  modalClose: {
    position: "absolute",
    right: "18px",
    top: "15px",
    border: "none",
    background: "transparent",
    color: "#aeb6d0",
    fontSize: "27px",
    cursor: "pointer",
  },

  modalIcon: {
    fontSize: "38px",
    marginBottom: "15px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "28px",
  },

  modalDescription: {
    color: "#aeb6d0",
    lineHeight: 1.6,
  },

  lessonHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "25px",
    marginBottom: "12px",
  },

  lessons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  lesson: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "10px",
    color: "#d7dcf0",
    background:
      "rgba(255,255,255,.045)",
  },

  lessonNumber: {
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: "#c4b5fd",
    background:
      "rgba(139,92,246,.14)",
    fontSize: "11px",
    fontWeight: "800",
  },

  modalActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
  },

  alreadyComplete: {
    flex: 1,
    padding: "12px",
    textAlign: "center",
    borderRadius: "10px",
    color: "#67e8f9",
    background:
      "rgba(34,211,238,.08)",
    fontWeight: "800",
  },

  loading: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#f5f7ff",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "15px",
  },
};

export default Courses;
