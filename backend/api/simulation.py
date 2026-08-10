from flask import Blueprint, jsonify, request

from backend.chaos_engine.simulator import (
    trigger_failure,
)


simulation = Blueprint(
    "simulation",
    __name__,
)


@simulation.route(
    "/simulation/failure",
    methods=["POST"],
)
def simulate_failure():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    service_name = data.get(
        "service_name"
    )

    if not service_name:

        return jsonify({
            "success": False,
            "message": (
                "service_name is required."
            ),
        }), 400

    result = trigger_failure(
        service_name
    )

    if not result["success"]:

        return jsonify(result), 400

    return jsonify(result)
