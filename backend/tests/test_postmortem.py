from backend.services.postmortem_service import postmortem_service
from backend.chaos_engine.incident_service import IncidentService


def test_postmortem_generation() -> None:
    service = IncidentService()
    incident = service.create_incident(
        service_name="Payment Service",
        severity="HIGH",
        description="Database connection timeout",
    )
    assert incident is not None

    report = postmortem_service.generate(incident.incident_id, incident=incident)
    assert report["incident_id"] == incident.incident_id
    assert report["service_name"] == "Payment Service"
    assert "markdown" in report
    assert len(report["action_items"]) > 0


if __name__ == "__main__":
    test_postmortem_generation()
    print("Postmortem test passed.")
