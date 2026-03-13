"""
Data simulator — generates realistic mock analytics data.
Provides both historical bulk seeding and real-time point generation.
"""

import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import MetricSnapshot, TrafficRecord, SalesRecord, UserRecord

TRAFFIC_SOURCES = ["Organic", "Direct", "Social", "Referral", "Email", "Paid"]
PRODUCTS = [
    ("Wireless Headphones", "Electronics"),
    ("Running Shoes", "Apparel"),
    ("Coffee Maker", "Kitchen"),
    ("Yoga Mat", "Fitness"),
    ("Backpack", "Accessories"),
    ("Smartwatch", "Electronics"),
    ("Water Bottle", "Fitness"),
    ("Desk Lamp", "Home Office"),
]


def _rand_metric(base_time: datetime) -> MetricSnapshot:
    return MetricSnapshot(
        timestamp=base_time,
        active_users=random.randint(800, 2500),
        revenue=round(random.uniform(2000, 12000), 2),
        conversion_rate=round(random.uniform(1.5, 6.0), 2),
        traffic_sources=random.randint(3, 6),
    )


def _rand_traffic(base_time: datetime) -> TrafficRecord:
    return TrafficRecord(
        timestamp=base_time,
        page_views=random.randint(500, 5000),
        unique_visitors=random.randint(200, 3000),
        bounce_rate=round(random.uniform(20, 70), 1),
        source=random.choice(TRAFFIC_SOURCES),
    )


def _rand_sale(base_time: datetime) -> SalesRecord:
    product, category = random.choice(PRODUCTS)
    return SalesRecord(
        timestamp=base_time,
        product=product,
        amount=round(random.uniform(15, 500), 2),
        quantity=random.randint(1, 20),
        category=category,
    )


def _rand_user(base_time: datetime) -> UserRecord:
    active = random.randint(500, 3000)
    return UserRecord(
        timestamp=base_time,
        signups=random.randint(10, 200),
        active_users=active,
        returning_users=int(active * random.uniform(0.3, 0.7)),
    )


async def seed_historical_data(session: AsyncSession, days: int = 30):
    """Seed database with `days` worth of hourly data points."""
    now = datetime.now(timezone.utc)
    records = []
    for hours_ago in range(days * 24, 0, -1):
        ts = now - timedelta(hours=hours_ago)
        records.append(_rand_metric(ts))
        records.append(_rand_traffic(ts))
        records.append(_rand_sale(ts))
        records.append(_rand_user(ts))

    session.add_all(records)
    await session.commit()


def generate_live_point() -> dict:
    """Generate a single live data point for WebSocket broadcast."""
    now = datetime.now(timezone.utc)
    product, category = random.choice(PRODUCTS)
    return {
        "timestamp": now.isoformat(),
        "metrics": {
            "activeUsers": random.randint(800, 2500),
            "revenue": round(random.uniform(2000, 12000), 2),
            "conversionRate": round(random.uniform(1.5, 6.0), 2),
            "trafficSources": random.randint(3, 6),
        },
        "traffic": {
            "pageViews": random.randint(500, 5000),
            "uniqueVisitors": random.randint(200, 3000),
            "bounceRate": round(random.uniform(20, 70), 1),
            "source": random.choice(TRAFFIC_SOURCES),
        },
        "sales": {
            "product": product,
            "amount": round(random.uniform(15, 500), 2),
            "quantity": random.randint(1, 20),
            "category": category,
        },
        "users": {
            "signups": random.randint(10, 200),
            "activeUsers": random.randint(500, 3000),
            "returningUsers": random.randint(200, 1500),
        },
    }
