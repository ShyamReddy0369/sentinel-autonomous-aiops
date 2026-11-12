from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class AuditService:

    def __init__(self) -> None:
        self.events: List[Dict[str, Any]] = []

    def log(
        self,
        event_type: str,
        incident_id: Optional[str] = None,
        service_name: Optional[str] = None,
        action: Optional[str] = None,
        details: Optional[str] = None,
        actor: str = "SYSTEM",
    ) -> Dict[str, Any]:

        event: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "incident_id": incident_id,
            "service_name": service_name,
            "action": action,
            "details": details,
            "actor": actor,
        }

        self.events.append(event)

        print(
            f"[AUDIT] {event_type} | "
            f"{incident_id} | "
            f"{actor}"
        )

        return event

    def get_all(self) -> List[Dict[str, Any]]:
        return list(reversed(self.events))

    def get_for_incident(
        self,
        incident_id: str,
    ) -> List[Dict[str, Any]]:

        return [
            event
            for event in self.events
            if event.get("incident_id") == incident_id
        ]


audit_service: AuditService = AuditService()
