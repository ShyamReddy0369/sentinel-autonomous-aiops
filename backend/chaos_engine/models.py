"""
Core data models for Sentinel AI Ops.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


# ==========================================================
# Service Metrics
# ==========================================================

@dataclass
class ServiceMetrics:
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    latency_ms: int
    requests_per_second: int
    error_rate: float
    active_connections: int
    updated_at: datetime = field(default_factory=_utc_now)


# ==========================================================
# Service State
# ==========================================================

@dataclass
class ServiceState:
    name: str
    owner: str
    criticality: str
    metrics: ServiceMetrics
    healthy: bool = True


# ==========================================================
# Incident Model
# ==========================================================

@dataclass
class Incident:
    """
    Represents an operational incident.
    """

    incident_id: str
    service_name: str
    severity: str
    status: str = "OPEN"
    description: str = ""
    root_cause: str | None = None
    remediation: str | None = None
    created_at: datetime = field(default_factory=_utc_now)
