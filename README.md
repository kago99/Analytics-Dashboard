# Real-Time Analytics Dashboard

A full-stack, real-time analytics dashboard displaying traffic, sales, and user metrics with live updates.

## Features
- **FastAPI Backend**: Complete REST API and WebSocket integration with simulated historical and live data generation. Uses SQLite for easy local setup.
- **React Frontend**: Built with Vite, TailwindCSS (v4), and Recharts for dynamic visualizations.
- **Real-Time Data**: Live metrics streamed via WebSocket and instantly reflected on the frontend.
- **Responsive Layout**: Sidebar navigation, dashboard components, and interactive Recharts.
- **Dark/Light Mode**: Full theme support with Context and Tailwind styling.

---

## Folder Structure
- `backend/`: FastAPI application, complete with DB models, routers, background workers, and in-memory cache.
- `frontend/`: React application containing components, charts, contexts, and hooks.

---

## Setup Instructions

### 1. Backend (FastAPI)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip intall -r requirements.txt
   ```
   *Note: if you run into compatibility issues on Python 3.14, simply run `pip install fastapi uvicorn[standard] sqlalchemy aiosqlite pydantic pydantic-settings python-dotenv websockets` manually to fetch the latest wheels.*

3. Start the server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   *The server runs on http://localhost:8000 and automatically seeds the `analytics.db` SQLite database with 30 days of historical data on first startup.*

### 2. Frontend (React + Vite)
1. Navigate to the `frontend/` directory (open a new terminal tab):
   ```bash
   cd frontend
   ```
2. Install dependencies (we recommend `--legacy-peer-deps` due to some React 19/Vite 6 peer mismatches):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend runs on http://localhost:5173. Open this in your browser to interact with the dashboard!*
