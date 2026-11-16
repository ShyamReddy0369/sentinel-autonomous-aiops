"""
Autonomous Postmortem Agent for Sentinel AI Ops.
Synthesizes incident timelines, analyzes root causes, and generates blameless postmortem reports.
"""

from typing import Any, Dict, List, TypedDict
from backend.agents.base_agent import BaseAgent
from backend.services.postmortem_service import postmortem_service


class ActionItem(TypedDict):
    owner: str
    item: str
    priority: str


class PostmortemReport(TypedDict):
    incident_id: str
    service_name: str
    severity: str
    status: str
    description: str
    root_cause: str
    recommendation: str
    remediation_action: str
    remediation_result: str
    action_items: List[Dict[str, str]]
    timeline: List[Dict[str, Any]]
    markdown: str


class PostmortemAgent(BaseAgent):
    """
    Autonomous Blameless Postmortem & Preventative SRE Agent.
    Generates blameless postmortem reports and action items from audit telemetry.
    """

    def __init__(self) -> None:
        super().__init__("Postmortem Agent")

    def run(self, context: object) -> Dict[str, Any]:
        """
        Execute postmortem synthesis on incident context.
        Accepts incident_id string, Incident instance, or context dictionary.
        """
        incident_id: str = "INC-UNKNOWN"
        incident: object | None = None

        if isinstance(context, str):
            incident_id = context
        elif isinstance(context, dict):
            incident_id = str(context.get("incident_id", "INC-UNKNOWN"))
            incident = context.get("incident")
        else:
            incident_id = str(getattr(context, "incident_id", "INC-UNKNOWN"))
            incident = getattr(context, "incident", context)

        return postmortem_service.generate(incident_id, incident=incident)
