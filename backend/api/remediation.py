from flask import Blueprint, jsonify, request

from backend.agents.diagnosis_agent import DiagnosisAgent
from backend.agents.remediation_agent import RemediationAgent
from backend.agents.safety_agent import SafetyAgent

from backend.chaos_engine.simulator import (
    apply_remediation,
    sync_anomalies_to_incidents,
)

from backend.core.services import incident_service

from backend.services.audit_service import audit_service

from backend.api.settings import runtime_settings


remediation = Blueprint(
    "remediation",
    __name__,
)


remediation_cache = {}


def build_remediation(incident):

    incident_id = incident.incident_id

    if incident_id in remediation_cache:
        return remediation_cache[incident_id]

    audit_service.log(
        event_type="AI_ANALYSIS_STARTED",
        incident_id=incident_id,
        service_name=incident.service_name,
        details="AI diagnosis started.",
    )

    diagnosis_agent = DiagnosisAgent()

    remediation_agent = RemediationAgent()

    safety_agent = SafetyAgent()

    diagnosis = diagnosis_agent.diagnose(
        incident
    )

    audit_service.log(
        event_type="AI_DIAGNOSIS",
        incident_id=incident_id,
        service_name=incident.service_name,
        details=(
            f"Root cause: "
            f"{diagnosis['root_cause']} | "
            f"Confidence: "
            f"{diagnosis['confidence']}%"
        ),
        actor="AI_DIAGNOSIS_AGENT",
    )

    recommendation = remediation_agent.recommend(
        incident,
        diagnosis,
    )

    audit_service.log(
        event_type="AI_RECOMMENDATION",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=recommendation["action"],
        details=recommendation["reason"],
        actor="AI_REMEDIATION_AGENT",
    )

    # -------------------------------------------------
    # CONFIDENCE POLICY
    # -------------------------------------------------

    confidence = diagnosis["confidence"]

    confidence_threshold = runtime_settings[
        "confidence_threshold"
    ]

    confidence_requires_approval = (
        confidence < confidence_threshold
    )

    requires_approval = (
        recommendation.get("requires_approval", True)
        or confidence_requires_approval
        or runtime_settings.get("human_approval", True)
        or getattr(incident, "severity", "HIGH") in ("CRITICAL", "HIGH")
    )

    # -------------------------------------------------
    # SAFETY VALIDATION
    # -------------------------------------------------

    safety = safety_agent.validate(
        action=recommendation["action"],
        risk=recommendation["risk"],
        requires_approval=requires_approval,
    )

    audit_service.log(
        event_type="SAFETY_VALIDATION",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=recommendation["action"],
        details=(
            f"Status: {safety['status']} | "
            f"Risk: {recommendation['risk']} | "
            f"Confidence: {confidence}% | "
            f"Threshold: {confidence_threshold}%"
        ),
        actor="SAFETY_AGENT",
    )

    result = {
        "incident_id": incident_id,
        "service_name": incident.service_name,
        "action": recommendation["action"],
        "reason": recommendation["reason"],
        "risk": recommendation["risk"],
        "requires_approval": safety[
            "requires_approval"
        ],
        "status": safety["status"],
    }

    # Keep useful AI information in the response
    result["confidence"] = confidence
    result["confidence_threshold"] = confidence_threshold
    result["autonomous_remediation"] = runtime_settings[
        "autonomous_remediation"
    ]

    remediation_cache[incident_id] = result

    return result


# =================================================
# GET LATEST / HIGHEST PRIORITY REMEDIATION
# =================================================

@remediation.route(
    "/remediation",
    methods=["GET"],
)
def latest_remediation():

    try:
        # Guarantee telemetry anomalies are actively mapped to incidents
        sync_anomalies_to_incidents()

        incidents = (
            incident_service
            .get_open_incidents()
        )

        print(
            "OPEN INCIDENTS:",
            incidents,
        )

        if not incidents:

            return jsonify({
                "action": "No action required",
                "reason": "No active incidents.",
                "risk": "LOW",
                "requires_approval": False,
                "status": "IDLE",
            })

        critical = [
            incident
            for incident in incidents
            if incident.severity == "CRITICAL"
        ]

        incident = (
            critical[0]
            if critical
            else incidents[0]
        )

        result = build_remediation(
            incident
        )

        return jsonify(result)

    except Exception as error:

        print(
            "REMEDIATION ERROR:",
            type(error).__name__,
            str(error),
        )

        return jsonify({
            "error": type(error).__name__,
            "message": str(error),
        }), 500


# =================================================
# GET REMEDIATION FOR SPECIFIC INCIDENT
# =================================================

@remediation.route(
    "/remediation/<incident_id>",
    methods=["GET"],
)
def remediation_for_incident(incident_id):

    try:

        incidents = (
            incident_service
            .get_open_incidents()
        )

        incident = next(
            (
                item
                for item in incidents
                if item.incident_id == incident_id
            ),
            None,
        )

        if incident is None:

            return jsonify({
                "status": "ERROR",
                "message": (
                    "Incident not found "
                    "or already resolved."
                ),
            }), 404

        result = build_remediation(
            incident
        )

        return jsonify(result)

    except Exception as error:

        print(
            "INCIDENT REMEDIATION ERROR:",
            type(error).__name__,
            str(error),
        )

        return jsonify({
            "error": type(error).__name__,
            "message": str(error),
        }), 500


# =================================================
# EXECUTE REMEDIATION
# =================================================

@remediation.route(
    "/remediation/execute",
    methods=["POST"],
)
def execute_remediation():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    incident_id = data.get(
        "incident_id"
    )

    action = data.get(
        "action",
        "Simulated remediation",
    )

    if not incident_id:

        return jsonify({
            "status": "ERROR",
            "message": (
                "incident_id is required."
            ),
        }), 400

    incidents = (
        incident_service
        .get_open_incidents()
    )

    incident = next(
        (
            item
            for item in incidents
            if item.incident_id == incident_id
        ),
        None,
    )

    if incident is None:

        return jsonify({
            "status": "ERROR",
            "message": (
                "Incident not found "
                "or already resolved."
            ),
        }), 404

    if data.get("approved") is not True:

        audit_service.log(
            event_type="EXECUTION_BLOCKED",
            incident_id=incident_id,
            service_name=incident.service_name,
            details=(
                "Execution attempted without "
                "explicit approval."
            ),
            actor="SYSTEM",
        )

        return jsonify({
            "status": "APPROVAL_REQUIRED",
            "message": (
                "Explicit approval is required."
            ),
        }), 403

    audit_service.log(
        event_type="REMEDIATION_APPROVED",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=action,
        details="Human approved remediation.",
        actor="HUMAN_OPERATOR",
    )

    audit_service.log(
        event_type="EXECUTION_STARTED",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=action,
        details="Simulated execution started.",
        actor="REMEDIATION_EXECUTOR",
    )

    result = apply_remediation(
        service_name=incident.service_name,
        action=action,
    )

    if not result["success"]:

        audit_service.log(
            event_type="EXECUTION_FAILED",
            incident_id=incident_id,
            service_name=incident.service_name,
            action=action,
            details=result["message"],
            actor="REMEDIATION_EXECUTOR",
        )

        return jsonify({
            "status": "FAILED",
            "message": result["message"],
        }), 500

    audit_service.log(
        event_type="EXECUTION_COMPLETED",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=action,
        details=(
            f"Service recovered. "
            f"CPU: {result['cpu']}%, "
            f"Memory: {result['memory']}%."
        ),
        actor="REMEDIATION_EXECUTOR",
    )

    incident_service.resolve_incident(
        incident.service_name
    )

    audit_service.log(
        event_type="INCIDENT_RESOLVED",
        incident_id=incident_id,
        service_name=incident.service_name,
        action=action,
        details=(
            "Incident resolved after "
            "successful remediation."
        ),
        actor="SYSTEM",
    )

    remediation_cache.pop(
        incident_id,
        None,
    )

    return jsonify({
        "status": "EXECUTED",
        "incident_id": incident_id,
        "service_name": incident.service_name,
        "action": action,
        "message": (
            "Service remediated successfully."
        ),
        "service_status": "HEALTHY",
        "cpu": result["cpu"],
        "memory": result["memory"],
        "incident_status": "RESOLVED",
    })


# =================================================
# REJECT REMEDIATION
# =================================================

@remediation.route(
    "/remediation/reject",
    methods=["POST"],
)
def reject_remediation():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    incident_id = data.get(
        "incident_id"
    )

    if not incident_id:

        return jsonify({
            "status": "ERROR",
            "message": (
                "incident_id is required."
            ),
        }), 400

    incidents = (
        incident_service
        .get_open_incidents()
    )

    incident = next(
        (
            item
            for item in incidents
            if item.incident_id == incident_id
        ),
        None,
    )

    if incident:

        audit_service.log(
            event_type="REMEDIATION_REJECTED",
            incident_id=incident_id,
            service_name=incident.service_name,
            details=(
                "Human rejected the "
                "AI remediation recommendation."
            ),
            actor="HUMAN_OPERATOR",
        )

    remediation_cache.pop(
        incident_id,
        None,
    )

    return jsonify({
        "status": "REJECTED",
        "message": (
            "Remediation recommendation rejected."
        ),
    })
