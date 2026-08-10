import random

from backend.core.services import incident_service


services = {
    "Authentication": {
        "cpu": 35,
        "memory": 45,
        "healthy": True,
        "failure_mode": "CPU",
    },
    "Payment": {
        "cpu": 40,
        "memory": 50,
        "healthy": True,
        "failure_mode": "DATABASE",
    },
    "Inventory": {
        "cpu": 30,
        "memory": 40,
        "healthy": True,
        "failure_mode": "MEMORY",
    },
}


def _keep_cpu_valid(value):
    return max(0, min(int(value), 100))


def _keep_memory_valid(value):
    return max(0, min(int(value), 100))


def get_service_metrics():

    result = {}

    for name, service in services.items():

        # Healthy services slowly fluctuate.
        if service["healthy"]:

            service["cpu"] += random.randint(-3, 3)
            service["memory"] += random.randint(-2, 2)

            service["cpu"] = _keep_cpu_valid(
                service["cpu"]
            )

            service["memory"] = _keep_memory_valid(
                service["memory"]
            )

        result[name] = {
            "cpu": service["cpu"],
            "memory": service["memory"],
            "healthy": service["healthy"],
        }

    return result


def get_metrics():

    service_metrics = get_service_metrics()

    authentication = service_metrics[
        "Authentication"
    ]

    payment = service_metrics[
        "Payment"
    ]

    inventory = service_metrics[
        "Inventory"
    ]

    return {
        "cpu": authentication["cpu"],
        "memory": authentication["memory"],
        "agents": 5,
        "incidents": len(
            incident_service.get_open_incidents()
        ),
        "services": service_metrics,
    }


def trigger_failure(service_name):

    if service_name not in services:

        return {
            "success": False,
            "message": (
                f"Unknown service: {service_name}"
            ),
        }

    service = services[service_name]

    service["healthy"] = False

    if service_name == "Authentication":

        service["cpu"] = 95

        description = (
            "CPU usage exceeded 90%"
        )

        severity = "CRITICAL"

    elif service_name == "Payment":

        service["cpu"] = 70
        service["memory"] = 75

        description = (
            "Database connection timeout"
        )

        severity = "HIGH"

    elif service_name == "Inventory":

        service["cpu"] = 60
        service["memory"] = 92

        description = (
            "Memory usage high"
        )

        severity = "MEDIUM"

    else:

        return {
            "success": False,
            "message": "Unsupported service.",
        }

    existing = [
        incident
        for incident
        in incident_service.get_open_incidents()
        if incident.service_name == service_name
    ]

    if not existing:

        incident_service.create_incident(
            service_name=service_name,
            severity=severity,
            description=description,
        )

    return {
        "success": True,
        "service_name": service_name,
        "severity": severity,
        "description": description,
        "cpu": service["cpu"],
        "memory": service["memory"],
    }


def apply_remediation(
    service_name: str,
    action: str,
):

    if service_name not in services:

        return {
            "success": False,
            "message": "Unknown service.",
        }

    service = services[service_name]

    print(
        f"SIMULATED REMEDIATION: "
        f"{action} -> {service_name}"
    )

    service["healthy"] = True

    if service_name == "Authentication":

        service["cpu"] = 65
        service["memory"] = 45

    elif service_name == "Payment":

        service["cpu"] = 50
        service["memory"] = 50

    elif service_name == "Inventory":

        service["cpu"] = 45
        service["memory"] = 45

    return {
        "success": True,
        "service_name": service_name,
        "cpu": service["cpu"],
        "memory": service["memory"],
        "status": "HEALTHY",
    }
