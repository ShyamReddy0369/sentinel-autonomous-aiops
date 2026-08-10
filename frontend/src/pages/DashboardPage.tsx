import Topology from "../components/dashboard/Topology";
import RemediationPanel from "../components/dashboard/RemediationPanel";
import AuditTimeline from "../components/dashboard/AuditTimeline";
import IncidentHistory from "../components/dashboard/IncidentHistory";
import ActivityFeed from "../components/dashboard/ActivityFeed";

import MetricsGrid from "../components/dashboard/MetricsGrid";
import AIBrain from "../components/dashboard/AIBrain";
import IncidentFeed from "../components/dashboard/IncidentFeed";
import TelemetryChart from "../components/dashboard/TelemetryChart";
import AgentsPanel from "../components/dashboard/AgentsPanel";
import ChaosControls from "../components/dashboard/ChaosControls";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-5xl font-bold text-white">
          Sentinel Mission Control
        </h1>

        <p className="mt-2 text-lg text-slate-400">
          Enterprise Autonomous Infrastructure Monitoring Platform
        </p>
      </div>

      <MetricsGrid />

      <TelemetryChart />

      <RemediationPanel />

      <AuditTimeline />

      <IncidentHistory />

      <AgentsPanel />

      <ActivityFeed />

      <ChaosControls />

      <Topology />

      <div className="grid gap-8 lg:grid-cols-2">
        <AIBrain />
        <IncidentFeed />
      </div>

    </div>
  );
}