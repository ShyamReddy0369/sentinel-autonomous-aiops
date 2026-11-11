from backend.chaos_engine.models import ServiceMetrics, ServiceState


def test_models():
    metrics = ServiceMetrics(
        cpu_usage=23.5,
        memory_usage=41.3,
        disk_usage=18.9,
        latency_ms=52,
        requests_per_second=187,
        error_rate=0.2,
        active_connections=14,
    )

    service = ServiceState(
        name="Authentication Service",
        owner="Identity Team",
        criticality="HIGH",
        metrics=metrics,
    )

    assert service.name == "Authentication Service"
    assert service.criticality == "HIGH"
    assert service.metrics.cpu_usage == 23.5
    assert service.metrics.memory_usage == 41.3


if __name__ == "__main__":
    test_models()
    print("Models test passed.")
