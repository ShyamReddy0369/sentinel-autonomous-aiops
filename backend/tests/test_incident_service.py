from backend.chaos_engine.incident_service import IncidentService
from backend.chaos_engine.models import Incident


def test_incident_service_creation() -> None:
    service: IncidentService = IncidentService()

    incident: Incident | None = service.create_incident(
        service_name="Payment Service",
        severity="HIGH",
        description="Database connection timeout",
    )

    assert incident is not None
    assert incident.incident_id.startswith("INC-")
    assert incident.service_name == "Payment Service"
    assert incident.severity == "HIGH"
    assert incident.status == "OPEN"
    assert incident.description == "Database connection timeout"


if __name__ == "__main__":
    test_incident_service_creation()
    print("Incident service creation test passed.")
