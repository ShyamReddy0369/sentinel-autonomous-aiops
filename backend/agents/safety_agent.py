class SafetyAgent:

    SAFE_ACTIONS = {
        "restart",
        "scale",
        "monitor",
        "investigate",
    }

    BLOCKED_WORDS = {
        "delete",
        "drop database",
        "destroy",
        "wipe",
        "remove database",
        "format disk",
    }

    def validate(self, action: str, risk: str, requires_approval: bool):

        action_lower = action.lower()
        risk = risk.upper()

        # Block obviously destructive actions
        for word in self.BLOCKED_WORDS:
            if word in action_lower:
                return {
                    "status": "BLOCKED",
                    "reason": (
                        "Potentially destructive action detected."
                    ),
                    "requires_approval": True,
                }

        # High-risk actions always require approval
        if risk == "HIGH":
            return {
                "status": "APPROVAL_REQUIRED",
                "reason": (
                    "High-risk remediation requires human approval."
                ),
                "requires_approval": True,
            }

        # Explicit approval requested by the AI
        if requires_approval:
            return {
                "status": "APPROVAL_REQUIRED",
                "reason": (
                    "The remediation agent requested human approval."
                ),
                "requires_approval": True,
            }

        # Otherwise allow the recommendation
        return {
            "status": "READY",
            "reason": "Remediation passed safety validation.",
            "requires_approval": False,
        }
