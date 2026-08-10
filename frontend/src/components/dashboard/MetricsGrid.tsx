import {
  Activity,
  BrainCircuit,
  Cpu,
  ShieldAlert,
} from "lucide-react";

import MetricCard from "./MetricCard";
import useMetrics from "../../hooks/useMetrics";

export default function MetricsGrid() {
  const { metrics, loading } = useMetrics();

  if (loading || !metrics) {
    return (
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="CPU Usage"
          value="--"
          subtitle="Collecting..."
          icon={Cpu}
          color="#2563EB"
        />

        <MetricCard
          title="Memory"
          value="--"
          subtitle="Collecting..."
          icon={Activity}
          color="#16A34A"
        />

        <MetricCard
          title="Incidents"
          value="--"
          subtitle="Loading..."
          icon={ShieldAlert}
          color="#DC2626"
        />

        <MetricCard
          title="AI Agents"
          value="--"
          subtitle="Loading..."
          icon={BrainCircuit}
          color="#7C3AED"
        />
      </section>
    );
  }

  const cpu = Math.round(metrics.cpu);
  const memory = Math.round(metrics.memory);
  const incidents = metrics.incidents;
  const agents = metrics.agents;

  const cpuStatus =
    cpu >= 90
      ? "Critical"
      : cpu >= 70
      ? "Warning"
      : "Healthy";

  const memoryStatus =
    memory >= 90
      ? "Critical"
      : memory >= 70
      ? "Warning"
      : "Normal";

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="CPU Usage"
        value={`${cpu}%`}
        subtitle={cpuStatus}
        icon={Cpu}
        color={
          cpu >= 90
            ? "#DC2626"
            : cpu >= 70
            ? "#F59E0B"
            : "#2563EB"
        }
      />

      <MetricCard
        title="Memory"
        value={`${memory}%`}
        subtitle={memoryStatus}
        icon={Activity}
        color={
          memory >= 90
            ? "#DC2626"
            : memory >= 70
            ? "#F59E0B"
            : "#16A34A"
        }
      />

      <MetricCard
        title="Incidents"
        value={String(incidents)}
        subtitle={
          incidents === 0
            ? "0 Open"
            : `${incidents} Open`
        }
        icon={ShieldAlert}
        color={
          incidents > 0
            ? "#DC2626"
            : "#16A34A"
        }
      />

      <MetricCard
        title="AI Agents"
        value={String(agents)}
        subtitle="All Online"
        icon={BrainCircuit}
        color="#7C3AED"
      />
    </section>
  );
}