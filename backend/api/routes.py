"""
API routes for Sentinel AI Ops.
"""

from typing import Any, Dict, List
from flask import Blueprint, jsonify, Response
from backend.chaos_engine.models import Incident
from backend.core.services import incident_service
from backend.services.postmortem_service import postmortem_service

api = Blueprint("api", __name__)


@api.route("/")
def home() -> Dict[str, str]:
    return {
        "application": "Sentinel AI Ops",
        "status": "Running",
        "version": "1.0.0",
    }


@api.route("/incidents")
def incidents() -> Response:
    data: List[Dict[str, Any]] = []
    all_incidents: List[Incident] = incident_service.get_all_incidents()
    for incident in all_incidents:
        data.append(
            {
                "incident_id": incident.incident_id,
                "service_name": incident.service_name,
                "severity": incident.severity,
                "status": incident.status,
                "description": incident.description,
                "created_at": getattr(incident, "created_at", None),
            }
        )
    return jsonify(data)


@api.route("/incidents/open")
def open_incidents() -> Response:
    data: List[Dict[str, Any]] = []
    open_inc: List[Incident] = incident_service.get_open_incidents()
    for incident in open_inc:
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


@api.route("/incidents/<incident_id>/postmortem")
def get_postmortem(incident_id: str) -> Response:
    report: Dict[str, Any] = postmortem_service.generate(incident_id)
    return jsonify(report)
