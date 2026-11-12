import json
import logging
import os
from typing import TypedDict
from dotenv import load_dotenv
from groq import Groq

from backend.agents.base_agent import BaseAgent
from backend.chaos_engine.models import Incident

load_dotenv()
logger = logging.getLogger(__name__)


class DiagnosisResult(TypedDict):
    root_cause: str
    confidence: int
    recommendation: str


class DiagnosisAgent(BaseAgent):
    """
    Autonomous AI SRE Diagnosis Agent.
    Leverages Groq LLM inference when available, with resilient SRE heuristics fallback.
    """

    def __init__(self) -> None:
        super().__init__("Diagnosis Agent")
        self.api_key: str | None = os.getenv("GROQ_API_KEY")
        self.client: Groq | None = None

        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

        # Default to a reliable Groq model
        model_env: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        if "/" in model_env and not model_env.startswith("llama"):
            self.model: str = "llama-3.1-8b-instant"
        else:
            self.model = model_env

    def _extract_fields(self, incident: object) -> tuple[str, str, str, str]:
        """Safely extract service_name, severity, status, and description."""
        if isinstance(incident, Incident):
            return (
                incident.service_name,
                incident.severity,
                incident.status,
                incident.description,
            )
        elif isinstance(incident, dict):
            return (
                str(incident.get("service_name", "Unknown")),
                str(incident.get("severity", "HIGH")),
                str(incident.get("status", "OPEN")),
                str(incident.get("description", "Service anomaly")),
            )
        else:
            return (
                str(getattr(incident, "service_name", str(incident))),
                str(getattr(incident, "severity", "HIGH")),
                str(getattr(incident, "status", "OPEN")),
                str(getattr(incident, "description", "Service anomaly")),
            )

    def _fallback_diagnosis(self, incident: object) -> DiagnosisResult:
        """Domain-expert SRE heuristic diagnosis when LLM is offline or unreachable."""
        service, severity, _, desc = self._extract_fields(incident)
        desc_lower = desc.lower()
        service_lower = service.lower()

        if "auth" in service_lower or "cpu" in desc_lower:
            return DiagnosisResult(
                root_cause="Thread pool saturation and recursive token validation causing severe CPU spike (>95%).",
                confidence=98 if severity == "CRITICAL" else 92,
                recommendation="Restart affected authentication pods and throttle incoming token requests.",
            )
        elif "payment" in service_lower or "database" in desc_lower or "timeout" in desc_lower:
            return DiagnosisResult(
                root_cause="Database connection pool exhaustion and query lock contention on checkout table.",
                confidence=95,
                recommendation="Cycle DB connection pool and failover active payment queries to secondary replica.",
            )
        elif "inventory" in service_lower or "memory" in desc_lower:
            return DiagnosisResult(
                root_cause="Unbounded cache growth in product catalog index leading to critical memory pressure (>90%).",
                confidence=93,
                recommendation="Purge in-memory catalog cache and restart inventory worker with memory limits.",
            )
        elif "search" in service_lower or "job" in desc_lower:
            return DiagnosisResult(
                root_cause="Unindexed search query surge causing query queue buildup and database latency.",
                confidence=91,
                recommendation="Enable query cache throttling and scale search worker instances.",
            )
        else:
            return DiagnosisResult(
                root_cause=f"Resource exhaustion and anomalous latency degradation in {service}.",
                confidence=88,
                recommendation=f"Perform rolling restart of {service} and verify upstream health.",
            )

    def diagnose(self, incident: object) -> DiagnosisResult:
        """Analyze an incident and identify the root cause."""
        if not self.client:
            return self._fallback_diagnosis(incident)

        service_name, severity, status, description = self._extract_fields(incident)

        prompt: str = f"""
You are an expert Site Reliability Engineer.

Analyze this infrastructure incident.

Service: {service_name}
Severity: {severity}
Status: {status}
Description: {description}

Return ONLY valid JSON in exactly this format:

{{
    "root_cause": "brief explanation of the likely root cause",
    "confidence": 0,
    "recommendation": "specific safe recommendation"
}}

Rules:
- confidence must be an integer between 0 and 100
- root_cause must be concise
- recommendation must be actionable
- do not include markdown or explanations outside the JSON
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are Sentinel's autonomous "
                            "infrastructure diagnosis agent."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.2,
                timeout=5.0,
            )

            content = response.choices[0].message.content
            if not content:
                return self._fallback_diagnosis(incident)

            content = content.strip()
            if content.startswith("```"):
                content = content.replace("```json", "", 1).replace("```", "").strip()

            parsed: object = json.loads(content)
            if isinstance(parsed, dict):
                return DiagnosisResult(
                    root_cause=str(parsed.get("root_cause", "")),
                    confidence=int(parsed.get("confidence", 85)),
                    recommendation=str(parsed.get("recommendation", "")),
                )
            return self._fallback_diagnosis(incident)
        except Exception as e:
            logger.info(f"Groq diagnosis failed ({type(e).__name__}); using SRE heuristic fallback.")
            return self._fallback_diagnosis(incident)

    def run(self, context: object) -> DiagnosisResult:
        """BaseAgent implementation."""
        return self.diagnose(context)
