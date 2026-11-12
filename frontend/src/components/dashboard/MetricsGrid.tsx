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
          title="CPU Core Saturation"
          value="--"
          subtitle="INGESTING..."
          icon={Cpu}
          color="#00F0FF"
        />

        <MetricCard
          title="Memory Pressure"
          value="--"
          subtitle="INGESTING..."
          icon={Activity}
          color="#00FF9D"
        />

        <MetricCard
          title="Active Anomalies"
          value="--"
          subtitle="SCANNING..."
          icon={ShieldAlert}
          color="#FF0055"
        />

        <MetricCard
          title="Autonomous Swarm"
          value="--"
          subtitle="SYNCHRONIZING..."
          icon={BrainCircuit}
          color="#C084FC"
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
      ? "Critical Spike"
      : cpu >= 70
      ? "Elevated Load"
      : "Nominal Baseline";

  const memoryStatus =
    memory >= 90
      ? "Critical Pressure"
      : memory >= 70
      ? "Elevated"
      : "Nominal Baseline";

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="CPU Core Saturation"
        value={`${cpu}%`}
        subtitle={cpuStatus}
        icon={Cpu}
        color={
          cpu >= 90
            ? "#FF0055"
            : cpu >= 70
            ? "#FFB800"
            : "#00F0FF"
        }
      />

      <MetricCard
        title="Memory Pressure"
        value={`${memory}%`}
        subtitle={memoryStatus}
        icon={Activity}
        color={
          memory >= 90
            ? "#FF0055"
            : memory >= 70
            ? "#FFB800"
            : "#00FF9D"
        }
      />

      <MetricCard
        title="Active Anomalies"
        value={String(incidents)}
        subtitle={
          incidents === 0
            ? "0 Active In Grid"
            : `${incidents} Unresolved`
        }
        icon={ShieldAlert}
        color={
          incidents > 0
            ? "#FF0055"
            : "#00FF9D"
        }
      />

      <MetricCard
        title="Autonomous Swarm"
        value={`${agents} Agents`}
        subtitle="Consensus Active"
        icon={BrainCircuit}
        color="#C084FC"
      />
    </section>
  );
}
