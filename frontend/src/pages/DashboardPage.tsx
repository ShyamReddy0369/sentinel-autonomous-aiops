import { useState } from "react";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import TelemetryChart from "../components/dashboard/TelemetryChart";
import Topology from "../components/dashboard/Topology";
import ChaosControls from "../components/dashboard/ChaosControls";
import RemediationPanel from "../components/dashboard/RemediationPanel";
import AIBrain from "../components/dashboard/AIBrain";
import IncidentFeed from "../components/dashboard/IncidentFeed";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import AuditTimeline from "../components/dashboard/AuditTimeline";
import { Radio, FileText, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"stream" | "audit">("stream");

  return (
    <div className="space-y-6">
      {/* Platform Title Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sentinel Mission Control
            </h1>
            <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
              <Sparkles size={12} />
              AI Ops v2.4
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Autonomous microservice health monitoring, chaos engineering & instant safety-validated remediation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            AUTONOMOUS GUARDIAN ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <MetricsGrid />

      {/* Interactive Chaos Injection Deck */}
      <ChaosControls />

      {/* Mission Critical 2-Column Split: AI Commander vs Live Mesh Observability */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Column 1: AI Incident Commander & Remediation Action */}
        <div className="space-y-6">
          <AIBrain />
          <RemediationPanel />
        </div>

        {/* Column 2: Live Observability Mesh & Telemetry Graphs */}
        <div className="space-y-6">
          <Topology />
          <TelemetryChart />
        </div>
      </div>

      {/* Unified Operational & Audit Deck */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Operations & Event Streams
            </h2>
            <span className="text-xs text-slate-400">
              Real-time auditability
            </span>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "stream"
                  ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Radio size={13} />
              <span>Live Streams</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeTab === "audit"
                  ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={13} />
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "stream" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <IncidentFeed />
            <ActivityFeed />
          </div>
        ) : (
          <AuditTimeline />
        )}
      </section>
    </div>
  );
}
