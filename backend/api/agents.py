from flask import Blueprint, jsonify

from backend.agents.diagnosis_agent import DiagnosisAgent
from backend.agents.remediation_agent import RemediationAgent


agents = Blueprint(
    "agents",
    __name__,
)


def check_agent(agent_class):

    try:
        agent_class()

        return {
            "status": "ONLINE",
            "error": None,
        }

    except Exception as error:

        print(
            f"{agent_class.__name__} ERROR:"
        )

        print(
            type(error).__name__,
            str(error),
        )

        return {
            "status": "OFFLINE",
            "error": (
                f"{type(error).__name__}: "
                f"{str(error)}"
            ),
        }


@agents.route(
    "/agents",
    methods=["GET"],
)
def get_agents():

    diagnosis = check_agent(
        DiagnosisAgent
    )

    remediation = check_agent(
        RemediationAgent
    )

    agent_list = [
        {
            "name": "Diagnosis Agent",
            "status": diagnosis["status"],
            "description": (
                "Analyzes incidents and "
                "identifies root causes."
            ),
            "error": diagnosis["error"],
        },
        {
            "name": "Remediation Agent",
            "status": remediation["status"],
            "description": (
                "Generates safe remediation "
                "recommendations."
            ),
            "error": remediation["error"],
        },
        {
            "name": "Safety Agent",
            "status": "ONLINE",
            "description": (
                "Validates remediation risk "
                "and approval requirements."
            ),
            "error": None,
        },
        {
            "name": "Telemetry Agent",
            "status": "ONLINE",
            "description": (
                "Collects infrastructure "
                "health metrics."
            ),
            "error": None,
        },
        {
            "name": "Incident Agent",
            "status": "ONLINE",
            "description": (
                "Manages incident lifecycle "
                "and state."
            ),
            "error": None,
        },
    ]

    online = sum(
        1
        for agent in agent_list
        if agent["status"] == "ONLINE"
    )

    return jsonify({
        "total": 5,
        "online": online,
        "agents": agent_list,
    })
