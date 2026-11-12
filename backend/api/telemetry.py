from datetime import datetime
from flask import Blueprint, jsonify

from backend.chaos_engine.simulator import get_metrics

telemetry = Blueprint("telemetry", __name__)


@telemetry.route("/telemetry")
def get_telemetry():
    metrics = get_metrics()

    return jsonify(
        {
            "time": datetime.now().strftime("%H:%M:%S"),
            "cpu": metrics["cpu"],
            "memory": metrics["memory"],
        }
    )
