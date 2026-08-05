print("Quantum Compass ML Model Trained 🚀")



def analyze_skill(completed_skills):


    count = len(completed_skills)



    if count < 3:

        return "Beginner"


    elif count < 6:

        return "Intermediate"


    else:

        return "Advanced"





def generate_roadmap(level):


    roadmap = {


        "Beginner":[

            "Python Basics",

            "Linear Algebra Basics",

            "Quantum Fundamentals"

        ],



        "Intermediate":[

            "Qubits",

            "Quantum Gates",

            "Qiskit Programming"

        ],



        "Advanced":[

            "Grover Algorithm",

            "QAOA",

            "Quantum Projects"

        ]


    }



    return roadmap.get(

        level,

        []

    )