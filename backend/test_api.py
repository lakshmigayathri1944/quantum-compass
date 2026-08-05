import requests


url = "http://127.0.0.1:5000/generate"


data = {

    "quantum": "No Knowledge",

    "goal": "AI + Quantum Engineer"

}


response = requests.post(url, json=data)


print(response.json())
