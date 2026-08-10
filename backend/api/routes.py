"""
API routes for Sentinel AI Ops.
"""

from flask import Blueprint, jsonify
from backend.core.services import incident_service
print("Routes IncidentService ID:", id(incident_service))

print("✅ routes.py loaded")


api = Blueprint("api", __name__)


@api.route("/")
def home():

    return {
        "application": "Sentinel AI Ops",
        "status": "Running"
    }


@api.route("/incidents")
def incidents():

    data = []

    for incident in incident_service.get_all_incidents():

        data.append(
            {
                "incident_id": incident.incident_id,
                "service_name": incident.service_name,
                "severity": incident.severity,
                "status": incident.status,
                "description": incident.description,
            }
        )

    return jsonify(data)


@api.route("/incidents/open")
def open_incidents():

    data = []

    for incident in incident_service.get_open_incidents():

        data.append(
            {
                "incident_id": incident.incident_id,
                "service_name": incident.service_name,
                "severity": incident.severity,
                "status": incident.status,
            }
        )

    return jsonify(data)
