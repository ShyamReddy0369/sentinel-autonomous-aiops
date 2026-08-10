from flask import Blueprint, jsonify

from backend.services.audit_service import (
    audit_service,
)


audit = Blueprint(
    "audit",
    __name__,
)


@audit.route(
    "/audit",
    methods=["GET"],
)
def get_audit_logs():

    return jsonify(
        audit_service.get_all()
    )


@audit.route(
    "/audit/<incident_id>",
    methods=["GET"],
)
def get_incident_audit(incident_id):

    return jsonify(
        audit_service.get_for_incident(
            incident_id
        )
    )
