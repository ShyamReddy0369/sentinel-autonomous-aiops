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
import { Radio, FileText, Sparkles, Shield } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"stream" | "audit">("stream");

  return (
    <div className="space-y-4">
      {/* Platform Title Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Mission Control
            </h1>
            <span className="flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
              <Sparkles size={10} />
              AI OPS v2.4
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Autonomous microservice health monitoring, chaos engineering & instant remediation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
            GUARDIAN ACTIVE
          </span>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <MetricsGrid />

      {/* Interactive Chaos Injection Deck */}
      <ChaosControls />

      {/* Mission Critical 2-Column Split: AI Commander vs Live Mesh Observability */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Column 1: AI Incident Commander & Remediation Action */}
        <div className="space-y-4">
          <AIBrain />
          <RemediationPanel />
        </div>

        {/* Column 2: Live Observability Mesh & Telemetry Graphs */}
        <div className="space-y-4">
          <Topology />
          <TelemetryChart />
        </div>
      </div>

      {/* Unified Operational & Audit Deck */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Operations & Event Streams
            </h3>
            <span className="font-mono text-[10px] text-slate-400">
              (Live Auditability)
            </span>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#0c1017] p-0.5">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === "stream"
                  ? "bg-white/[0.08] text-cyan-300 border border-white/[0.06] shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Radio size={12} />
              <span>Live Streams</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                activeTab === "audit"
                  ? "bg-white/[0.08] text-indigo-300 border border-white/[0.06] shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={12} />
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "stream" ? (
          <div className="grid gap-4 lg:grid-cols-2">
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
