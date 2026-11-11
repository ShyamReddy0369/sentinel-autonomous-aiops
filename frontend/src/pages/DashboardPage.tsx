import MetricsGrid from "../components/dashboard/MetricsGrid";
import TelemetryChart from "../components/dashboard/TelemetryChart";
import Topology from "../components/dashboard/Topology";
import ChaosControls from "../components/dashboard/ChaosControls";
import RemediationPanel from "../components/dashboard/RemediationPanel";
import AIBrain from "../components/dashboard/AIBrain";
import IncidentFeed from "../components/dashboard/IncidentFeed";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AuditTimeline from "../components/dashboard/AuditTimeline";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Platform Title Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Sentinel Mission Control
          </h1>
          <p className="mt-2 text-base text-slate-400">
            Enterprise Autonomous Infrastructure Monitoring, Chaos Engineering & Intelligent Remediation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            AUTONOMOUS GUARDIAN ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <MetricsGrid />

      {/* Observability: Live Telemetry & Infrastructure Mesh */}
      <div className="grid gap-8 xl:grid-cols-2">
        <TelemetryChart />
        <Topology />
      </div>

      {/* Chaos Engineering & AI Diagnosis / Remediation Zone */}
      <div className="space-y-8">
        <ChaosControls />

        <div className="grid gap-8 lg:grid-cols-2">
          <AIBrain />
          <RemediationPanel />
        </div>
      </div>

      {/* Operational Streams: Live Incidents, Activities, and Audit History */}
      <div className="grid gap-8 lg:grid-cols-2">
        <IncidentFeed />
        <ActivityFeed />
      </div>

      <AuditTimeline />
    </div>
  );
}
