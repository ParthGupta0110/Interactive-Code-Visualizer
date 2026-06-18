ractive Code Visualizer

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![ReactFlow](https://img.shields.io/badge/ReactFlow-FF007A?style=for-the-badge&logo=reactflow&logoColor=white)](https://reactflow.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

An interactive web application designed to help developers and students map and visualize program logic dynamically. By using a nodal canvas, this tool bridges the gap between abstract execution paths and visual conceptualization.

---

## ✨ Features (Current Status)

* **Interactive Nodal Canvas:** Built using `ReactFlow` supporting smooth fluid panning, zooming, and dynamic node mapping.
* **Modern Dark UI:** Tailored layout with a customized `#121212` background and clean grid structures to minimize tracking load.
* **Decoupled Architecture:** Clean structural separation between the UI layout rendering layer (`frontend`) and operational logic scripts (`backend`).

---

## 🛠️ Tech Stack

* **Frontend:** React.js (JSX), ReactFlow, CSS3
* **Backend Runtime:** Node.js, Express.js
* **Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
├── backend/               # Server-side logic and execution modules
└── frontend/              # Client-side React interface
    ├── public/            # Static configuration assets
    └── src/               # Application source environment
        ├── App.jsx        # Root canvas orchestrator managing states
        ├── index.css      # Core visualization layout rules
        └── index.js       # App entry bootstrap
⚙️ Quick Start Installation
Prerequisites
Make sure you have Node.js and npm set up on your machine.

1. Environment Setup
Navigate to your project root folder:

Bash
cd Interactive-Code-Visualizer
2. Run Client Module (Frontend)
Bash
cd frontend
npm install
npm start
The interface will automatically trigger on http://localhost:3000.

3. Run Service Module (Backend)
Open a parallel terminal window and run:

Bash
cd backend
npm install
npm start
🔮 Future Roadmap (Under Active Development)
We are actively expanding this visualizer into a full-scale developer automation tool:

📝 Monaco Editor Integration: Embedding a high-fidelity code editor interface for real-time script typing.

🔍 AST Parser Implementation: Introducing Babel/Tree-sitter engines to map Abstract Syntax Trees dynamically for JavaScript and Python.

📈 Complexity Analyzers: Building integrated computation panels to track automated Time and Space complexity metrics.

🤖 AI Explanations: Layering LLM capabilities for granular, line-by-line runtime debugging summaries.

📜 License
Distributed under the official open-source MIT License.

👨‍💻 Author
Parth Gupta

🚀 GitHub Profile

💼 LinkedIn Network
