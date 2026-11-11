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
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="CPU Usage"
          value="--"
          subtitle="Collecting..."
          icon={Cpu}
          color="#06B6D4"
        />

        <MetricCard
          title="Memory Pressure"
          value="--"
          subtitle="Collecting..."
          icon={Activity}
          color="#10B981"
        />

        <MetricCard
          title="Active Incidents"
          value="--"
          subtitle="Syncing..."
          icon={ShieldAlert}
          color="#EF4444"
        />

        <MetricCard
          title="Autonomous Swarm"
          value="--"
          subtitle="Syncing..."
          icon={BrainCircuit}
          color="#8B5CF6"
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
      ? "High Load"
      : "Nominal";

  const memoryStatus =
    memory >= 90
      ? "Critical"
      : memory >= 70
      ? "Elevated"
      : "Normal";

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="CPU Usage"
        value={`${cpu}%`}
        subtitle={cpuStatus}
        icon={Cpu}
        color={
          cpu >= 90
            ? "#EF4444"
            : cpu >= 70
            ? "#F59E0B"
            : "#06B6D4"
        }
      />

      <MetricCard
        title="Memory Pressure"
        value={`${memory}%`}
        subtitle={memoryStatus}
        icon={Activity}
        color={
          memory >= 90
            ? "#EF4444"
            : memory >= 70
            ? "#F59E0B"
            : "#10B981"
        }
      />

      <MetricCard
        title="Active Incidents"
        value={String(incidents)}
        subtitle={
          incidents === 0
            ? "Zero Open"
            : `${incidents} Unresolved`
        }
        icon={ShieldAlert}
        color={
          incidents > 0
            ? "#EF4444"
            : "#10B981"
        }
      />

      <MetricCard
        title="Autonomous Swarm"
        value={`${agents} Agents`}
        subtitle="Consensus Active"
        icon={BrainCircuit}
        color="#8B5CF6"
      />
    </section>
  );
}