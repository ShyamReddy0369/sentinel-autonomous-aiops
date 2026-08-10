import json
import os

from groq import Groq


class RemediationAgent:

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is missing from .env"
            )

        self.client = Groq(api_key=api_key)

        self.model = os.getenv(
            "GROQ_MODEL",
            "llama-3.1-8b-instant",
        )

    def recommend(self, incident, diagnosis):
        prompt = f"""
You are an autonomous Site Reliability Engineering
remediation agent.

Incident:
Service: {incident.service_name}
Severity: {incident.severity}
Description: {incident.description}

Diagnosis:
Root Cause: {diagnosis["root_cause"]}
Confidence: {diagnosis["confidence"]}

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
- Critical incidents may require approval.
"""

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
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
        )

        content = response.choices[0].message.content

        result = json.loads(content)

        return {
            "action": result["action"],
            "reason": result["reason"],
            "risk": result["risk"],
            "requires_approval": bool(
                result["requires_approval"]
            ),
        }
