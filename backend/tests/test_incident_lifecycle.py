from backend.chaos_engine.incident_service import IncidentService
from backend.chaos_engine.models import Incident


def test_incident_lifecycle() -> None:
    service: IncidentService = IncidentService()

    incident: Incident | None = service.create_incident(
        service_name="Authentication Service",
        severity="CRITICAL",
        description="CPU exceeded 95%",
    )

    assert incident is not None
    assert incident.status == "OPEN"

    # Deduplication - second attempt for the same active service returns None
    duplicate: Incident | None = service.create_incident(
        service_name="Authentication Service",
        severity="CRITICAL",
        description="Another CPU spike",
    )
    assert duplicate is None

    resolved: Incident | None = service.resolve_incident("Authentication Service")
    assert resolved is not None
    assert resolved.status == "RESOLVED"
    assert "Authentication Service" not in service.active_incidents


if __name__ == "__main__":
    test_incident_lifecycle()
    print("Incident lifecycle test passed.")
