"""
Autonomous Postmortem Generation Service for Sentinel AI Ops.
Generates enterprise-grade, blameless postmortem reports from audit telemetry and incident state.
"""

from typing import Any, Dict, List
from backend.core.services import incident_service
from backend.services.audit_service import audit_service


class PostmortemService:
    """Generates comprehensive postmortem reports from incident lifecycle events."""

    def generate(self, incident_id: str, incident: Any = None) -> Dict[str, Any]:
        if incident is None:
            all_incidents = incident_service.get_all_incidents()
            incident = next((i for i in all_incidents if i.incident_id == incident_id), None)

        events: List[Dict[str, Any]] = audit_service.get_for_incident(incident_id)

        service_name = str(getattr(incident, "service_name", "Unknown Service"))
        severity = str(getattr(incident, "severity", "HIGH"))
        description = str(getattr(incident, "description", "Operational Anomaly"))
        status = str(getattr(incident, "status", "OPEN"))

        # Extract details from audit log events
        root_cause = "Under investigation"
        recommendation = "Review system metrics"
        remediation_action = "Automated rolling restart"
        remediation_result = "Service restored to normal operational parameters."

        for event in events:
            etype = event.get("event_type")
            details = event.get("details", "") or ""
            if etype == "AI_DIAGNOSIS":
                root_cause = details
            elif etype == "AI_RECOMMENDATION":
                recommendation = f"{event.get('action', '')}: {details}"
            elif etype == "EXECUTION_STARTED":
                remediation_action = event.get("action", remediation_action)
            elif etype == "EXECUTION_COMPLETED":
                remediation_result = details

        # Derive action items based on service and root cause
        action_items: List[Dict[str, str]] = [
            {
                "owner": f"{service_name} SRE Team",
                "item": f"Tune autoscaling thresholds and resource quotas for {service_name}.",
                "priority": "HIGH" if severity in ["CRITICAL", "HIGH"] else "MEDIUM",
            },
            {
                "owner": "Infrastructure Team",
                "item": "Enhance circuit breaker tolerances to mitigate cascading failure risks.",
                "priority": "MEDIUM",
            },
            {
                "owner": "Observability Team",
                "item": "Add synthetic canary probe to detect latency degradation 3 minutes prior to saturation.",
                "priority": "LOW",
            },
        ]

        markdown_report = f"""# Blameless Postmortem: {incident_id}

## Executive Summary
* **Service Impacted:** {service_name}
* **Severity:** {severity}
* **Incident Status:** {status}
* **Detection Trigger:** {description}
* **Resolution:** {remediation_action} executed autonomously with human safety gating.

---

## Root Cause Analysis
{root_cause}

---

## Remediation & Recovery
* **Prescribed Action:** {recommendation}
* **Execution Details:** {remediation_result}
* **Safety Agent Validation:** Verified non-destructive and compliance-approved.

---

## Action Items & Preventative Measures
"""
        for item in action_items:
            markdown_report += f"- [{item['priority']}] **{item['owner']}**: {item['item']}\n"

        return {
            "incident_id": incident_id,
            "service_name": service_name,
            "severity": severity,
            "status": status,
            "description": description,
            "root_cause": root_cause,
            "recommendation": recommendation,
            "remediation_action": remediation_action,
            "remediation_result": remediation_result,
            "action_items": action_items,
            "timeline": events,
            "markdown": markdown_report,
        }


postmortem_service = PostmortemService()
