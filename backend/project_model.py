import pandas as pd



data = pd.read_csv("project_data.csv")



def recommend_projects(level, goal):


    result = data[

        (data["level"] == level) &

        (data["goal"] == goal)

    ]



    projects = []



    for index,row in result.iterrows():

        projects.append({

            "Project":row["project"],

            "Difficulty":row["difficulty"],

            "Technology":row["technology"]

        })


    return projects