from backend.chaos_engine.health import HealthEngine
from backend.chaos_engine.incident_service import IncidentService

health_engine = HealthEngine()
incident_service = IncidentService()

print("IncidentService ID:", id(incident_service))
