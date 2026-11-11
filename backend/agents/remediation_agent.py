import json
import logging
import os
from typing import Any, Dict
from dotenv import load_dotenv
from groq import Groq

from backend.agents.base_agent import BaseAgent
from backend.chaos_engine.models import Incident

load_dotenv()
logger = logging.getLogger(__name__)


class RemediationAgent(BaseAgent):
    """
    Autonomous AI SRE Remediation Agent.
    Recommends safe, actionable remediation steps with fallback heuristics.
    """

    def __init__(self) -> None:
        super().__init__("Remediation Agent")
        self.api_key: str | None = os.getenv("GROQ_API_KEY")
        self.client: Groq | None = None

        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

        model_env: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        if "/" in model_env and not model_env.startswith("llama"):
            self.model: str = "llama-3.1-8b-instant"
        else:
            self.model = model_env

    def _fallback_recommend(
        self, incident: Incident | Any, diagnosis: Dict[str, Any] | Any
    ) -> Dict[str, Any]:
        """Domain-expert SRE heuristic remediation when LLM is offline or unreachable."""
        service: str = str(getattr(incident, "service_name", "Service"))
        diag_dict: Dict[str, Any] = diagnosis if isinstance(diagnosis, dict) else {}
        root_cause: str = str(diag_dict.get("root_cause", "")).lower()

        if "cpu" in root_cause or "auth" in service.lower():
            return {
                "action": "restart_service",
                "reason": f"Recycle {service} instances to clear runaway thread saturation and reset CPU state.",
                "risk": "LOW",
                "requires_approval": False,
            }
        elif "database" in root_cause or "connection" in root_cause or "payment" in service.lower():
            return {
                "action": "restart_database",
                "reason": "Flush deadlocked connection pool and restart DB connection gateway to restore connectivity.",
                "risk": "HIGH",
                "requires_approval": True,
            }
        elif "memory" in root_cause or "inventory" in service.lower():
            return {
                "action": "purge_cache_and_restart",
                "reason": f"Purge corrupted cache allocation and restart {service} to reclaim heap memory.",
                "risk": "MEDIUM",
                "requires_approval": True,
            }
        else:
            return {
                "action": "rolling_restart",
                "reason": f"Execute safe graceful restart of {service} to restore operational metrics.",
                "risk": "LOW",
                "requires_approval": False,
            }

    def recommend(
        self, incident: Incident | Any, diagnosis: Dict[str, Any] | Any
    ) -> Dict[str, Any]:
        """Determine the safest remediation action."""
        if not self.client:
            return self._fallback_recommend(incident, diagnosis)

        diag_dict: Dict[str, Any] = diagnosis if isinstance(diagnosis, dict) else {}
        root_cause: str = str(diag_dict.get("root_cause", "Anomaly"))
        confidence: int = int(diag_dict.get("confidence", 90))

        service_name: str = str(getattr(incident, "service_name", "Unknown"))
        severity: str = str(getattr(incident, "severity", "HIGH"))
        description: str = str(getattr(incident, "description", ""))

        prompt: str = f"""
You are an autonomous Site Reliability Engineering remediation agent.

Incident:
Service: {service_name}
Severity: {severity}
Description: {description}

Diagnosis:
Root Cause: {root_cause}
Confidence: {confidence}%

Determine the safest remediation action.

Return ONLY valid JSON:

{{
  "action": "short action name",
  "reason": "why this action is appropriate",
  "risk": "LOW or MEDIUM or HIGH",
  "requires_approval": true
}}

Rules:
- Never recommend destructive actions.
- Never delete data.
- Never expose credentials.
- Critical or database actions must require approval.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a production infrastructure "
                            "remediation agent. Prioritize safety."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.1,
                timeout=5.0,
            )

            content = response.choices[0].message.content
            if not content:
                return self._fallback_recommend(incident, diagnosis)

            content = content.strip()
            if content.startswith("```"):
                content = content.replace("```json", "", 1).replace("```", "").strip()

            result: Dict[str, Any] = json.loads(content)
            return {
                "action": str(result.get("action", "restart_service")),
                "reason": str(result.get("reason", "Service remediation")),
                "risk": str(result.get("risk", "LOW")).upper(),
                "requires_approval": bool(result.get("requires_approval", False)),
            }
        except Exception as e:
            logger.info(f"Groq remediation failed ({type(e).__name__}); using SRE heuristic fallback.")
            return self._fallback_recommend(incident, diagnosis)

    def run(self, context: Any) -> Dict[str, Any]:
        """
        BaseAgent implementation.
        Accepts context (incident, plan, or dict) and returns full remediation report.
        """
        incident: Any = getattr(context, "incident", context)
        diagnosis: Dict[str, Any] = getattr(
            context, "diagnosis", {"root_cause": "System anomaly", "confidence": 90}
        )

        rec: Dict[str, Any] = self.recommend(incident, diagnosis)
        return {
            "agent": self.name,
            "action": rec["action"],
            "reason": rec["reason"],
            "risk": rec["risk"],
            "requires_approval": rec["requires_approval"],
            "completed_actions": [
                {"action": rec["action"], "status": "PLANNED"}
            ],
            "summary": f"Recommended action '{rec['action']}' ({rec['risk']} risk): {rec['reason']}",
        }
