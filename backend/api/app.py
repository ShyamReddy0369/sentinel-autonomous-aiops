from backend.core.services import incident_service
from backend.api.routes import api
from dotenv import load_dotenv
from flask import Flask

import os
print("🔥 RUNNING THIS APP.PY")


load_dotenv()


def seed_demo_data():
    """Create demo incidents only if none exist."""
    if incident_service.get_all_incidents():
        return

    incident_service.create_incident(
        service_name="Authentication",
        severity="CRITICAL",
        description="CPU usage exceeded 95%",
    )

    incident_service.create_incident(
        service_name="Payment",
        severity="HIGH",
        description="Database connection timeout",
    )

    incident_service.create_incident(
        service_name="Inventory",
        severity="MEDIUM",
        description="Memory usage high",
    )


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev")

    app.register_blueprint(api, url_prefix="/api")

    seed_demo_data()

    @app.route("/")
    def index():
        return {
            "status": "Sentinel backend is alive",
            "next_step": "Phase 1 -- Oracle DB schema",
        }

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    print(app.url_map)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
