print("NEW SKILL ANALYZER LOADED 🚀")



def analyze_skill(completed_skills):


    all_skills = [

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



    missing_skills = []



    for skill in all_skills:


        if skill not in completed_skills:

            missing_skills.append(skill)



    total = len(all_skills)



    completed_count = len(
        completed_skills
    )



    score = int(

        (completed_count / total) * 100

    )



    return {


        "Readiness Score":
        str(score)+"%",



        "Completed Skills":
        completed_skills,



        "Missing Skills":
        missing_skills

    }