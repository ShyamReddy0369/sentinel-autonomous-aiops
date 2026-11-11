from backend.chaos_engine.telemetry import TelemetryGenerator


def test_telemetry():
    telemetry = TelemetryGenerator()
    metrics = telemetry.update()

    assert 0 <= metrics.cpu_usage <= 100
    assert 0 <= metrics.memory_usage <= 100
    assert 0 <= metrics.disk_usage <= 100
    assert metrics.requests_per_second >= 0
    assert metrics.error_rate >= 0


if __name__ == "__main__":
    test_telemetry()
    print("Telemetry test passed.")
