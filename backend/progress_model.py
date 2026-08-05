import sqlite3
import os


# ============================================================
# DATABASE
# ============================================================

DATABASE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "quantum_compass.db"
)


# ============================================================
# COURSE CONFIGURATION
# ============================================================

TOTAL_SKILLS = 9

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
# GET DATABASE
# ============================================================

def get_db():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn


# ============================================================
# GET USER PROGRESS
# ============================================================

def get_progress(user_id):

    conn = get_db()

    rows = conn.execute("""
        SELECT
            COALESCE(
                NULLIF(TRIM(skill_name), ''),
                NULLIF(TRIM(skill), '')
            ) AS skill,
            status,
            completion_date
        FROM progress
        WHERE user_id = ?
    """, (user_id,)).fetchall()

    conn.close()

    completed_skills = []

    for row in rows:

        skill = row["skill"]
        status = row["status"]

        if not skill:
            continue

        if not status:
            continue

        if str(status).strip().lower() != "completed":
            continue

        skill = str(skill).strip()

        if skill not in completed_skills:
            completed_skills.append(skill)

    # Only count skills that belong to our official roadmap.
    completed_skills = [
        skill
        for skill in completed_skills
        if skill in SKILLS
    ]

    completed_count = len(completed_skills)

    progress_value = round(
        (completed_count / TOTAL_SKILLS) * 100
    ) if TOTAL_SKILLS else 0

    return {
        "completed_count": completed_count,
        "total_skills": TOTAL_SKILLS,
        "progress": f"{progress_value}%",
        "level": get_level(completed_count),
        "completed_skills": completed_skills
    }


# ============================================================
# GET LEVEL
# ============================================================

def get_level(completed_count):

    if completed_count >= TOTAL_SKILLS:
        return "Advanced"

    if completed_count >= 5:
        return "Intermediate"

    return "Beginner"


# ============================================================
# NEXT SKILL
# ============================================================

def get_next_skill(user_id):

    progress = get_progress(user_id)

    completed = set(
        progress["completed_skills"]
    )

    for skill in SKILLS:

        if skill not in completed:
            return skill

    return None


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("======================================")
    print("PROGRESS MODEL")
    print("======================================")

    user_id = 1

    result = get_progress(user_id)

    print("User ID:", user_id)
    print("Completed:", result["completed_count"])
    print("Total:", result["total_skills"])
    print("Progress:", result["progress"])
    print("Level:", result["level"])
    print("Completed Skills:")

    for skill in result["completed_skills"]:
        print(" -", skill)

    print("Next Skill:", get_next_skill(user_id))

