# 🚀 Project Roadmap: Python Algorithm Visualizer (Vercel Edition)

This project aims to build a high-performance, visually stunning algorithm visualizer using **Next.js (Frontend)** for premium aesthetics and **Python (FastAPI/Flask)** for the algorithmic logic, deployable for free on Vercel.

## Phase 1: Project Initialization & Configuration ✅

- [x] **Initialize Next.js Project**
  - Create a new Next.js app with TypeScript and Tailwind CSS.
  - Configure `next.config.mjs`.
- [x] **Setup Python Backend (Serverless)**
  - Create an `api/` directory for Python serverless functions.
  - Initialize `requirements.txt`.
  - Install `Flask` and `Flask-CORS` (for local dev).
- [x] **Vercel Configuration**
  - Create `vercel.json` to route API requests to the Python backend.

## Phase 2: Core Architecture & Design System ✅

- [x] **Design System Setup**
  - Define "Neon/Cyberpunk" color palette in `tailwind.config.ts`.
  - Create reusable UI components: `Button`, `Card`, Glassmorphism effects.
- [x] **Layout & Navigation**
  - Create interactive Homepage with algorithm category cards.
  - Implement navigation between Sorting, Pathfinding, and Recursive pages.

## Phase 3: Algorithm Implementation (Python) ✅

- [x] **Sorting Algorithms Engine**
  - Bubble, Quick, Merge, and Insertion Sort implemented.
- [x] **Pathfinding Algorithms Engine**
  - Dijkstra, A*, BFS, and DFS implemented with grid state step generation.
- [x] **Recursive Algorithms Engine**
  - N-Queens Backtracking and Sierpinski Fractal implemented.

## Phase 4: Frontend Visualization & Animation ✅

- [x] **Sorting Visualizer Component**
  - Bar chart visualization with Framer Motion animations.
  - Controls: Play/Pause, Speed, Reset, Selection.
- [x] **Pathfinding Visualizer Component**
  - Interactive Grid with wall drawing.
  - Animated visitation and path reconstruction.
- [x] **Recursive Visualizer Component**
  - Chess board visualization for N-Queens.
  - SVG Canvas for Fractal (Sierpinski) visualization.

## Phase 5: Polish & Deployment (Current) 🚧

- [ ] **Performance Optimization**
- [ ] **SEO & Metadata**
- [ ] **Deployment to Vercel**

## Bonus Features

- [ ] **Code View**: Show the Python code alongside the visualization.
- [ ] **Complexity Analysis**: Display Big-O notation.
