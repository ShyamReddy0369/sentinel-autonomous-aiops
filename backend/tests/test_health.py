from backend.chaos_engine.health import HealthEngine
from backend.chaos_engine.models import ServiceMetrics


def test_health_evaluation():
    engine = HealthEngine()

    healthy = ServiceMetrics(
        cpu_usage=25,
        memory_usage=40,
        disk_usage=20,
        latency_ms=35,
        requests_per_second=120,
        error_rate=0.2,
        active_connections=15,
    )

    warning = ServiceMetrics(
        cpu_usage=85,
        memory_usage=70,
        disk_usage=25,
        latency_ms=300,
        requests_per_second=200,
        error_rate=2.5,
        active_connections=20,
    )

    critical = ServiceMetrics(
        cpu_usage=99,
        memory_usage=98,
        disk_usage=45,
        latency_ms=900,
        requests_per_second=350,
        error_rate=15,
        active_connections=80,
    )

    assert engine.evaluate(healthy) == "HEALTHY"
    assert engine.evaluate(warning) in ["WARNING", "CRITICAL"]
    assert engine.evaluate(critical) == "CRITICAL"


if __name__ == "__main__":
    test_health_evaluation()
    print("Health evaluation test passed.")
