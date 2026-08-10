import json
import os

from groq import Groq


class DiagnosisAgent:

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

    def diagnose(self, incident):
        prompt = f"""
You are an expert Site Reliability Engineer.

Analyze this infrastructure incident.

Service: {incident.service_name}
Severity: {incident.severity}
Status: {incident.status}
Description: {incident.description}

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
- do not include markdown
- do not include explanations outside the JSON
"""

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
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        content = response.choices[0].message.content

        if not content:
            raise RuntimeError(
                "Groq returned an empty diagnosis."
            )

        content = content.strip()

        # Remove markdown code fences if the model
        # unexpectedly adds them.
        if content.startswith("```"):
            content = content.replace(
                "```json",
                "",
                1,
            )

            content = content.replace(
                "```",
                "",
            ).strip()

        result = json.loads(content)

        return {
            "root_cause": result["root_cause"],
            "confidence": int(result["confidence"]),
            "recommendation": result["recommendation"],
        }
