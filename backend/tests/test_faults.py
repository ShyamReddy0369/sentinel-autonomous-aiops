from backend.chaos_engine.models import ServiceMetrics
from backend.chaos_engine.fault_injector import (
    CPUSpikeFault,
    MemoryLeakFault,
)
from backend.chaos_engine.health import HealthEngine


def test_fault_injection():
    engine = HealthEngine()
    metrics = ServiceMetrics(
        cpu_usage=30,
        memory_usage=40,
        disk_usage=20,
        latency_ms=40,
        requests_per_second=120,
        error_rate=0.2,
        active_connections=15,
    )
    assert engine.evaluate(metrics) == "HEALTHY"

    cpu_fault = CPUSpikeFault()
    cpu_fault.apply(metrics)
    assert metrics.cpu_usage == 55
    assert metrics.latency_ms == 80

    memory_fault = MemoryLeakFault()
    memory_fault.apply(metrics)
    assert metrics.memory_usage == 52


if __name__ == "__main__":
    test_fault_injection()
    print("Fault injection test passed.")
