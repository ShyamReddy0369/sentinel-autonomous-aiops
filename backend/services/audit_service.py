from datetime import datetime


class AuditService:

    def __init__(self):
        self.events = []

    def log(
        self,
        event_type: str,
        incident_id: str | None = None,
        service_name: str | None = None,
        action: str | None = None,
        details: str | None = None,
        actor: str = "SYSTEM",
    ):

        event = {
            "timestamp": datetime.utcnow().isoformat(),
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

    def get_all(self):
        return list(reversed(self.events))

    def get_for_incident(
        self,
        incident_id: str,
    ):

        return [
            event
            for event in self.events
            if event["incident_id"]
            == incident_id
        ]


audit_service = AuditService()
