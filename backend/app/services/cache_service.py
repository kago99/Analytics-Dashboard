"""
Simple in-memory cache service.
Uses TTL-based expiration. Can be replaced with Redis later.
"""

import time
from typing import Any, Optional

_cache: dict[str, tuple[Any, float]] = {}

DEFAULT_TTL = 30  # seconds


def cache_get(key: str) -> Optional[Any]:
    """Get a value from cache. Returns None if expired or missing."""
    if key in _cache:
        value, expires_at = _cache[key]
        if time.time() < expires_at:
            return value
        del _cache[key]
    return None


def cache_set(key: str, value: Any, ttl: int = DEFAULT_TTL) -> None:
    """Set a value in cache with TTL in seconds."""
    _cache[key] = (value, time.time() + ttl)


def cache_invalidate(prefix: str = "") -> None:
    """Invalidate all cache entries matching prefix."""
    keys_to_delete = [k for k in _cache if k.startswith(prefix)]
    for k in keys_to_delete:
        del _cache[k]
