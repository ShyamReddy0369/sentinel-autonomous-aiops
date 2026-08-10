from flask import Blueprint, jsonify

from backend.chaos_engine.simulator import get_metrics

metrics = Blueprint("metrics", __name__)


@metrics.route("/metrics")
def metrics_api():
    return jsonify(get_metrics())
