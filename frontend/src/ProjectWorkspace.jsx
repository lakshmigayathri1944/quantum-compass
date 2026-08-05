import React, { useState } from "react";

const API_URL = "http://127.0.0.1:5000";

const PROJECT_CONTENT = {
  1: {
    title: "Quantum Random Number Generator",
    level: "Beginner",
    duration: "2 Days",
    category: "Quantum Fundamentals",
    description:
      "Build a quantum random number generator using qubit superposition and measurement.",

    objectives: [
      "Understand the basic idea of a qubit",
      "Understand quantum superposition",
      "Learn the Hadamard gate",
      "Perform quantum measurement",
      "Create a simple Qiskit circuit",
    ],

    concepts: [
      {
        title: "Qubit",
        text:
          "A qubit is the basic unit of quantum information. Unlike a classical bit, a qubit can exist in a quantum superposition of 0 and 1.",
      },
      {
        title: "Superposition",
        text:
          "Superposition allows a qubit to have probability amplitudes associated with both |0⟩ and |1⟩ before measurement.",
      },
      {
        title: "Hadamard Gate",
        text:
          "The Hadamard gate creates an equal superposition from the |0⟩ state.",
      },
      {
        title: "Measurement",
        text:
          "When a quantum state is measured, the result becomes a classical value such as 0 or 1.",
      },
    ],

    code: `from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# Create one qubit and one classical bit
circuit = QuantumCircuit(1, 1)

# Put the qubit into superposition
circuit.h(0)

# Measure the qubit
circuit.measure(0, 0)

print(circuit)

# Run the circuit
simulator = AerSimulator()

result = simulator.run(
    circuit,
    shots=1
).result()

counts = result.get_counts()

print("Quantum Random Result:")
print(counts)`,

    steps: [
      "Install Python and Qiskit",
      "Create a one-qubit quantum circuit",
      "Apply the Hadamard gate",
      "Measure the qubit",
      "Run the circuit using AerSimulator",
      "Observe the random measurement result",
    ],

    challenge:
      "Modify the program to generate 10 quantum random measurements and count how many 0s and 1s are produced.",
  },

  2: {
    title: "Quantum Teleportation",
    level: "Intermediate",
    duration: "4 Days",
    category: "Quantum Communication",
    description:
      "Implement a quantum teleportation circuit and understand how an unknown quantum state can be transferred.",

    objectives: [
      "Understand quantum entanglement",
      "Learn the role of CNOT",
      "Understand classical communication",
      "Build a teleportation circuit",
      "Understand quantum state transfer",
    ],

    concepts: [
      {
        title: "Entanglement",
        text:
          "Entanglement creates strong correlations between quantum systems that cannot be explained by classical states.",
      },
      {
        title: "CNOT",
        text:
          "The controlled-NOT gate is commonly used to create and manipulate entangled quantum states.",
      },
      {
        title: "Quantum Teleportation",
        text:
          "Quantum teleportation transfers an unknown quantum state using entanglement and classical information.",
      },
    ],

    code: `from qiskit import QuantumCircuit

circuit = QuantumCircuit(3, 3)

# Create entanglement
circuit.h(1)
circuit.cx(1, 2)

# Prepare the state to teleport
circuit.h(0)

# Bell measurement
circuit.cx(0, 1)
circuit.h(0)

print(circuit)`,
    
    steps: [
      "Create three qubits",
      "Create an entangled pair",
      "Prepare the state to teleport",
      "Perform the Bell measurement",
      "Apply the required correction operations",
      "Measure the destination qubit",
    ],

    challenge:
      "Draw the teleportation circuit and explain the purpose of every gate.",
  },

  3: {
    title: "Grover Search Algorithm",
    level: "Advanced",
    duration: "5 Days",
    category: "Quantum Algorithms",
    description:
      "Build a small quantum search algorithm using Grover's algorithm.",

    objectives: [
      "Understand quantum search",
      "Understand an oracle",
      "Learn amplitude amplification",
      "Implement a small Grover circuit",
      "Compare quantum and classical search",
    ],

    concepts: [
      {
        title: "Oracle",
        text:
          "An oracle marks the solution state so that the amplitude amplification procedure can increase its probability.",
      },
      {
        title: "Amplitude Amplification",
        text:
          "Grover's algorithm increases the probability of measuring the desired solution.",
      },
    ],

    code: `from qiskit import QuantumCircuit

circuit = QuantumCircuit(2, 2)

# Create superposition
circuit.h(0)
circuit.h(1)

# Example oracle
circuit.cz(0, 1)

# Diffusion operator
circuit.h(0)
circuit.h(1)
circuit.x(0)
circuit.x(1)
circuit.h(1)
circuit.cz(0, 1)
circuit.h(1)
circuit.x(0)
circuit.x(1)
circuit.h(0)
circuit.h(1)

circuit.measure([0, 1], [0, 1])

print(circuit)`,

    steps: [
      "Create a two-qubit circuit",
      "Create a uniform superposition",
      "Implement an oracle",
      "Apply amplitude amplification",
      "Measure the result",
      "Compare with classical search",
    ],

    challenge:
      "Change the oracle so that a different state is marked.",
  },

  4: {
    title: "QAOA Optimization Project",
    level: "Advanced",
    duration: "7 Days",
    category: "Quantum Optimization",
    description:
      "Solve a small combinatorial optimization problem using QAOA.",

    objectives: [
      "Understand optimization problems",
      "Understand QAOA",
      "Learn parameterized circuits",
      "Understand cost functions",
      "Explore quantum optimization",
    ],

    concepts: [
      {
        title: "QAOA",
        text:
          "The Quantum Approximate Optimization Algorithm combines parameterized quantum circuits with classical optimization.",
      },
      {
        title: "Parameterized Circuit",
        text:
          "Parameterized circuits contain adjustable values that can be optimized to improve a target objective.",
      },
    ],

    code: `# QAOA learning example

from qiskit import QuantumCircuit

circuit = QuantumCircuit(2)

# Initial superposition
circuit.h(0)
circuit.h(1)

# Example parameterized structure
circuit.cx(0, 1)

print(circuit)
print("QAOA circuit created.")`,

    steps: [
      "Define the optimization problem",
      "Create the initial quantum state",
      "Build the cost Hamiltonian",
      "Build the mixer circuit",
      "Optimize the parameters",
      "Evaluate the solution",
    ],

    challenge:
      "Explain why QAOA requires both quantum and classical computation.",
  },

  5: {
    title: "Quantum Machine Learning Classifier",
    level: "Advanced",
    duration: "7 Days",
    category: "Quantum AI",
    description:
      "Create a simple hybrid quantum-classical machine learning classifier.",

    objectives: [
      "Understand quantum feature encoding",
      "Understand variational circuits",
      "Build a simple classifier",
      "Understand hybrid learning",
      "Explore quantum machine learning",
    ],

    concepts: [
      {
        title: "Feature Encoding",
        text:
          "Classical data must be encoded into quantum states before quantum processing can be performed.",
      },
      {
        title: "Variational Circuit",
        text:
          "A variational circuit contains trainable parameters that can be optimized using classical algorithms.",
      },
    ],

    code: `# Quantum ML learning structure

from qiskit import QuantumCircuit

circuit = QuantumCircuit(2)

# Feature encoding example
circuit.ry(0.5, 0)
circuit.ry(1.0, 1)

# Variational layer
circuit.cx(0, 1)
circuit.ry(0.7, 0)
circuit.ry(0.9, 1)

print(circuit)
print("Hybrid quantum-classical circuit ready.")`,

    steps: [
      "Prepare a small dataset",
      "Normalize the classical features",
      "Encode features into qubits",
      "Create a variational circuit",
      "Measure the quantum circuit",
      "Use a classical optimizer",
    ],

    challenge:
      "Explain how classical machine learning and quantum circuits can work together.",
  },

  6: {
    title: "Quantum Compass Capstone",
    level: "Advanced",
    duration: "10 Days",
    category: "Portfolio Project",
    description:
      "Build a complete quantum learning application combining AI guidance, quantum education, progress tracking and practical projects.",

    objectives: [
      "Build a complete full-stack application",
      "Connect React with Flask",
      "Use SQLite for persistence",
      "Create quantum learning modules",
      "Implement progress tracking",
      "Build an AI mentor experience",
    ],

    concepts: [
      {
        title: "Full-Stack Architecture",
        text:
          "A modern application can combine a React frontend, Flask backend and SQLite database.",
      },
      {
        title: "Quantum Education Platform",
        text:
          "Quantum Compass combines learning content, projects, analytics and AI mentorship into one platform.",
      },
    ],

    code: `# Quantum Compass Capstone

print("Quantum Compass")
print("----------------")
print("Learn Quantum Computing")
print("Build Projects")
print("Track Progress")
print("Use AI Mentorship")

print()
print("Capstone architecture:")
print("React -> Flask API -> SQLite")
print("        -> AI Mentor")
print("        -> Project Tracking")`,

    steps: [
      "Design the application architecture",
      "Create the React frontend",
      "Create Flask REST APIs",
      "Connect SQLite database",
      "Implement learning progress",
      "Implement project tracking",
      "Add AI mentor functionality",
      "Test the complete application",
    ],

    challenge:
      "Demonstrate the complete Quantum Compass platform and explain how its frontend, backend, database and AI features work together.",
  },
};

function ProjectWorkspace({ project, onBack, onCompleted }) {
  const projectId = Number(project?.id);
  const content =
    PROJECT_CONTENT[projectId] ||
    PROJECT_CONTENT[1];

  const [activeTab, setActiveTab] = useState("overview");
  const [checked, setChecked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const objectives = content.objectives || [];
  const allChecked =
    objectives.length > 0 &&
    checked.length === objectives.length;

  function toggleObjective(index) {
    setChecked((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }

      return [...current, index];
    });
  }

  async function completeProject() {
    if (!allChecked) {
      setError(
        "Complete all learning objectives before submitting the project."
      );
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const userId =
        localStorage.getItem("user_id") || "1";

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
          data.message ||
            "Unable to complete project."
        );
      }

      setMessage(
        data.message ||
          "Project completed successfully!"
      );

      setTimeout(() => {
        if (onCompleted) {
          onCompleted();
        } else if (onBack) {
          onBack();
        }
      }, 900);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to complete project."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>

      <button
        style={styles.backButton}
        onClick={onBack}
      >
        ← Back to Project Lab
      </button>

      <div style={styles.hero}>

        <div>
          <div style={styles.eyebrow}>
            PROJECT {String(projectId).padStart(2, "0")}
          </div>

          <h1 style={styles.title}>
            {content.title}
          </h1>

          <p style={styles.description}>
            {content.description}
          </p>

          <div style={styles.meta}>
            <span>🎯 {content.level}</span>
            <span>⏱ {content.duration}</span>
            <span>📚 {content.category}</span>
          </div>
        </div>

        <div style={styles.orb}>
          ⚛
        </div>

      </div>

      <div style={styles.tabs}>

        {[
          ["overview", "Overview"],
          ["concepts", "Concepts"],
          ["steps", "Learning Path"],
          ["code", "Qiskit Code"],
          ["challenge", "Challenge"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setError("");
            }}
            style={{
              ...styles.tab,
              ...(activeTab === id
                ? styles.activeTab
                : {}),
            }}
          >
            {label}
          </button>
        ))}

      </div>

      {message && (
        <div style={styles.success}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={styles.error}>
          ⚠ {error}
        </div>
      )}

      <div style={styles.contentCard}>

        {activeTab === "overview" && (
          <>
            <div style={styles.eyebrow}>
              PROJECT OVERVIEW
            </div>

            <h2 style={styles.sectionTitle}>
              What you will learn
            </h2>

            <p style={styles.text}>
              Complete the learning objectives below,
              study the project concepts and then
              complete the practical challenge.
            </p>

            <div style={styles.objectives}>
              {objectives.map((objective, index) => (
                <button
                  key={objective}
                  onClick={() =>
                    toggleObjective(index)
                  }
                  style={{
                    ...styles.objective,
                    ...(checked.includes(index)
                      ? styles.objectiveDone
                      : {}),
                  }}
                >
                  <span>
                    {checked.includes(index)
                      ? "✓"
                      : index + 1}
                  </span>

                  {objective}
                </button>
              ))}
            </div>
          </>
        )}

        {activeTab === "concepts" && (
          <>
            <div style={styles.eyebrow}>
              CORE CONCEPTS
            </div>

            <h2 style={styles.sectionTitle}>
              Understand the theory
            </h2>

            <div style={styles.conceptGrid}>
              {content.concepts.map(
                (concept) => (
                  <div
                    key={concept.title}
                    style={styles.concept}
                  >
                    <h3>
                      {concept.title}
                    </h3>

                    <p style={styles.text}>
                      {concept.text}
                    </p>
                  </div>
                )
              )}
            </div>
          </>
        )}

        {activeTab === "steps" && (
          <>
            <div style={styles.eyebrow}>
              STEP-BY-STEP
            </div>

            <h2 style={styles.sectionTitle}>
              Project Learning Path
            </h2>

            <div style={styles.steps}>
              {content.steps.map(
                (step, index) => (
                  <div
                    key={step}
                    style={styles.step}
                  >
                    <div style={styles.stepNumber}>
                      {index + 1}
                    </div>

                    <div>
                      <strong>
                        Step {index + 1}
                      </strong>

                      <p style={styles.text}>
                        {step}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}

        {activeTab === "code" && (
          <>
            <div style={styles.eyebrow}>
              PRACTICAL CODING
            </div>

            <h2 style={styles.sectionTitle}>
              Qiskit Code
            </h2>

            <p style={styles.text}>
              Study the following implementation.
              You can copy it into your local Python
              environment and experiment with it.
            </p>

            <pre style={styles.code}>
              {content.code}
            </pre>
          </>
        )}

        {activeTab === "challenge" && (
          <>
            <div style={styles.eyebrow}>
              PRACTICAL CHALLENGE
            </div>

            <h2 style={styles.sectionTitle}>
              Your Challenge
            </h2>

            <div style={styles.challenge}>
              🎯 {content.challenge}
            </div>

            <p style={styles.text}>
              Complete the challenge, review the
              learning objectives and submit the
              project when you are ready.
            </p>

            <div style={styles.submitArea}>

              <div>
                <strong>
                  {checked.length}/{objectives.length}
                </strong>

                <span>
                  {" "}
                  learning objectives completed
                </span>
              </div>

              <button
                style={{
                  ...styles.completeButton,
                  ...(busy || !allChecked
                    ? styles.disabled
                    : {}),
                }}
                disabled={busy || !allChecked}
                onClick={completeProject}
              >
                {busy
                  ? "Submitting..."
                  : "Complete Project ✓"}
              </button>

            </div>
          </>
        )}

      </div>

      <div style={styles.bottomNavigation}>

        <button
          style={styles.secondaryButton}
          onClick={() => {
            const tabs = [
              "overview",
              "concepts",
              "steps",
              "code",
              "challenge",
            ];

            const current =
              tabs.indexOf(activeTab);

            if (current > 0) {
              setActiveTab(tabs[current - 1]);
            }
          }}
        >
          ← Previous
        </button>

        <button
          style={styles.primaryButton}
          onClick={() => {
            const tabs = [
              "overview",
              "concepts",
              "steps",
              "code",
              "challenge",
            ];

            const current =
              tabs.indexOf(activeTab);

            if (current < tabs.length - 1) {
              setActiveTab(tabs[current + 1]);
            } else {
              setError(
                allChecked
                  ? ""
                  : "Complete all learning objectives first."
              );
            }
          }}
        >
          Continue →
        </button>

      </div>

    </div>
  );
}

const styles = {
  page: {
    width: "100%",
    color: "#f5f7ff",
    paddingBottom: "40px",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#a78bfa",
    cursor: "pointer",
    fontWeight: "700",
    padding: "8px 0",
    marginBottom: "18px",
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "30px",
    padding: "30px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(124,58,237,.18), rgba(8,145,178,.10))",
    border:
      "1px solid rgba(255,255,255,.10)",
  },

  eyebrow: {
    color: "#a78bfa",
    fontSize: "11px",
    fontWeight: "900",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    lineHeight: 1.2,
  },

  description: {
    color: "#b7bfd8",
    maxWidth: "750px",
    lineHeight: 1.7,
    marginTop: "12px",
  },

  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
  },

  orb: {
    width: "100px",
    height: "100px",
    minWidth: "100px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "42px",
    background:
      "radial-gradient(circle, rgba(139,92,246,.45), rgba(8,145,178,.12))",
    border:
      "1px solid rgba(167,139,250,.35)",
  },

  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    margin: "20px 0",
  },

  tab: {
    border: "1px solid rgba(255,255,255,.10)",
    background: "rgba(255,255,255,.045)",
    color: "#aeb6d0",
    padding: "10px 15px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },

  activeTab: {
    color: "#fff",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
  },

  contentCard: {
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,.045)",
    border:
      "1px solid rgba(255,255,255,.09)",
  },

  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "26px",
  },

  text: {
    color: "#aeb6d0",
    lineHeight: 1.7,
  },

  objectives: {
    display: "grid",
    gap: "10px",
    marginTop: "22px",
  },

  objective: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textAlign: "left",
    border:
      "1px solid rgba(255,255,255,.08)",
    background:
      "rgba(255,255,255,.035)",
    color: "#e5e7f2",
    padding: "15px",
    borderRadius: "12px",
    cursor: "pointer",
  },

  objectiveDone: {
    border:
      "1px solid rgba(34,211,238,.30)",
    background:
      "rgba(34,211,238,.08)",
  },

  conceptGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  concept: {
    padding: "20px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,.035)",
    border:
      "1px solid rgba(255,255,255,.08)",
  },

  steps: {
    display: "grid",
    gap: "15px",
    marginTop: "20px",
  },

  step: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },

  stepNumber: {
    width: "35px",
    height: "35px",
    minWidth: "35px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
    fontWeight: "900",
  },

  code: {
    marginTop: "20px",
    padding: "22px",
    borderRadius: "14px",
    background: "#080b16",
    border:
      "1px solid rgba(255,255,255,.10)",
    color: "#dbeafe",
    overflowX: "auto",
    lineHeight: 1.6,
    fontSize: "13px",
  },

  challenge: {
    marginTop: "20px",
    padding: "22px",
    borderRadius: "15px",
    background:
      "rgba(124,58,237,.12)",
    border:
      "1px solid rgba(139,92,246,.25)",
    color: "#ddd6fe",
    lineHeight: 1.7,
  },

  submitArea: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,.04)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  completeButton: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 20px",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
  },

  disabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },

  bottomNavigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    gap: "12px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    color: "#fff",
    fontWeight: "800",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#7c3aed,#0891b2)",
  },

  secondaryButton: {
    border:
      "1px solid rgba(255,255,255,.12)",
    borderRadius: "10px",
    padding: "12px 20px",
    color: "#d1d5e5",
    background:
      "rgba(255,255,255,.05)",
    cursor: "pointer",
    fontWeight: "700",
  },

  success: {
    padding: "13px 16px",
    marginBottom: "15px",
    borderRadius: "10px",
    background:
      "rgba(34,197,94,.10)",
    border:
      "1px solid rgba(34,197,94,.25)",
    color: "#86efac",
  },

  error: {
    padding: "13px 16px",
    marginBottom: "15px",
    borderRadius: "10px",
    background:
      "rgba(245,158,11,.10)",
    border:
      "1px solid rgba(245,158,11,.25)",
    color: "#fcd34d",
  },
};

export default ProjectWorkspace;
