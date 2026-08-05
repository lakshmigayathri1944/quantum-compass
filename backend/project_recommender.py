print("PROJECT RECOMMENDER LOADED 🚀")


# ============================================================
# PROJECT DATABASE
# ============================================================

PROJECTS = [

    {
        "id": 1,
        "project": "Quantum Random Number Generator",
        "level": "Beginner",
        "skills": [
            "Python",
            "Qubits",
            "Superposition",
            "Measurement",
            "Qiskit"
        ]
    },

    {
        "id": 2,
        "project": "Quantum Teleportation",
        "level": "Intermediate",
        "skills": [
            "Qubits",
            "Entanglement",
            "Hadamard Gate",
            "CNOT",
            "Quantum Communication"
        ]
    },

    {
        "id": 3,
        "project": "Grover Search Algorithm",
        "level": "Advanced",
        "skills": [
            "Quantum Algorithms",
            "Oracle",
            "Amplitude Amplification",
            "Qiskit"
        ]
    },

    {
        "id": 4,
        "project": "QAOA Optimization Project",
        "level": "Advanced",
        "skills": [
            "QAOA",
            "Quantum Optimization",
            "Parameterized Circuits",
            "Combinatorial Optimization"
        ]
    },

    {
        "id": 5,
        "project": "Quantum Machine Learning Classifier",
        "level": "Advanced",
        "skills": [
            "Quantum Machine Learning",
            "Feature Encoding",
            "Variational Circuits",
            "Hybrid Quantum-Classical Learning"
        ]
    },

    {
        "id": 6,
        "project": "Quantum Compass Capstone",
        "level": "Advanced",
        "skills": [
            "Flask",
            "React",
            "Quantum Computing",
            "AI",
            "Progress Tracking"
        ]
    }
]


# ============================================================
# LEVEL ORDER
# ============================================================

LEVEL_ORDER = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3
}


# ============================================================
# RECOMMEND PROJECTS
# ============================================================

def recommend_projects(level, goal=None):

    if not level:
        level = "Beginner"

    current_level = LEVEL_ORDER.get(
        str(level).strip().title(),
        1
    )

    recommendations = []

    for project in PROJECTS:

        project_level = LEVEL_ORDER.get(
            project["level"],
            1
        )

        if project_level >= current_level:

            recommendations.append(project)

    return recommendations


# ============================================================
# GET PROJECT BY ID
# ============================================================

def get_project(project_id):

    for project in PROJECTS:

        if project["id"] == project_id:
            return project

    return None


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print(
        recommend_projects("Advanced")
    )

