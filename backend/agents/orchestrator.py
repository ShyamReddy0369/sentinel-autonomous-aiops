"""
Agent Orchestrator for Sentinel AI Ops.

Coordinates all AI agents: Diagnosis, Planner, and Remediation.
"""

from typing import Any, Dict
from backend.agents.diagnosis_agent import DiagnosisAgent
from backend.agents.models import AnalysisReport
from backend.agents.planner_agent import PlannerAgent
from backend.agents.remediation_agent import RemediationAgent
from backend.chaos_engine.models import Incident


class AgentOrchestrator:

    def __init__(self) -> None:
        self.diagnosis_agent: DiagnosisAgent = DiagnosisAgent()
        self.planner_agent: PlannerAgent = PlannerAgent()
        self.remediation_agent: RemediationAgent = RemediationAgent()

    def process_incident(self, incident: Incident) -> AnalysisReport:
        diagnosis: Dict[str, Any] = self.diagnosis_agent.diagnose(incident)
        plan: Dict[str, Any] = self.planner_agent.run(diagnosis)
        rec: Dict[str, Any] = self.remediation_agent.recommend(incident, diagnosis)

        remediation_data: Dict[str, Any] = {
            "action": rec["action"],
            "reason": rec["reason"],
            "risk": rec["risk"],
            "requires_approval": rec["requires_approval"],
            "completed_actions": [
                {"action": rec["action"], "status": "PLANNED"}
            ],
            "summary": f"Remediation: {rec['action']} ({rec['risk']} risk). {rec['reason']}",
        }

        return AnalysisReport(
            incident_id=incident.incident_id,
            service_name=incident.service_name,
            severity=incident.severity,
            diagnosis=diagnosis,
            execution_plan=plan,
            remediation=remediation_data,
        )
