"""
Flask API Application entry point for Sentinel AI Ops.
Re-exports the central app instance and provides CLI execution.
"""

from backend.app import app

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )
