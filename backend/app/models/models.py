"""
SQLAlchemy ORM models for analytics data.
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, func
from database.connection import Base


class MetricSnapshot(Base):
    """KPI metrics snapshot at a point in time."""
    __tablename__ = "metric_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    active_users = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    conversion_rate = Column(Float, nullable=False)
    traffic_sources = Column(Integer, nullable=False)


class TrafficRecord(Base):
    """Website traffic data over time."""
    __tablename__ = "traffic_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    page_views = Column(Integer, nullable=False)
    unique_visitors = Column(Integer, nullable=False)
    bounce_rate = Column(Float, nullable=False)
    source = Column(String(50), nullable=False)


class SalesRecord(Base):
    """Product sales data."""
    __tablename__ = "sales_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    product = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    category = Column(String(50), nullable=False)


class UserRecord(Base):
    """User signups and activity data."""
    __tablename__ = "user_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    signups = Column(Integer, nullable=False)
    active_users = Column(Integer, nullable=False)
    returning_users = Column(Integer, nullable=False)
