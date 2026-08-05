import sqlite3
import os


DATABASE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "quantum_compass.db"
)


TOTAL_SKILLS = 9


def get_progress(user_id):

    conn = sqlite3.connect(DATABASE)

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT skill_name, status
        FROM progress
        WHERE user_id = ?
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    conn.close()


    completed_skills = []


    for skill_name, status in rows:

        if (
            skill_name is not None
            and status is not None
            and status.lower() == "completed"
        ):

            if skill_name not in completed_skills:

                completed_skills.append(skill_name)


    completed_count = len(completed_skills)


    progress = int(
        (completed_count / TOTAL_SKILLS) * 100
    )


    return {

        "completed_count": completed_count,

        "total_skills": TOTAL_SKILLS,

        "progress": str(progress) + "%",

        "level": get_level(completed_count),

        "completed_skills": completed_skills

    }



def get_level(completed_count):

    if completed_count < 3:

        return "Beginner"

    elif completed_count < 6:

        return "Intermediate"

    else:

        return "Advanced"