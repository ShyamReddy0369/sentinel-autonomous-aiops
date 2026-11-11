from flask import Blueprint, jsonify, request

from backend.core.services import incident_service


events = Blueprint(
    "events",
    __name__,
)


def determine_severity(event_type, status_code, error):

    event_type = (event_type or "").upper()
    error = (error or "").lower()

    if status_code in [500, 502, 503, 504]:
        return "HIGH"

    if "connection" in error:
        return "HIGH"

    if event_type in [
        "API_FAILURE",
        "CONNECTION_ERROR",
    ]:
        return "HIGH"

    return "MEDIUM"


@events.route(
    "/events",
    methods=["POST"],
)
def receive_event():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    service_name = data.get(
        "service_name"
    )

    event_type = data.get(
        "event_type"
    )

    endpoint = data.get(
        "endpoint"
    )

    status_code = data.get(
        "status_code"
    )

    error = data.get(
        "error"
    )

    if not service_name:
        return jsonify({
            "success": False,
            "message": "service_name is required.",
        }), 400

    if not event_type:
        return jsonify({
            "success": False,
            "message": "event_type is required.",
        }), 400

    severity = determine_severity(
        event_type,
        status_code,
        error,
    )

    description = (
        f"{event_type} detected on "
        f"{endpoint or 'unknown endpoint'}. "
        f"HTTP status: "
        f"{status_code or 'N/A'}. "
        f"Error: "
        f"{error or 'Unknown error'}"
    )

    incident = incident_service.create_incident(
        service_name=service_name,
        severity=severity,
        description=description,
    )

    if incident is None:

        return jsonify({
            "success": False,
            "message": (
                "An active incident already exists "
                "for this service."
            ),
            "service_name": service_name,
        }), 409

    print(
        f"[EVENT] {event_type} | "
        f"{service_name} | "
        f"Severity: {severity}"
    )

    print(
        f"[INCIDENT CREATED] "
        f"{incident.incident_id}"
    )

    return jsonify({
        "success": True,
        "message": "Event received and incident created.",
        "incident_id": incident.incident_id,
        "service_name": incident.service_name,
        "severity": incident.severity,
        "status": incident.status,
        "description": incident.description,
    }), 201
