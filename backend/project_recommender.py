print("PROJECT RECOMMENDER LOADED 🚀")



def recommend_projects(
        level,
        goal
):


    projects = []



    if level == "Beginner":


        projects.append({

            "project":
            "Quantum Random Number Generator",

            "level":
            "Beginner",

            "skills":[

                "Python",

                "Qiskit Basics"

            ]

        })




    elif level == "Intermediate":


        projects.append({

            "project":
            "Grover Algorithm Simulator",

            "level":
            "Intermediate",

            "skills":[

                "Quantum Gates",

                "Qiskit"

            ]

        })




    else:


        projects.append({

            "project":
            "QAOA Optimization Project",

            "level":
            "Advanced",

            "skills":[

                "QAOA",

                "Quantum AI"

            ]

        })




    return projects