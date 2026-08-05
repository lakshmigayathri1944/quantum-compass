# ⚛️ Quantum Compass

### AI-Powered Quantum Computing Learning Platform

Quantum Compass is an AI-powered educational platform designed to help students learn **Quantum Computing** through personalized learning roadmaps, practical quantum projects, progress tracking, analytics, and AI-powered mentorship.

---

## 🚀 Project Overview

Learning quantum computing can be challenging for beginners because the required mathematics, programming concepts, quantum concepts, algorithms, and practical experience are spread across different resources.

**Quantum Compass** brings these learning components together into one platform.

The system provides:

* 🎯 Personalized learning roadmaps
* 📚 Quantum computing courses and concepts
* 🛠️ Practical quantum projects
* 📊 Learning progress tracking
* 📈 Analytics dashboard
* 🧠 Skill-level analysis
* 🤖 AI Quantum Mentor
* 🎯 Project recommendations
* 🏆 Portfolio-oriented project learning

---

## 💡 Problem Statement

Students interested in quantum computing often face several challenges:

* Lack of a structured learning roadmap
* Difficulty understanding quantum concepts
* Limited hands-on practice
* Difficulty choosing suitable projects
* No centralized progress tracking
* Limited career guidance

Quantum Compass addresses these challenges through a personalized learning environment.

---

## ✨ Key Features

### 🎯 Personalized Learning Roadmap

The platform analyzes a learner's current skills and generates a structured learning path covering:

* Python
* Linear Algebra
* Quantum Fundamentals
* Qubits
* Quantum Gates
* Qiskit
* Quantum Algorithms
* Quantum Optimization
* Quantum Projects

### 📊 Dashboard

The dashboard provides an overview of:

* Current skill level
* Learning progress
* Completed skills
* Next recommended skill
* Learning roadmap
* Career goal

### 📈 Analytics

Learners can monitor:

* Overall progress
* Completed skills
* Total skills
* Learning level
* Project completion

### 🛠️ Quantum Project Lab

The platform provides practical projects across beginner, intermediate, and advanced levels.

#### Project 01 — Quantum Random Number Generator

Concepts:

* Qubits
* Superposition
* Measurement
* Qiskit

#### Project 02 — Quantum Teleportation

Concepts:

* Qubits
* Entanglement
* CNOT
* Hadamard gates
* Quantum communication

#### Project 03 — Grover Search Algorithm

Concepts:

* Grover's algorithm
* Oracle
* Amplitude amplification
* Quantum search

#### Project 04 — QAOA Optimization

Concepts:

* QAOA
* Optimization
* Parameterized quantum circuits
* Combinatorial optimization

#### Project 05 — Quantum Machine Learning Classifier

Concepts:

* Quantum machine learning
* Feature encoding
* Variational circuits
* Hybrid quantum-classical learning

#### Project 06 — Quantum Compass Capstone

A complete quantum learning application combining:

* AI guidance
* Quantum education
* Progress tracking
* Practical projects
* Flask backend
* React frontend

### 🤖 Quantum AI Mentor

The AI Mentor provides guidance related to:

* Quantum computing
* Qiskit
* Quantum algorithms
* Projects
* Learning paths
* Career development

---

## 🏆 Project Completion

The Quantum Project Lab contains:

**6 / 6 projects completed**

**100% completion**

| Project                             | Level        | Status      |
| ----------------------------------- | ------------ | ----------- |
| Quantum Random Number Generator     | Beginner     | ✅ Completed |
| Quantum Teleportation               | Intermediate | ✅ Completed |
| Grover Search Algorithm             | Advanced     | ✅ Completed |
| QAOA Optimization Project           | Advanced     | ✅ Completed |
| Quantum Machine Learning Classifier | Advanced     | ✅ Completed |
| Quantum Compass Capstone            | Advanced     | ✅ Completed |

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │     Flask Backend    │
                    │        API Layer     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌──────────────┐  ┌──────────────┐
       │ SQLite DB  │   │ ML / Skill   │  │ Project      │
       │            │   │ Analysis     │  │ Recommender  │
       └────────────┘   └──────────────┘  └──────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Quantum Learning     │
                    │ & Project System     │
                    └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* CSS
* Vite

### Backend

* Python
* Flask
* Flask-CORS

### Database

* SQLite

### Quantum Computing

* Qiskit
* Qubits
* Superposition
* Entanglement
* Quantum Gates
* Grover's Algorithm
* QAOA
* Quantum Machine Learning

### AI / Recommendation

* Skill analysis
* Personalized roadmap generation
* Project recommendation
* AI mentorship

---

## 📂 Project Structure

```text
quantum-compass/
│
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── database.py
│   ├── model.py
│   ├── progress_model.py
│   ├── project_model.py
│   ├── project_recommender.py
│   ├── skill_analyzer.py
│   ├── progress_data.csv
│   ├── project_data.csv
│   ├── skill_data.csv
│   ├── student_data.csv
│   ├── requirements.txt
│   ├── test_api.py
│   └── test_ml.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/lakshmigayathri1944/quantum-compass.git
cd quantum-compass
```

### 2. Backend setup

```bash
cd backend
py -m pip install -r requirements.txt
py app.py
```

The backend runs at:

```text
http://127.0.0.1:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite.

---

## 🔌 Backend API

| Endpoint                                    | Method | Purpose                  |
| ------------------------------------------- | ------ | ------------------------ |
| `/login`                                    | POST   | User authentication      |
| `/dashboard/<user_id>`                      | GET    | Dashboard data           |
| `/analytics/<user_id>`                      | GET    | Learning analytics       |
| `/progress`                                 | POST   | Update learning progress |
| `/recommend/<user_id>`                      | GET    | Project recommendations  |
| `/projects/<user_id>`                       | GET    | Project information      |
| `/projects/<user_id>/<project_id>/start`    | POST   | Start a project          |
| `/projects/<user_id>/<project_id>/complete` | POST   | Complete a project       |
| `/skill-analysis/<user_id>`                 | GET    | Skill analysis           |
| `/chat`                                     | POST   | AI Mentor                |
| `/health`                                   | GET    | Backend health check     |

---

## 🧪 Backend Health Check

The backend provides:

```text
GET /health
```

Example response:

```json
{
  "database": "Connected",
  "service": "Quantum Compass AI Backend",
  "status": "healthy"
}
```

---

## 🎓 Learning Journey

Quantum Compass follows a progressive learning path:

```text
Python
   ↓
Linear Algebra
   ↓
Quantum Fundamentals
   ↓
Qubits
   ↓
Quantum Gates
   ↓
Qiskit
   ↓
Quantum Algorithms
   ↓
Quantum Optimization
   ↓
Quantum Machine Learning
   ↓
Practical Quantum Projects
```

---

## 🔮 Future Improvements

Planned improvements include:

* Real quantum hardware integration
* IBM Quantum backend integration
* Advanced AI tutoring
* Automated coding evaluation
* More quantum algorithms
* Interactive quantum circuit visualization
* Student leaderboards
* Certification system
* Cloud deployment
* Advanced career recommendations

---

## 🎯 Project Goals

Quantum Compass aims to make quantum computing education:

**Accessible → Structured → Practical → Personalized → Career-oriented**

---

## 👩‍💻 Author

**Kolli Lakshmi Gayathri**

Computer Science Engineering

---

## 📌 Project Status

🚀 **Capstone Completed**

⚛️ **6/6 Quantum Projects Completed**

💯 **100% Project Completion**

🔧 **Actively improving and expanding**

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
