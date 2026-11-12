import os
from typing import List
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from backend.api.routes import api
from backend.api.metrics import metrics
from backend.api.diagnosis import diagnosis
from backend.api.telemetry import telemetry
from backend.api.remediation import remediation
from backend.api.audit import audit
from backend.api.agents import agents
from backend.api.simulation import simulation
from backend.api.settings import settings
from backend.api.events import events

from backend.core.services import incident_service

load_dotenv()


def seed_demo_data() -> None:
    """Create initial demo incidents if none exist so dashboard is populated on boot."""
    if incident_service.get_all_incidents():
        return

    incident_service.create_incident(
        service_name="Authentication",
        severity="CRITICAL",
        description="CPU utilization exceeded 95%",
    )

    incident_service.create_incident(
        service_name="Payment",
        severity="HIGH",
        description="Database connection timeout",
    )

    incident_service.create_incident(
        service_name="Inventory",
        severity="MEDIUM",
        description="Memory usage high (>88%)",
    )


def create_app() -> Flask:
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev")

    # Dynamic origins: support local dev + production Vercel/Railway/Render deployments
    origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    if os.getenv("FRONTEND_URL"):
        origins.append(os.environ["FRONTEND_URL"].rstrip("/"))

    # Allow React frontend to communicate with Flask backend
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*" if os.getenv("FLASK_ENV") == "production" else origins
            }
        },
    )

    # Register all API blueprints
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(metrics, url_prefix="/api")
    app.register_blueprint(diagnosis, url_prefix="/api")
    app.register_blueprint(telemetry, url_prefix="/api")
    app.register_blueprint(remediation, url_prefix="/api")
    app.register_blueprint(audit, url_prefix="/api")
    app.register_blueprint(agents, url_prefix="/api")
    app.register_blueprint(simulation, url_prefix="/api")
    app.register_blueprint(settings, url_prefix="/api")
    app.register_blueprint(events, url_prefix="/api")

    # Seed initial demo state
    seed_demo_data()

    @app.route("/")
    def index():
        return {
            "status": "Sentinel Incident Commander backend is active",
            "version": "1.0.0",
            "health": "/health",
            "api_docs": "/api",
        }

    @app.route("/health")
    def health():
        return {"status": "ok", "service": "sentinel-backend"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.getenv("FLASK_ENV") != "production",
    )
