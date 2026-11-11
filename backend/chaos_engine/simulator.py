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


def sync_anomalies_to_incidents():
    """
    Autonomous Anomaly Monitor:
    Ensure any microservice experiencing critical resource saturation or marked unhealthy
    has an active open incident in incident_service so AI diagnosis and remediation can execute.
    """
    for service_name, service in services.items():
        is_anomaly = (
            not service["healthy"]
            or service["cpu"] >= 90
            or service["memory"] >= 90
        )

        if is_anomaly:
            open_incidents = [
                inc
                for inc in incident_service.get_open_incidents()
                if inc.service_name == service_name
            ]

            if not open_incidents:
                # Clear any stale active_incidents reference so create_incident succeeds
                incident_service.active_incidents.pop(service_name, None)

                if service["cpu"] >= 90 or service_name == "Authentication":
                    severity = "CRITICAL"
                    description = f"CPU utilization critical ({service['cpu']}%) in {service_name}"
                elif service["memory"] >= 90 or service_name == "Inventory":
                    severity = "CRITICAL"
                    description = f"Memory pressure critical ({service['memory']}%) in {service_name}"
                else:
                    severity = "CRITICAL"
                    description = f"Database connection pool timeout in {service_name}"

                incident_service.create_incident(
                    service_name=service_name,
                    severity=severity,
                    description=description,
                )


def get_service_metrics():

    # Synchronize any critical resource spikes to active incidents
    sync_anomalies_to_incidents()

    result = {}

    for name, service in services.items():

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

    authentication = service_metrics["Authentication"]

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
            "message": f"Unknown service: {service_name}",
        }

    service = services[service_name]

    service["healthy"] = False

    if service_name == "Authentication":

        service["cpu"] = 95

        description = "CPU usage exceeded 90%"
        severity = "CRITICAL"

    elif service_name == "Payment":

        service["cpu"] = 70
        service["memory"] = 75

        description = "Database connection timeout"
        severity = "HIGH"

    elif service_name == "Inventory":

        service["cpu"] = 60
        service["memory"] = 92

        description = "Memory usage high"
        severity = "MEDIUM"

    else:

        return {
            "success": False,
            "message": "Unsupported service.",
        }

    existing = [
        incident
        for incident in incident_service.get_open_incidents()
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

        service["cpu"] = 28
        service["memory"] = 40

    elif service_name == "Payment":

        service["cpu"] = 32
        service["memory"] = 42

    elif service_name == "Inventory":

        service["cpu"] = 25
        service["memory"] = 36

    return {
        "success": True,
        "service_name": service_name,
        "cpu": service["cpu"],
        "memory": service["memory"],
        "status": "HEALTHY",
    }
