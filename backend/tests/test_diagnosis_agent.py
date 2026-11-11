from typing import Any, Dict
from backend.agents.diagnosis_agent import DiagnosisAgent
from backend.chaos_engine.models import Incident


def test_diagnosis_agent() -> None:
    incident: Incident = Incident(
        incident_id="INC-000001",
        service_name="Authentication Service",
        severity="CRITICAL",
        description="CPU utilization exceeded 95%",
    )
    agent: DiagnosisAgent = DiagnosisAgent()
    report: Dict[str, Any] = agent.diagnose(incident)
    assert report is not None
    assert "root_cause" in report
    assert "confidence" in report
    assert 0 <= int(report["confidence"]) <= 100
    assert "recommendation" in report


if __name__ == "__main__":
    test_diagnosis_agent()
    print("Diagnosis agent test passed.")
