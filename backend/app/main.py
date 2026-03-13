"""
FastAPI application entry point.
Sets up CORS, mounts API routers, WebSocket endpoint, and background tasks.
"""

import asyncio
import os
import sys
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend directory is on sys.path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from database.connection import init_db, async_session
from app.api.routes import router as api_router
from app.services.data_simulator import seed_historical_data
from workers.broadcaster import broadcast_live_data, connected_clients
from sqlalchemy import select
from app.models.models import MetricSnapshot


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: seed DB and start background broadcaster."""
    # Initialize database tables
    await init_db()

    # Seed data only if DB is empty
    async with async_session() as session:
        result = await session.execute(select(MetricSnapshot.id).limit(1))
        if result.scalar() is None:
            print("[DATA] Seeding 30 days of historical analytics data...")
            await seed_historical_data(session, days=30)
            print("[DATA] Seed complete.")

    # Start background broadcaster
    task = asyncio.create_task(broadcast_live_data())
    print("[LIVE] Live data broadcaster started.")

    yield

    # Cleanup
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(
    title="Analytics Dashboard API",
    description="Real-time analytics backend with REST + WebSocket",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST API routes
app.include_router(api_router)


# WebSocket endpoint
@app.websocket("/ws/live")
async def websocket_live(ws: WebSocket):
    await ws.accept()
    connected_clients.add(ws)
    try:
        while True:
            # Keep connection alive — read pings/messages
            await ws.receive_text()
    except WebSocketDisconnect:
        connected_clients.discard(ws)
    except Exception:
        connected_clients.discard(ws)


@app.get("/health")
async def health():
    return {"status": "ok"}
