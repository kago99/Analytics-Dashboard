"""
Background worker that generates live data and broadcasts via WebSocket.
"""

import asyncio
import json
import os
from dotenv import load_dotenv
from app.services.data_simulator import generate_live_point
from app.services.cache_service import cache_invalidate

load_dotenv()

BROADCAST_INTERVAL = int(os.getenv("WS_BROADCAST_INTERVAL", "4"))

# Shared set of connected WebSocket clients
connected_clients: set = set()


async def broadcast_live_data():
    """Continuously generate data and broadcast to all WebSocket clients."""
    while True:
        await asyncio.sleep(BROADCAST_INTERVAL)
        if not connected_clients:
            continue

        data_point = generate_live_point()
        message = json.dumps(data_point)

        # Invalidate cache so next REST call gets fresh data
        cache_invalidate()

        disconnected = set()
        for ws in connected_clients:
            try:
                await ws.send_text(message)
            except Exception:
                disconnected.add(ws)

        connected_clients -= disconnected
