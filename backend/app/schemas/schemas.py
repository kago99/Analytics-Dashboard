"""
Pydantic response schemas for API endpoints.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


# --- Metrics ---
class MetricResponse(BaseModel):
    timestamp: datetime
    activeUsers: int = Field(alias="active_users")
    revenue: float
    conversionRate: float = Field(alias="conversion_rate")
    trafficSources: int = Field(alias="traffic_sources")

    model_config = {"from_attributes": True, "populate_by_name": True}


class MetricListResponse(BaseModel):
    data: List[MetricResponse]
    total: int
    page: int
    limit: int


# --- Traffic ---
class TrafficResponse(BaseModel):
    timestamp: datetime
    pageViews: int = Field(alias="page_views")
    uniqueVisitors: int = Field(alias="unique_visitors")
    bounceRate: float = Field(alias="bounce_rate")
    source: str

    model_config = {"from_attributes": True, "populate_by_name": True}


class TrafficListResponse(BaseModel):
    data: List[TrafficResponse]
    total: int
    page: int
    limit: int


# --- Sales ---
class SalesResponse(BaseModel):
    timestamp: datetime
    product: str
    amount: float
    quantity: int
    category: str

    model_config = {"from_attributes": True, "populate_by_name": True}


class SalesListResponse(BaseModel):
    data: List[SalesResponse]
    total: int
    page: int
    limit: int


# --- Users ---
class UserResponse(BaseModel):
    timestamp: datetime
    signups: int
    activeUsers: int = Field(alias="active_users")
    returningUsers: int = Field(alias="returning_users")

    model_config = {"from_attributes": True, "populate_by_name": True}


class UserListResponse(BaseModel):
    data: List[UserResponse]
    total: int
    page: int
    limit: int


# --- WebSocket Live Data ---
class LiveUpdate(BaseModel):
    type: str  # "metrics" | "traffic" | "sales" | "users"
    timestamp: datetime
    data: dict
