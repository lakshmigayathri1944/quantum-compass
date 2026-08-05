from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
import os

# ============================================================
# OPTIONAL MODULES
# ============================================================

try:
    from database import DATABASE
except Exception:
    DATABASE = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "quantum_compass.db"
    )

try:
    from progress_model import get_progress
except Exception:
    get_progress = None

try:
    from project_recommender import recommend_projects
except Exception:
    recommend_projects = None


# ============================================================
# APP
# ============================================================

app = Flask(__name__)
CORS(app)

DATABASE = os.path.abspath(DATABASE)


# ============================================================
# DATABASE
# ============================================================

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_database():

    conn = get_db()

    # USERS
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            name TEXT,
            goal TEXT
        )
    """)

    # STUDENTS
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            email TEXT,
            goal TEXT
        )
    """)

    # IMPORTANT:
    # This schema matches your EXISTING database.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skill_name TEXT,
            status TEXT NOT NULL DEFAULT 'Completed',
            completion_date TEXT,
            skill TEXT
        )
    """)

    # PROJECT PROGRESS
    conn.execute("""
        CREATE TABLE IF NOT EXISTS project_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'Started',
            started_at TEXT,
            completed_at TEXT,
            UNIQUE(user_id, project_id)
        )
    """)

    conn.commit()
    conn.close()

    print("✅ Database initialized successfully.")
    print(f"📁 Database: {DATABASE}")


initialize_database()


# ============================================================
# SKILLS
# ============================================================

SKILLS = [
    "Python Basics",
    "Linear Algebra Basics",
    "Quantum Fundamentals",
    "Qubits",
    "Quantum Gates",
    "Qiskit Programming",
    "Grover Algorithm",
    "QAOA",
    "Quantum Projects"
]


# ============================================================
# PROJECTS
# ============================================================

PROJECTS = [

    {
        "id": 1,
        "title": "Quantum Random Number Generator",
        "description": (
            "Build a quantum random number generator "
            "using qubit superposition and measurement."
        ),
        "level": "Beginner",
        "duration": "2 Days",
        "category": "Quantum Fundamentals",
        "skills": [
            "Qubits",
            "Superposition",
            "Measurement",
            "Qiskit"
        ]
    },

    {
        "id": 2,
        "title": "Quantum Teleportation",
        "description": (
            "Implement a quantum teleportation circuit "
            "and understand how an unknown quantum state "
            "can be transferred."
        ),
        "level": "Intermediate",
        "duration": "4 Days",
        "category": "Quantum Communication",
        "skills": [
            "Qubits",
            "Entanglement",
            "CNOT",
            "Hadamard"
        ]
    },

    {
        "id": 3,
        "title": "Grover Search Algorithm",
        "description": (
            "Build a small quantum search algorithm "
            "using Grover's algorithm and compare it "
            "with classical search."
        ),
        "level": "Advanced",
        "duration": "5 Days",
        "category": "Quantum Algorithms",
        "skills": [
            "Grover Algorithm",
            "Oracle",
            "Amplitude Amplification",
            "Qiskit"
        ]
    },

    {
        "id": 4,
        "title": "QAOA Optimization Project",
        "description": (
            "Solve a small combinatorial optimization "
            "problem using the Quantum Approximate "
            "Optimization Algorithm."
        ),
        "level": "Advanced",
        "duration": "7 Days",
        "category": "Quantum Optimization",
        "skills": [
            "QAOA",
            "Optimization",
            "Parameterized Circuits",
            "Qiskit"
        ]
    },

    {
        "id": 5,
        "title": "Quantum Machine Learning Classifier",
        "description": (
            "Create a simple hybrid quantum-classical "
            "machine learning classifier."
        ),
        "level": "Advanced",
        "duration": "7 Days",
        "category": "Quantum AI",
        "skills": [
            "Quantum Machine Learning",
            "Feature Encoding",
            "Variational Circuits",
            "Python"
        ]
    },

    {
        "id": 6,
        "title": "Quantum Compass Capstone",
        "description": (
            "Build a complete quantum learning application "
            "combining AI guidance, quantum education, "
            "progress tracking and practical projects."
        ),
        "level": "Advanced",
        "duration": "10 Days",
        "category": "Portfolio Project",
        "skills": [
            "Python",
            "Flask",
            "React",
            "Quantum Computing"
        ]
    }
]


# ============================================================
# HEALTH
# ============================================================

@app.route("/health", methods=["GET"])
def health():

    database_status = "Connected"

    try:
        conn = get_db()
        conn.execute("SELECT 1")
        conn.close()
    except Exception:
        database_status = "Disconnected"

    return jsonify({
        "status": "healthy",
        "service": "Quantum Compass AI Backend",
        "database": database_status
    })


# ============================================================
# LOGIN
# ============================================================

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip()
    password = str(data.get("password", "")).strip()

    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email and password are required."
        }), 400

    conn = get_db()

    user = conn.execute("""
        SELECT id, email, name, goal, password
        FROM users
        WHERE email = ?
    """, (email,)).fetchone()

    conn.close()

    if not user:
        return jsonify({
            "status": "error",
            "message": "Invalid email or password."
        }), 401

    stored_password = user["password"]

    if stored_password is not None:
        if str(stored_password) != password:
            return jsonify({
                "status": "error",
                "message": "Invalid email or password."
            }), 401

    return jsonify({
        "status": "success",
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "goal": user["goal"]
    })


# ============================================================
# HELPER - GET COMPLETED SKILLS
# ============================================================

def get_completed_skills(user_id):

    conn = get_db()

    rows = conn.execute("""
        SELECT
            COALESCE(
                NULLIF(TRIM(skill_name), ''),
                NULLIF(TRIM(skill), '')
            ) AS skill,
            status
        FROM progress
        WHERE user_id = ?
    """, (user_id,)).fetchall()

    conn.close()

    completed = []

    for row in rows:

        skill = row["skill"]
        status = row["status"]

        if (
            skill
            and status
            and str(status).strip().lower() == "completed"
        ):
            skill = str(skill).strip()

            if skill not in completed:
                completed.append(skill)

    return completed


# ============================================================
# DASHBOARD
# ============================================================

@app.route("/dashboard/<int:user_id>", methods=["GET"])
def dashboard(user_id):

    conn = get_db()

    user = conn.execute("""
        SELECT id, name, email, goal
        FROM users
        WHERE id = ?
    """, (user_id,)).fetchone()

    conn.close()

    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found."
        }), 404

    completed_skills = get_completed_skills(user_id)
    completed_set = set(completed_skills)

    completed_count = len(completed_set)
    total_skills = len(SKILLS)

    progress_value = round(
        (completed_count / total_skills) * 100
    ) if total_skills else 0

    if progress_value >= 100:
        level = "Advanced"
    elif progress_value >= 60:
        level = "Intermediate"
    else:
        level = "Beginner"

    learning_path = []
    next_found = False

    for skill in SKILLS:

        if skill in completed_set:

            learning_path.append({
                "skill": skill,
                "status": "Completed"
            })

        elif not next_found:

            learning_path.append({
                "skill": skill,
                "status": "Next Skill"
            })

            next_found = True

        else:

            learning_path.append({
                "skill": skill,
                "status": "Pending"
            })

    return jsonify({
        "status": "success",
        "user": user["name"] or "Gayathri",
        "role": user["goal"] or "Quantum Learner",
        "completed_skills": completed_skills,

        "analytics": {
            "completed_skills": completed_count,
            "total_skills": total_skills,
            "progress": f"{progress_value}%",
            "level": level
        },

        "learning_path": learning_path
    })


# ============================================================
# SKILLS ENDPOINT
# FIXES: GET /skills/1
# ============================================================

@app.route("/skills/<int:user_id>", methods=["GET"])
def get_skills(user_id):

    completed = set(get_completed_skills(user_id))

    result = []

    next_found = False

    for index, skill in enumerate(SKILLS, start=1):

        if skill in completed:
            status = "Completed"

        elif not next_found:
            status = "Next Skill"
            next_found = True

        else:
            status = "Pending"

        result.append({
            "id": index,
            "skill": skill,
            "status": status
        })

    completed_count = len(completed)
    total = len(SKILLS)

    progress_value = round(
        (completed_count / total) * 100
    ) if total else 0

    return jsonify({
        "status": "success",
        "user_id": user_id,
        "skills": result,
        "completed": completed_count,
        "total": total,
        "progress": f"{progress_value}%"
    })


# ============================================================
# COMPLETE SKILL
# ============================================================

@app.route("/progress", methods=["POST"])
def complete_skill():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    skill = str(data.get("skill", "")).strip()

    if not user_id or not skill:
        return jsonify({
            "status": "error",
            "message": "user_id and skill are required."
        }), 400

    if skill not in SKILLS:
        return jsonify({
            "status": "error",
            "message": "Unknown skill.",
            "available_skills": SKILLS
        }), 400

    conn = get_db()

    # Existing record can be stored in either skill_name or skill.
    existing = conn.execute("""
        SELECT id
        FROM progress
        WHERE user_id = ?
        AND (
            skill_name = ?
            OR skill = ?
        )
        LIMIT 1
    """, (user_id, skill, skill)).fetchone()

    today = datetime.now().strftime("%Y-%m-%d")

    if existing:

        conn.execute("""
            UPDATE progress
            SET
                skill_name = ?,
                skill = NULL,
                status = 'Completed',
                completion_date = ?
            WHERE id = ?
        """, (
            skill,
            today,
            existing["id"]
        ))

    else:

        conn.execute("""
            INSERT INTO progress
            (
                user_id,
                skill_name,
                status,
                completion_date
            )
            VALUES (?, ?, 'Completed', ?)
        """, (
            user_id,
            skill,
            today
        ))

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": f"{skill} completed successfully.",
        "skill": skill
    })


# ============================================================
# PROJECT LIST
# ============================================================

@app.route("/projects/<int:user_id>", methods=["GET"])
def get_projects(user_id):

    conn = get_db()

    rows = conn.execute("""
        SELECT
            project_id,
            status,
            started_at,
            completed_at
        FROM project_progress
        WHERE user_id = ?
    """, (user_id,)).fetchall()

    conn.close()

    progress_map = {
        row["project_id"]: {
            "status": row["status"],
            "started_at": row["started_at"],
            "completed_at": row["completed_at"]
        }
        for row in rows
    }

    result = []

    for project in PROJECTS:

        item = dict(project)

        saved = progress_map.get(project["id"])

        if saved:
            item["status"] = saved["status"]
            item["started_at"] = saved["started_at"]
            item["completed_at"] = saved["completed_at"]

        else:
            item["status"] = "Available"
            item["started_at"] = None
            item["completed_at"] = None

        result.append(item)

    completed_count = sum(
        1 for project in result
        if project["status"] == "Completed"
    )

    total = len(result)

    progress_value = round(
        (completed_count / total) * 100
    ) if total else 0

    return jsonify({
        "status": "success",
        "projects": result,
        "completed": completed_count,
        "total": total,
        "progress": f"{progress_value}%"
    })


# ============================================================
# START PROJECT
# ============================================================

@app.route(
    "/projects/<int:user_id>/<int:project_id>/start",
    methods=["POST"]
)
def start_project(user_id, project_id):

    project = next(
        (
            p for p in PROJECTS
            if p["id"] == project_id
        ),
        None
    )

    if project is None:
        return jsonify({
            "status": "error",
            "message": "Project not found."
        }), 404

    conn = get_db()

    existing = conn.execute("""
        SELECT status
        FROM project_progress
        WHERE user_id = ?
        AND project_id = ?
    """, (user_id, project_id)).fetchone()

    if existing:

        conn.close()

        return jsonify({
            "status": "success",
            "message": "Project already started.",
            "project_status": existing["status"]
        })

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn.execute("""
        INSERT INTO project_progress
        (
            user_id,
            project_id,
            status,
            started_at
        )
        VALUES (?, ?, 'Started', ?)
    """, (
        user_id,
        project_id,
        now
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Project started successfully.",
        "project_status": "Started"
    })


# ============================================================
# COMPLETE PROJECT
# ============================================================

@app.route(
    "/projects/<int:user_id>/<int:project_id>/complete",
    methods=["POST"]
)
def complete_project(user_id, project_id):

    project = next(
        (
            p for p in PROJECTS
            if p["id"] == project_id
        ),
        None
    )

    if project is None:
        return jsonify({
            "status": "error",
            "message": "Project not found."
        }), 404

    conn = get_db()

    existing = conn.execute("""
        SELECT id, started_at
        FROM project_progress
        WHERE user_id = ?
        AND project_id = ?
    """, (user_id, project_id)).fetchone()

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if existing:

        conn.execute("""
            UPDATE project_progress
            SET
                status = 'Completed',
                completed_at = ?
            WHERE user_id = ?
            AND project_id = ?
        """, (
            now,
            user_id,
            project_id
        ))

    else:

        conn.execute("""
            INSERT INTO project_progress
            (
                user_id,
                project_id,
                status,
                started_at,
                completed_at
            )
            VALUES (?, ?, 'Completed', ?, ?)
        """, (
            user_id,
            project_id,
            now,
            now
        ))

    conn.commit()

    completed_count = conn.execute("""
        SELECT COUNT(*)
        FROM project_progress
        WHERE user_id = ?
        AND status = 'Completed'
    """, (user_id,)).fetchone()[0]

    conn.close()

    total = len(PROJECTS)

    progress_value = round(
        (completed_count / total) * 100
    ) if total else 0

    return jsonify({
        "status": "success",
        "message": (
            f"{project['title']} "
            "completed successfully!"
        ),
        "completed": completed_count,
        "total": total,
        "progress": f"{progress_value}%"
    })


# ============================================================
# ANALYTICS
# ============================================================

@app.route("/analytics/<int:user_id>", methods=["GET"])
def analytics(user_id):

    completed_skills = len(
        set(get_completed_skills(user_id))
    )

    conn = get_db()

    completed_projects = conn.execute("""
        SELECT COUNT(*)
        FROM project_progress
        WHERE user_id = ?
        AND status = 'Completed'
    """, (user_id,)).fetchone()[0]

    conn.close()

    skill_progress = round(
        (completed_skills / len(SKILLS)) * 100
    ) if SKILLS else 0

    project_progress = round(
        (completed_projects / len(PROJECTS)) * 100
    ) if PROJECTS else 0

    return jsonify({
        "status": "success",

        "skills": {
            "completed": completed_skills,
            "total": len(SKILLS),
            "progress": f"{skill_progress}%"
        },

        "projects": {
            "completed": completed_projects,
            "total": len(PROJECTS),
            "progress": f"{project_progress}%"
        }
    })


# ============================================================
# RECOMMENDATIONS
# IMPORTANT: Uses PROJECTS list, NOT a nonexistent DB table.
# ============================================================

@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):

    conn = get_db()

    rows = conn.execute("""
        SELECT project_id
        FROM project_progress
        WHERE user_id = ?
        AND LOWER(status) = 'completed'
    """, (user_id,)).fetchall()

    conn.close()

    completed_ids = {
        int(row["project_id"])
        for row in rows
    }

    recommendations = [
        dict(project)
        for project in PROJECTS
        if project["id"] not in completed_ids
    ]

    return jsonify({
        "status": "success",
        "recommendations": recommendations,
        "completed_projects": len(completed_ids),
        "available_projects": len(PROJECTS),
        "recommended_projects": len(recommendations)
    })


# ============================================================
# SKILL ANALYSIS
# ============================================================

@app.route("/skill-analysis/<int:user_id>", methods=["GET"])
def skill_analysis(user_id):

    completed = get_completed_skills(user_id)

    count = len(completed)

    if count >= 9:
        level = "Advanced"
    elif count >= 5:
        level = "Intermediate"
    else:
        level = "Beginner"

    return jsonify({
        "status": "success",
        "user_id": user_id,
        "level": level,
        "completed_skills": completed,
        "total_skills": len(SKILLS)
    })


# ============================================================
# AI CHAT
# ============================================================

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True) or {}

    message = str(
        data.get("message", "")
    ).strip()

    if not message:
        return jsonify({
            "status": "error",
            "message": "Please enter a message."
        }), 400

    lower = message.lower()

    if "qaoa" in lower:

        reply = (
            "QAOA is the Quantum Approximate Optimization "
            "Algorithm. It uses parameterized quantum "
            "circuits to solve optimization problems."
        )

    elif "grover" in lower:

        reply = (
            "Grover's algorithm provides approximately "
            "quadratic speedup for unstructured search."
        )

    elif "qiskit" in lower:

        reply = (
            "Qiskit is an open-source framework for "
            "building and studying quantum circuits."
        )

    elif "qubit" in lower:

        reply = (
            "A qubit is the basic unit of quantum "
            "information. It can exist in a superposition "
            "of |0> and |1>."
        )

    else:

        reply = (
            "I'm your Quantum Compass AI Mentor. "
            "Ask me about qubits, quantum gates, "
            "Qiskit, Grover, QAOA, quantum projects "
            "or your learning roadmap."
        )

    return jsonify({
        "status": "success",
        "reply": reply
    })


# ============================================================
# 404
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({
        "status": "error",
        "message": "API endpoint not found."
    }), 404


# ============================================================
# 500
# ============================================================

@app.errorhandler(500)
def internal_error(error):

    return jsonify({
        "status": "error",
        "message": "Internal server error."
    }), 500


# ============================================================
# START
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("🚀 QUANTUM COMPASS AI BACKEND")
    print("=" * 60)
    print("💚 Health    : GET  /health")
    print("🔐 Login     : POST /login")
    print("📊 Dashboard : GET  /dashboard/<user_id>")
    print("🎓 Skills    : GET  /skills/<user_id>")
    print("✅ Progress  : POST /progress")
    print("📈 Analytics : GET  /analytics/<user_id>")
    print("🎯 Recommend : GET  /recommend/<user_id>")
    print("🛠️ Projects  : GET  /projects/<user_id>")
    print("▶️ Start     : POST /projects/<user_id>/<project_id>/start")
    print("🏆 Complete  : POST /projects/<user_id>/<project_id>/complete")
    print("🧠 Analysis  : GET  /skill-analysis/<user_id>")
    print("🤖 AI Chat   : POST /chat")
    print("=" * 60)
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

