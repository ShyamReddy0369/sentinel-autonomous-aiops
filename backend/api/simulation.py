from typing import Any, Dict
from flask import Blueprint, jsonify, request, Response

from backend.chaos_engine.simulator import (
    get_metrics,
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
def failure() -> tuple[Response, int]:
    data: Dict[str, Any] = request.get_json(silent=True) or {}
    service_name: Any = data.get("service_name")

    if not service_name or not isinstance(service_name, str):
        return jsonify({
            "success": False,
            "message": "service_name is required.",
        }), 400

    result: Dict[str, Any] = trigger_failure(service_name)

    if not result.get("success"):
        return jsonify(result), 404

    return jsonify(result), 200


@simulation.route(
    "/simulation/metrics",
    methods=["GET"],
)
def metrics() -> Response:
    return jsonify(get_metrics())
