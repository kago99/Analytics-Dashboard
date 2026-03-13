"""
REST API routers for analytics endpoints.
All endpoints support time range filtering and pagination.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta, timezone
from typing import Optional

from database.connection import get_db
from app.models.models import MetricSnapshot, TrafficRecord, SalesRecord, UserRecord
from app.schemas.schemas import (
    MetricResponse, MetricListResponse,
    TrafficResponse, TrafficListResponse,
    SalesResponse, SalesListResponse,
    UserResponse, UserListResponse,
)
from app.services.cache_service import cache_get, cache_set

router = APIRouter(prefix="/api", tags=["analytics"])

RANGE_MAP = {
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


def _get_start_time(range_str: str) -> datetime:
    delta = RANGE_MAP.get(range_str, timedelta(days=7))
    return datetime.now(timezone.utc) - delta


# ─── Metrics ───────────────────────────────────────────────────────────────────

@router.get("/metrics", response_model=MetricListResponse)
async def get_metrics(
    range: str = Query("7d", pattern="^(24h|7d|30d)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Get KPI metric snapshots filtered by time range."""
    cache_key = f"metrics:{range}:{page}:{limit}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    start = _get_start_time(range)

    total_q = await db.execute(
        select(func.count(MetricSnapshot.id)).where(MetricSnapshot.timestamp >= start)
    )
    total = total_q.scalar() or 0

    rows_q = await db.execute(
        select(MetricSnapshot)
        .where(MetricSnapshot.timestamp >= start)
        .order_by(desc(MetricSnapshot.timestamp))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    rows = rows_q.scalars().all()

    result = MetricListResponse(
        data=[MetricResponse.model_validate(r) for r in rows],
        total=total, page=page, limit=limit,
    )
    cache_set(cache_key, result, ttl=15)
    return result


# ─── Traffic ───────────────────────────────────────────────────────────────────

@router.get("/traffic", response_model=TrafficListResponse)
async def get_traffic(
    range: str = Query("7d", pattern="^(24h|7d|30d)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Get website traffic data filtered by time range."""
    cache_key = f"traffic:{range}:{page}:{limit}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    start = _get_start_time(range)

    total_q = await db.execute(
        select(func.count(TrafficRecord.id)).where(TrafficRecord.timestamp >= start)
    )
    total = total_q.scalar() or 0

    rows_q = await db.execute(
        select(TrafficRecord)
        .where(TrafficRecord.timestamp >= start)
        .order_by(desc(TrafficRecord.timestamp))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    rows = rows_q.scalars().all()

    result = TrafficListResponse(
        data=[TrafficResponse.model_validate(r) for r in rows],
        total=total, page=page, limit=limit,
    )
    cache_set(cache_key, result, ttl=15)
    return result


# ─── Sales ─────────────────────────────────────────────────────────────────────

@router.get("/sales", response_model=SalesListResponse)
async def get_sales(
    range: str = Query("7d", pattern="^(24h|7d|30d)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Get product sales data filtered by time range."""
    cache_key = f"sales:{range}:{page}:{limit}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    start = _get_start_time(range)

    total_q = await db.execute(
        select(func.count(SalesRecord.id)).where(SalesRecord.timestamp >= start)
    )
    total = total_q.scalar() or 0

    rows_q = await db.execute(
        select(SalesRecord)
        .where(SalesRecord.timestamp >= start)
        .order_by(desc(SalesRecord.timestamp))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    rows = rows_q.scalars().all()

    result = SalesListResponse(
        data=[SalesResponse.model_validate(r) for r in rows],
        total=total, page=page, limit=limit,
    )
    cache_set(cache_key, result, ttl=15)
    return result


# ─── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=UserListResponse)
async def get_users(
    range: str = Query("7d", pattern="^(24h|7d|30d)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Get user growth data filtered by time range."""
    cache_key = f"users:{range}:{page}:{limit}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    start = _get_start_time(range)

    total_q = await db.execute(
        select(func.count(UserRecord.id)).where(UserRecord.timestamp >= start)
    )
    total = total_q.scalar() or 0

    rows_q = await db.execute(
        select(UserRecord)
        .where(UserRecord.timestamp >= start)
        .order_by(desc(UserRecord.timestamp))
        .offset((page - 1) * limit)
        .limit(limit)
    )
    rows = rows_q.scalars().all()

    result = UserListResponse(
        data=[UserResponse.model_validate(r) for r in rows],
        total=total, page=page, limit=limit,
    )
    cache_set(cache_key, result, ttl=15)
    return result
