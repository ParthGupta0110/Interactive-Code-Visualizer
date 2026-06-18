# 🚀 Interactive Code Visualizer

An interactive developer tool that transforms source code into visual execution-flow diagrams, helping programmers understand program logic through graphical representations of variables, functions, loops, conditions, and return statements.

Built for students, developers, and educators, the platform bridges the gap between source code and visual reasoning by converting code structures into intuitive node-based flow diagrams.

---

## 🌟 Key Features

### 📦 Variable Tracking
Automatically detects variable declarations and visualizes them as interactive nodes.

### 🚀 Function Visualization
Identifies function definitions and displays their relationships within the program flow.

### 🤔 Conditional Branch Mapping
Visualizes `if`, `else if`, and `else` conditions using connected decision nodes.

### 🔄 Loop Representation
Supports visualization of iterative structures such as:
- `for` loops
- `while` loops
- Nested loops

### ↩️ Return Statement Detection
Maps return statements to help users understand function outputs and execution paths.

### 🎯 Interactive Node-Based Canvas
Built using React Flow, allowing:
- Zooming
- Panning
- Dynamic node interaction
- Relationship visualization

### 🌙 Modern Developer Interface
- Dark theme UI
- Responsive layout
- Smooth graph navigation
- Grid-based visualization workspace

---

# 📸 Screenshots

## Variable Mapping
for code: 
max_val = 100
multiplier = 2
final_score = max_val * multiplier
<img width="1907" height="871" alt="image" src="https://github.com/user-attachments/assets/5607cf71-2313-4842-a73c-8e37eadd6ddb" />

## Conditional Flow Analysis
for code:
if (b > max_val) {
    max_val = b;
} else {
    max_val = c;
}
<img width="1907" height="866" alt="image" src="https://github.com/user-attachments/assets/81130f55-e28f-41ac-bef8-4146a5d52801" />


## Loop Visualization
for code:
while (current <= n) {
    result = result * current;
    current = current + 1;
}
<img width="1906" height="867" alt="image" src="https://github.com/user-attachments/assets/456ad2b3-927e-4faa-a444-6c540e4de168" />


# 🏗️ Architecture

```text
                    User Input
                         │
                         ▼
                Code Analysis Engine
                         │
                         ▼
              Structure Identification
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    Variables       Functions        Conditions
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                 React Flow Renderer
                         │
                         ▼
                Interactive Diagram
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Flow
- CSS3
- JavaScript (ES6+)

## Backend

- Node.js
- Express.js

## Development Tools

- Git
- GitHub
- VS Code

---

# 📂 Project Structure

```text
Interactive-Code-Visualizer/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── parsers/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       ├── index.js
│       └── index.css
│
├── screenshots/
│
├── README.md
│
└── package.json
```

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

- Node.js (v18+ recommended)
- npm

---

## Clone Repository

```bash
git clone https://github.com/ParthGupta0110/Interactive-Code-Visualizer.git

cd Interactive-Code-Visualizer
```

---

## Start Frontend

```bash
cd frontend

npm install

npm start
```

Frontend will run on:

```text
http://localhost:3000
```

---

## Start Backend

Open a second terminal:

```bash
cd backend

npm install

npm start
```

Backend server will start on the configured port.

---

# 🧠 How It Works

1. User enters source code.
2. Code is analyzed and parsed.
3. Important program structures are identified:
   - Variables
   - Functions
   - Loops
   - Conditions
   - Return statements
4. Nodes are generated dynamically.
5. Relationships between nodes are created.
6. React Flow renders the execution graph.

---

# 🔮 Future Enhancements

### 📝 Monaco Editor Integration
VS Code-like code editing experience.

### 🌳 AST-Based Parsing
Support for:
- JavaScript
- Python
- Java
- C++

using Babel and Tree-sitter.

### 📊 Complexity Analyzer

Automatic detection of:

- Time Complexity
- Space Complexity

Example:

```text
Time Complexity : O(n)

Space Complexity : O(1)
```

### 🤖 AI Code Explanation

Generate:
- Line-by-line explanations
- Logic summaries
- Learning notes

### 🔄 Execution Simulation

Step-by-step code execution visualization.

### 🌐 Multi-Language Support

Planned support for:

- JavaScript
- Python
- Java
- C++
- C

---

# 🎯 Use Cases

- Learning Programming
- Understanding DSA Logic
- Teaching Algorithms
- Debugging Small Programs
- Visualizing Execution Flow
- Interview Preparation

---

# 📈 Resume Highlights

- Developed a code analysis and visualization platform using React.js and Node.js.
- Implemented detection and graphical mapping of variables, functions, loops, and conditional branches.
- Designed an interactive execution-flow visualization system using React Flow.
- Built a scalable architecture for future AST parsing and complexity analysis.

---

# 👨‍💻 Author

### Parth Gupta

- GitHub: https://github.com/ParthGupta0110
- LinkedIn: https://www.linkedin.com/in/parth-gupta-584197294/

---

## ⭐ If you found this project useful, consider giving it a star!
