from flask import Blueprint, jsonify, request


settings = Blueprint(
    "settings",
    __name__,
)


runtime_settings = {
    "ai_model": "llama-3.1-8b-instant",
    "confidence_threshold": 80,
    "autonomous_remediation": True,
    "human_approval": True,
    "telemetry_interval": 2,
    "block_destructive_actions": True,
    "medium_risk_approval": True,
    "high_risk_approval": True,
}


@settings.route(
    "/settings",
    methods=["GET"],
)
def get_settings():

    return jsonify(runtime_settings)


@settings.route(
    "/settings",
    methods=["PUT"],
)
def update_settings():

    data = (
        request.get_json(
            silent=True
        )
        or {}
    )

    if "ai_model" in data:

        if not isinstance(
            data["ai_model"],
            str,
        ):
            return jsonify({
                "error": "ai_model must be a string."
            }), 400

        runtime_settings[
            "ai_model"
        ] = data["ai_model"]

    if "confidence_threshold" in data:

        try:
            threshold = int(
                data[
                    "confidence_threshold"
                ]
            )
        except (
            TypeError,
            ValueError,
        ):
            return jsonify({
                "error": (
                    "confidence_threshold "
                    "must be an integer."
                )
            }), 400

        if not 0 <= threshold <= 100:

            return jsonify({
                "error": (
                    "confidence_threshold "
                    "must be between 0 and 100."
                )
            }), 400

        runtime_settings[
            "confidence_threshold"
        ] = threshold

    boolean_settings = [
        "autonomous_remediation",
        "human_approval",
        "block_destructive_actions",
        "medium_risk_approval",
        "high_risk_approval",
    ]

    for key in boolean_settings:

        if key in data:

            if not isinstance(
                data[key],
                bool,
            ):
                return jsonify({
                    "error": (
                        f"{key} must be true or false."
                    )
                }), 400

            runtime_settings[
                key
            ] = data[key]

    if "telemetry_interval" in data:

        try:
            interval = int(
                data[
                    "telemetry_interval"
                ]
            )
        except (
            TypeError,
            ValueError,
        ):
            return jsonify({
                "error": (
                    "telemetry_interval "
                    "must be an integer."
                )
            }), 400

        if interval < 1:

            return jsonify({
                "error": (
                    "telemetry_interval "
                    "must be at least 1 second."
                )
            }), 400

        runtime_settings[
            "telemetry_interval"
        ] = interval

    return jsonify({
        "status": "UPDATED",
        "settings": runtime_settings,
    })