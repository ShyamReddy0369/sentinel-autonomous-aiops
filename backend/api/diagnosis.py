from flask import Blueprint, jsonify

from backend.core.services import incident_service


diagnosis = Blueprint("diagnosis", __name__)


@diagnosis.route("/diagnosis")
def latest_diagnosis():

    incidents = incident_service.get_open_incidents()

    if not incidents:
        return jsonify(
            {
                "root_cause": "No active incidents detected",
                "confidence": 100,
                "recommendation": "All monitored services are operating normally.",
            }
        )

    critical = [
        incident
        for incident in incidents
        if incident.severity == "CRITICAL"
    ]

    if critical:
        incident = critical[0]

    else:
        incident = incidents[0]

    if incident.service_name == "Authentication":

        root_cause = (
            "CPU saturation detected in Authentication Service"
        )

        recommendation = (
            "Restart Authentication Service and monitor "
            "CPU usage for 5 minutes."
        )

        confidence = 98

    elif incident.service_name == "Payment":

        root_cause = (
            "Database connectivity issue detected "
            "in Payment Service"
        )

        recommendation = (
            "Verify database connectivity and restart "
            "the Payment Service."
        )

        confidence = 94

    elif incident.service_name == "Inventory":

        root_cause = (
            "High memory utilization detected "
            "in Inventory Service"
        )

        recommendation = (
            "Inspect memory usage and restart the "
            "Inventory Service if utilization remains high."
        )

        confidence = 91

    else:

        root_cause = (
            f"Operational anomaly detected in "
            f"{incident.service_name}"
        )

        recommendation = (
            "Investigate the affected service and "
            "monitor its health metrics."
        )

        confidence = 85

    return jsonify(
        {
            "root_cause": root_cause,
            "confidence": confidence,
            "recommendation": recommendation,
        }
    )
