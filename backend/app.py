from backend.api.remediation import remediation
from backend.api.telemetry import telemetry
from backend.api.diagnosis import diagnosis
from backend.api.metrics import metrics
from backend.api.routes import api
import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from backend.api.audit import audit
from backend.api.agents import agents
from backend.api.simulation import simulation

load_dotenv()


def create_app():

    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.getenv(
        "FLASK_SECRET_KEY",
        "dev",
    )

    # Allow React frontend to communicate with Flask backend
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ]
            }
        },
    )

    app.register_blueprint(
        api,
        url_prefix="/api",
    )

    app.register_blueprint(
        metrics,
        url_prefix="/api",
    )

    app.register_blueprint(
        diagnosis,
        url_prefix="/api",
    )

    app.register_blueprint(
        telemetry,
        url_prefix="/api",
    )

    app.register_blueprint(
        remediation,
        url_prefix="/api",
    )
    app.register_blueprint(
        audit,
        url_prefix="/api",
    )

    app.register_blueprint(
        agents,
        url_prefix="/api",
    )

    app.register_blueprint(
        simulation,
        url_prefix="/api",
    )

    @app.route("/")
    def index():
        return {
            "status": "Sentinel backend is alive",
            "next_step": "Autonomous remediation",
        }

    @app.route("/health")
    def health():
        return {
            "status": "ok"
        }, 200

    print(app.url_map)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000,
    )
