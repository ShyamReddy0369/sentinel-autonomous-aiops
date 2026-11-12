"""
Shared models used by AI agents.
"""

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict


@dataclass
class AnalysisReport:
    """
    Represents the complete AI analysis
    for an incident.
    """

    incident_id: str
    service_name: str
    severity: str

    diagnosis: Dict[str, Any]
    execution_plan: Dict[str, Any]
    remediation: Dict[str, Any]

    generated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
