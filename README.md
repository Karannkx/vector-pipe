# VectorShift Frontend Technical Assessment

This repository contains my completed solution for the VectorShift Frontend Technical Assessment using React (frontend) and FastAPI (backend).

## Assessment Coverage

### Part 1: Node Abstraction
Implemented reusable node abstraction in:
- [frontend/src/nodes/BaseNode.js](frontend/src/nodes/BaseNode.js)

All nodes use the shared base architecture and styling primitives. Additional nodes created to demonstrate extensibility:
- [frontend/src/nodes/apiNode.js](frontend/src/nodes/apiNode.js)
- [frontend/src/nodes/filterNode.js](frontend/src/nodes/filterNode.js)
- [frontend/src/nodes/mergeNode.js](frontend/src/nodes/mergeNode.js)
- [frontend/src/nodes/noteNode.js](frontend/src/nodes/noteNode.js)
- [frontend/src/nodes/timerNode.js](frontend/src/nodes/timerNode.js)

Registered in the React Flow node map at:
- [frontend/src/ui.js](frontend/src/ui.js)

### Part 2: Styling
Applied a unified premium UI across toolbar, canvas, nodes, controls, and result panel.

Primary styling locations:
- [frontend/src/index.css](frontend/src/index.css)
- [frontend/src/toolbar.js](frontend/src/toolbar.js)
- [frontend/src/draggableNode.js](frontend/src/draggableNode.js)
- [frontend/src/submit.js](frontend/src/submit.js)
- [frontend/src/App.js](frontend/src/App.js)

### Part 3: Text Node Logic
Enhanced text node with:
- Dynamic width and textarea auto-height based on content
- Variable parsing for patterns like {{input}}
- Dynamic left handles generated from extracted variables

Implementation:
- [frontend/src/nodes/textNode.js](frontend/src/nodes/textNode.js)

### Part 4: Backend Integration
Implemented pipeline submission and DAG validation integration.

Frontend submission:
- [frontend/src/submit.js](frontend/src/submit.js)

Backend parsing endpoint + DAG check:
- [backend/main.py](backend/main.py)

Response format returned:
- num_nodes
- num_edges
- is_dag

## Modern UX + Responsiveness

Key responsive/product polish improvements:
- Mobile vertical toolbar with icon-only drag items
- Touch drag-and-drop support for node creation on phones
- Mobile-friendly controls pinned to bottom-left corner
- Compact icon-only run button on mobile
- Top-right social links (GitHub/LinkedIn) as responsive icon chips
- Consistent glassmorphism + dark studio visual language

Relevant files:
- [frontend/src/toolbar.js](frontend/src/toolbar.js)
- [frontend/src/draggableNode.js](frontend/src/draggableNode.js)
- [frontend/src/ui.js](frontend/src/ui.js)
- [frontend/src/submit.js](frontend/src/submit.js)
- [frontend/src/App.js](frontend/src/App.js)

## Local Setup

### 1. Clone and enter repository
```bash
git clone <your-repo-url>
cd frontend_technical_assessment
```

### 2. Backend setup (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs on http://localhost:8000

### 3. Frontend setup (React)
Open a second terminal:
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## How to Test Functionality

1. Open the app and drag nodes from the top toolbar.
2. Connect nodes to form a pipeline.
3. Use a Text node and type variables like {{input_text}} or {{query}}.
4. Verify new left-side handles appear for each variable.
5. Click Run Inference.
6. Verify backend response panel displays:
- Number of nodes
- Number of edges
- DAG validity

## Deployment (Vercel Serverless)

Configured files:
- [vercel.json](vercel.json)
- [backend/requirements.txt](backend/requirements.txt)
- [frontend/.env.example](frontend/.env.example)

### Deploy steps
1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Keep root as repository root (same folder as [vercel.json](vercel.json)).
4. Deploy.

The configuration routes:
- Frontend static build from [frontend/package.json](frontend/package.json)
- API routes /api/* to [backend/main.py](backend/main.py)

## Environment Variables

Frontend uses:
- REACT_APP_API_BASE_URL

Behavior in [frontend/src/submit.js](frontend/src/submit.js):
- Localhost: defaults to http://localhost:8000
- Non-localhost (deployed): defaults to same domain (/api/...)

Example values:
- Local: REACT_APP_API_BASE_URL=http://localhost:8000
- Vercel: can be left empty for same-domain API routing

## Code Walkthrough Pointers (for interview discussion)

Good files to walk through in order:
1. [frontend/src/nodes/BaseNode.js](frontend/src/nodes/BaseNode.js) (abstraction design)
2. [frontend/src/nodes/textNode.js](frontend/src/nodes/textNode.js) (dynamic text + variable handles)
3. [frontend/src/ui.js](frontend/src/ui.js) (React Flow integration + mobile control behavior)
4. [frontend/src/draggableNode.js](frontend/src/draggableNode.js) (desktop + touch drag behavior)
5. [frontend/src/submit.js](frontend/src/submit.js) and [backend/main.py](backend/main.py) (frontend-backend integration + DAG)

## Suggested Screen Recording Walkthrough

### 1. Intro
- Briefly explain this is a React Flow pipeline builder with FastAPI backend parsing.

### 2. Part 1 demo: Node abstraction
- Show [frontend/src/nodes/BaseNode.js](frontend/src/nodes/BaseNode.js).
- Explain that shared layout/handles/styling and expand/collapse behavior are centralized.
- Show how additional nodes were added quickly using this base.

### 3. Part 2 demo: Styling and UX
- Show toolbar, canvas, node visuals, and unified design language.
- Highlight responsiveness (desktop vs mobile-sized viewport).

### 4. Part 3 demo: Text node logic
- Add Text node.
- Type long text to show dynamic sizing.
- Type variables like {{input}} and {{context}} to show dynamic handle generation.

### 5. Part 4 demo: Backend integration
- Build a small pipeline and connect nodes.
- Click Run Inference.
- Show returned num_nodes, num_edges, and is_dag values.
- Mention DAG check is implemented with Kahn’s algorithm in [backend/main.py](backend/main.py).

### 6. Code overview close
- Mention main architectural files and why this structure is maintainable.
- Mention Vercel serverless readiness.

## Notes

- This solution prioritizes maintainability (node abstraction), real usability (text node logic), and production-friendly deployment setup.
- Frontend and backend are both ready to run locally and deploy through Vercel.
