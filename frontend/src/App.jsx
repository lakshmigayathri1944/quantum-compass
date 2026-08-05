import React, { useEffect, useState } from "react";
import "./App.css";

import Login from "./Login";
import Analytics from "./Analytics";
import Projects from "./Projects";
import ChatBot from "./ChatBot";

const API_URL = "http://127.0.0.1:5000";

/* =========================================================
   SAFE COMPONENT ERROR BOUNDARY
   ========================================================= */

class SafeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "Quantum Compass component error:",
      error
    );

    console.error(
      "Component information:",
      info
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-box">
          <h3>Module temporarily unavailable</h3>

          <p>
            This section could not be displayed.
            The rest of Quantum Compass is still available.
          </p>

          <button
            className="button-secondary"
            onClick={() =>
              this.setState({
                hasError: false,
              })
            }
          >
            ↻ Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   MAIN APPLICATION
   ========================================================= */

function App() {
  const [user, setUser] = useState(
    localStorage.getItem("user_id")
  );

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [activeSection, setActiveSection] =
    useState("dashboard");

  /* =======================================================
     LOAD DASHBOARD
     ======================================================= */

  async function loadDashboard() {
    if (!user) {
      return;
    }

    const userId = Number(user);

    if (!Number.isInteger(userId) || userId <= 0) {
      setMessage("Invalid user ID.");
      setDashboard(null);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/dashboard/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          `Dashboard request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Quantum Compass Dashboard:",
        data
      );

      if (
        data.status &&
        data.status !== "success"
      ) {
        throw new Error(
          data.message ||
            "Unable to load dashboard."
        );
      }

      setDashboard(data);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setDashboard(null);

      setMessage(
        error.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     LOAD DASHBOARD WHEN USER EXISTS
     ======================================================= */

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  /* =======================================================
     LOGIN
     ======================================================= */

  function handleLogin(userId) {
    if (!userId) {
      return;
    }

    const id = String(userId);

    localStorage.setItem(
      "user_id",
      id
    );

    setUser(id);

    setDashboard(null);

    setMessage("");

    setActiveSection("dashboard");
  }

  /* =======================================================
     LOGOUT
     ======================================================= */

  function logout() {
    localStorage.removeItem(
      "user_id"
    );

    setUser(null);

    setDashboard(null);

    setMessage("");

    setActiveSection(
      "dashboard"
    );
  }

  /* =======================================================
     COMPLETE SKILL
     ======================================================= */

  async function completeSkill(skill) {
    if (!user || !skill) {
      return;
    }

    try {
      setMessage(
        `Updating ${skill}...`
      );

      const response = await fetch(
        `${API_URL}/progress`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: Number(user),
            skill: skill,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Progress response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update progress."
        );
      }

      setMessage(
        data.message ||
          `${skill} completed successfully.`
      );

      await loadDashboard();
    } catch (error) {
      console.error(
        "Progress error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to update skill."
      );
    }
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function navigate(section) {
    setActiveSection(section);

    setTimeout(() => {
      const element =
        document.getElementById(
          section
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  }

  /* =======================================================
     LOGIN SCREEN
     ======================================================= */

  if (!user) {
    return (
      <Login
        setUser={handleLogin}
      />
    );
  }

  /* =======================================================
     LOADING SCREEN
     ======================================================= */

  if (
    loading &&
    !dashboard
  ) {
    return (
      <div className="app-loading">
        <div className="loading-card">

          <div className="loading-orb">
            ⚛
          </div>

          <h1>
            Quantum Compass
          </h1>

          <p>
            Preparing your personalized
            quantum dashboard...
          </p>

          <div className="loading-line">
            <span />
          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     DASHBOARD ERROR
     ======================================================= */

  if (!dashboard) {
    return (
      <div className="app-loading">

        <div className="error-card">

          <div className="error-symbol">
            !
          </div>

          <h1>
            Dashboard unavailable
          </h1>

          <p>
            {message ||
              "Unable to load your dashboard."}
          </p>

          <div className="error-actions">

            <button
              className="button-primary"
              onClick={loadDashboard}
            >
              ↻ Try Again
            </button>

            <button
              className="button-secondary"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     SAFE DASHBOARD DATA
     ======================================================= */

  const analytics =
    dashboard.analytics || {};

  const completedSkills =
    Array.isArray(
      dashboard.completed_skills
    )
      ? dashboard.completed_skills
      : [];

  const learningPath =
    Array.isArray(
      dashboard.learning_path
    )
      ? dashboard.learning_path
      : [];

  const completedCount =
    Number(
      analytics.completed_skills
    ) ||
    completedSkills.length;

  const totalSkills =
    Number(
      analytics.total_skills
    ) ||
    learningPath.length ||
    0;

  let progressValue = Number(
    String(
      analytics.progress || "0"
    ).replace("%", "")
  );

  if (
    !Number.isFinite(
      progressValue
    )
  ) {
    progressValue = 0;
  }

  const safeProgress =
    Math.min(
      100,
      Math.max(
        0,
        progressValue
      )
    );

  const progress =
    `${safeProgress}%`;

  const level =
    analytics.level ||
    "Beginner";

  /* =======================================================
     NEXT SKILL
     ======================================================= */

  const nextSkill =
    learningPath.find(
      (item) =>
        item &&
        item.status ===
          "Next Skill"
    ) || null;

  const roadmapComplete =
    totalSkills > 0 &&
    completedCount >=
      totalSkills;

  /* =======================================================
     COURSE DATA
     Built directly into App.jsx.
     No Courses.jsx dependency.
     ======================================================= */

  const courses = [
    {
      number: "01",
      title: "Python Basics",
      level: "Beginner",
      duration: "2 Weeks",
      description:
        "Learn Python programming fundamentals required for quantum computing.",
    },

    {
      number: "02",
      title: "Linear Algebra Basics",
      level: "Beginner",
      duration: "2 Weeks",
      description:
        "Understand vectors, matrices, complex numbers and mathematical foundations.",
    },

    {
      number: "03",
      title: "Quantum Fundamentals",
      level: "Beginner",
      duration: "2 Weeks",
      description:
        "Learn qubits, superposition, measurement and quantum states.",
    },

    {
      number: "04",
      title: "Qubits",
      level: "Beginner",
      duration: "1 Week",
      description:
        "Understand qubit representation, Bloch sphere and quantum states.",
    },

    {
      number: "05",
      title: "Quantum Gates",
      level: "Intermediate",
      duration: "2 Weeks",
      description:
        "Learn X, Y, Z, Hadamard, CNOT and other quantum operations.",
    },

    {
      number: "06",
      title: "Qiskit Programming",
      level: "Intermediate",
      duration: "2 Weeks",
      description:
        "Build and simulate quantum circuits using Qiskit.",
    },

    {
      number: "07",
      title: "Grover Algorithm",
      level: "Intermediate",
      duration: "1 Week",
      description:
        "Understand quantum search and amplitude amplification.",
    },

    {
      number: "08",
      title: "QAOA",
      level: "Advanced",
      duration: "2 Weeks",
      description:
        "Explore quantum approximate optimization for real-world problems.",
    },

    {
      number: "09",
      title: "Quantum Projects",
      level: "Advanced",
      duration: "3 Weeks",
      description:
        "Build practical portfolio projects using quantum algorithms.",
    },
  ];

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="app">

      {/* BACKGROUND */}

      <div className="ambient ambient-one" />

      <div className="ambient ambient-two" />

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-mark">
            ⚛
          </div>

          <div>

            <strong>
              Quantum Compass
            </strong>

            <span>
              AI Learning Platform
            </span>

          </div>

        </div>

        <div className="sidebar-section">

          <span className="sidebar-label">
            WORKSPACE
          </span>

          <button
            className={
              activeSection ===
              "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate(
                "dashboard"
              )
            }
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              activeSection ===
              "courses"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate(
                "courses"
              )
            }
          >
            <span>📚</span>
            Courses
          </button>

          <button
            className={
              activeSection ===
              "analytics"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate(
                "analytics"
              )
            }
          >
            <span>◫</span>
            Analytics
          </button>

          <button
            className={
              activeSection ===
              "projects"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate(
                "projects"
              )
            }
          >
            <span>◈</span>
            Project Lab
          </button>

          <button
            className={
              activeSection ===
              "mentor"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              navigate(
                "mentor"
              )
            }
          >
            <span>✦</span>
            AI Mentor
          </button>

        </div>

        <div className="sidebar-specialization">

          <span className="mini-icon">
            ✦
          </span>

          <div>

            <strong>
              Advanced Mode
            </strong>

            <p>
              Core roadmap available
            </p>

          </div>

        </div>

        <div className="sidebar-footer">

          <span>
            ⚛ Quantum Compass AI
          </span>

          <small>
            Learn • Build • Innovate
          </small>

        </div>

      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="main-area">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="mobile-brand">

            <div className="brand-mark small">
              ⚛
            </div>

            <strong>
              Quantum Compass
            </strong>

          </div>

          <div className="topbar-right">

            <div className="status-pill">

              <span />

              AI Mentor Online

            </div>

            <div className="user-profile">

              <div className="avatar">
                👩‍💻
              </div>

              <div>

                <strong>
                  {dashboard.user ||
                    "Quantum Explorer"}
                </strong>

                <span>
                  {dashboard.role ||
                    "Quantum Learner"}
                </span>

              </div>

            </div>

            <button
              className="logout"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="content">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <section
            id="dashboard"
            className="section"
          >

            <div className="hero">

              <div className="hero-left">

                <div className="hero-badge">

                  <span>
                    ●
                  </span>

                  YOUR QUANTUM JOURNEY

                </div>

                <h1>

                  Welcome back,{" "}

                  <span>
                    {dashboard.user ||
                      "Explorer"}
                  </span>

                </h1>

                <p>
                  Your quantum learning journey
                  starts here. Learn fundamentals,
                  build practical projects and
                  develop career-ready quantum
                  computing skills.
                </p>

                <div className="hero-buttons">

                  <button
                    className="button-primary"
                    onClick={() =>
                      navigate(
                        roadmapComplete
                          ? "projects"
                          : "courses"
                      )
                    }
                  >
                    {roadmapComplete
                      ? "Explore Projects →"
                      : "Continue Learning →"}
                  </button>

                  <button
                    className="button-secondary"
                    onClick={() =>
                      navigate(
                        "analytics"
                      )
                    }
                  >
                    View Analytics
                  </button>

                </div>

              </div>

              <div className="quantum-visual">

                <div className="quantum-core">
                  ⚛
                </div>

                <div className="quantum-ring ring-a" />

                <div className="quantum-ring ring-b" />

                <div className="quantum-ring ring-c" />

                <span className="particle p1" />

                <span className="particle p2" />

                <span className="particle p3" />

              </div>

            </div>

            {/* MESSAGE */}

            {message && (
              <div className="notification">

                <span>
                  ⓘ
                </span>

                <p>
                  {message}
                </p>

                <button
                  onClick={() =>
                    setMessage("")
                  }
                >
                  ×
                </button>

              </div>
            )}

            {/* STATS */}

            <div className="stats">

              <div className="stat-card">

                <div className="stat-icon purple">
                  ◫
                </div>

                <div>

                  <span>
                    Overall Progress
                  </span>

                  <strong>
                    {progress}
                  </strong>

                  <small>
                    Learning completion
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon cyan">
                  ✓
                </div>

                <div>

                  <span>
                    Skills Mastered
                  </span>

                  <strong>
                    {completedCount}

                    <em>
                      /{totalSkills}
                    </em>
                  </strong>

                  <small>
                    Core competencies
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon green">
                  ★
                </div>

                <div>

                  <span>
                    Current Level
                  </span>

                  <strong>
                    {level}
                  </strong>

                  <small>
                    Quantum expertise
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">
                  ⚡
                </div>

                <div>

                  <span>
                    Next Focus
                  </span>

                  <strong className="stat-small">
                    {nextSkill?.skill ||
                      "Python Basics"}
                  </strong>

                  <small>
                    AI recommendation
                  </small>

                </div>

              </div>

            </div>

            {/* ROADMAP */}

            <div
              id="roadmap"
              className="panel roadmap-panel"
            >

              <div className="panel-header">

                <div>

                  <span className="eyebrow">
                    LEARNING ROADMAP
                  </span>

                  <h2>
                    Your Quantum Foundation
                  </h2>

                  <p>
                    Follow your personalized
                    learning path step by step.
                  </p>

                </div>

                <div className="completion-ring">

                  <strong>
                    {progress}
                  </strong>

                  <span>
                    complete
                  </span>

                </div>

              </div>

              <div className="roadmap-modern">

                {learningPath.length === 0 ? (

                  <div className="empty-box">

                    <h3>
                      No roadmap available
                    </h3>

                    <p>
                      Your personalized
                      roadmap is being prepared.
                    </p>

                  </div>

                ) : (

                  learningPath.map(
                    (item, index) => {

                      const skill =
                        item?.skill ||
                        "Quantum Skill";

                      const status =
                        item?.status ||
                        "Pending";

                      const completed =
                        status ===
                        "Completed";

                      const next =
                        status ===
                        "Next Skill";

                      return (
                        <div
                          className={
                            `roadmap-node ${
                              completed
                                ? "done"
                                : next
                                ? "current"
                                : "locked"
                            }`
                          }
                          key={
                            `${skill}-${index}`
                          }
                        >

                          <div className="node-marker">

                            {completed
                              ? "✓"
                              : index + 1}

                          </div>

                          <div className="node-content">

                            <span>

                              {completed
                                ? "MASTERED"
                                : next
                                ? "CURRENT"
                                : "UPCOMING"}

                            </span>

                            <h3>
                              {skill}
                            </h3>

                          </div>

                          {next && (

                            <button
                              className="node-action"
                              onClick={() =>
                                completeSkill(
                                  skill
                                )
                              }
                            >
                              Complete
                            </button>

                          )}

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </div>

            {/* SPECIALIZATION */}

            <div className="specialization">

              <div className="specialization-content">

                <div className="specialization-badge">
                  ✦ QUANTUM COMPASS PATH
                </div>

                <h2>
                  Build your quantum career.
                </h2>

                <p>
                  Complete courses, practice
                  algorithms and build portfolio
                  projects. Progress from
                  fundamentals to advanced
                  quantum computing.
                </p>

                <div className="specialization-grid">

                  <div>
                    <span>01</span>

                    <strong>
                      Quantum Fundamentals
                    </strong>
                  </div>

                  <div>
                    <span>02</span>

                    <strong>
                      Quantum Algorithms
                    </strong>
                  </div>

                  <div>
                    <span>03</span>

                    <strong>
                      Quantum Machine Learning
                    </strong>
                  </div>

                  <div>
                    <span>04</span>

                    <strong>
                      Real Projects
                    </strong>
                  </div>

                </div>

              </div>

              <div className="specialization-orb">
                ⚛
              </div>

            </div>

          </section>

          {/* =================================================
              COURSES
          ================================================= */}

          <section
            id="courses"
            className="section"
          >

            <div className="section-title">

              <span className="eyebrow">
                LEARN
              </span>

              <h2>
                Quantum Courses
              </h2>

              <p>
                Follow the complete learning
                path from Python to quantum
                projects.
              </p>

            </div>

            <div className="course-grid">

              {courses.map(
                (course) => (

                  <div
                    className="panel"
                    key={
                      course.number
                    }
                  >

                    <div className="course-number">
                      {course.number}
                    </div>

                    <span className="eyebrow">
                      {course.level}
                    </span>

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.description}
                    </p>

                    <small>
                      ⏱ {course.duration}
                    </small>

                    <br />

                    <button
                      className="button-primary"
                      onClick={() =>
                        setMessage(
                          `${course.title} selected.`
                        )
                      }
                    >
                      Start Course →
                    </button>

                  </div>

                )
              )}

            </div>

          </section>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <section
            id="analytics"
            className="section"
          >

            <div className="section-title">

              <span className="eyebrow">
                INTELLIGENCE
              </span>

              <h2>
                Learning Analytics
              </h2>

              <p>
                Understand your learning
                progress and next direction.
              </p>

            </div>

            <SafeComponent>

              <Analytics />

            </SafeComponent>

          </section>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <section
            id="projects"
            className="section"
          >

            <div className="section-title">

              <span className="eyebrow">
                BUILD & PRACTICE
              </span>

              <h2>
                Quantum Project Lab
              </h2>

              <p>
                Turn your quantum knowledge
                into portfolio-ready work.
              </p>

            </div>

            <SafeComponent>

              <Projects />

            </SafeComponent>

          </section>

          {/* =================================================
              AI MENTOR
          ================================================= */}

          <section
            id="mentor"
            className="section"
          >

            <div className="section-title">

              <span className="eyebrow">
                INTELLIGENT MENTORSHIP
              </span>

              <h2>
                Quantum AI Mentor
              </h2>

              <p>
                Get help with quantum computing,
                Qiskit, algorithms, projects
                and careers.
              </p>

            </div>

            <SafeComponent>

              <div className="mentor-wrapper">

                <ChatBot />

              </div>

            </SafeComponent>

          </section>

        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="footer">

          <div>

            <strong>
              ⚛ Quantum Compass AI
            </strong>

            <span>
              AI-powered quantum learning
            </span>

          </div>

          <span>
            Learn • Build • Explore • Innovate
          </span>

        </footer>

      </div>

    </div>
  );
}

/* =========================================================
   ROOT ERROR BOUNDARY
   ========================================================= */

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(
    error,
    errorInfo
  ) {
    console.error(
      "Quantum Compass fatal error:",
      error
    );

    console.error(
      "Error information:",
      errorInfo
    );
  }

  render() {

    if (
      this.state.hasError
    ) {

      return (
        <div className="app-loading">

          <div className="error-card">

            <div className="error-symbol">
              ⚠
            </div>

            <h1>
              Something went wrong
            </h1>

            <p>
              Quantum Compass encountered
              an unexpected error.
            </p>

            <button
              className="button-primary"
              onClick={() =>
                window.location.reload()
              }
            >
              ↻ Reload Application
            </button>

          </div>

        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   EXPORT
   ========================================================= */

export default function QuantumCompassApp() {

  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}

