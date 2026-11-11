from typing import Any, List
from backend.agents.orchestrator import AgentOrchestrator
from backend.agents.models import AnalysisReport
from backend.chaos_engine.models import Incident


def test_agent_orchestrator() -> None:
    incident: Incident = Incident(
        incident_id="INC-000001",
        service_name="Authentication Service",
        severity="CRITICAL",
        description="CPU utilization exceeded 95%",
    )
    orchestrator: AgentOrchestrator = AgentOrchestrator()
    report: AnalysisReport = orchestrator.process_incident(incident)

    assert report.incident_id == "INC-000001"
    assert report.service_name == "Authentication Service"
    assert "root_cause" in report.diagnosis
    steps: List[Any] = report.execution_plan.get("steps", [])
    assert len(steps) > 0
    assert "action" in report.remediation
    completed: List[Any] = report.remediation.get("completed_actions", [])
    assert len(completed) > 0
    assert "summary" in report.remediation


if __name__ == "__main__":
    test_agent_orchestrator()
    print("Orchestrator test passed.")
