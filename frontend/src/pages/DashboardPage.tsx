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
import useMetrics from "../hooks/useMetrics";
import { Radio, FileText, Sparkles, Shield, AlertTriangle, Zap } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"stream" | "audit">("stream");
  const { metrics } = useMetrics();

  const isCritical = Boolean(
    metrics && (metrics.cpu >= 90 || metrics.incidents > 0)
  );

  return (
    <div className="space-y-4">
      {/* Platform Title Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              MISSION CONTROL
            </h1>
            <span className="flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <Sparkles size={10} className="text-cyan-400 animate-pulse" />
              CYBER_CORE v2.4
            </span>
          </div>
          <p className="mt-0.5 text-xs font-mono text-cyan-500/70 tracking-wide">
            Autonomous multi-agent grid monitoring // Fault simulation // Sub-second self-healing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-bold transition-all duration-300 ${
              isCritical
                ? "border-rose-500/60 bg-rose-950/50 text-rose-300 shadow-[0_0_18px_rgba(255,0,85,0.4)]"
                : "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_18px_rgba(0,255,157,0.25)]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isCritical
                  ? "bg-rose-500 animate-ping shadow-[0_0_8px_#ff0055]"
                  : "bg-emerald-400 animate-ping shadow-[0_0_8px_#00ff9d]"
              }`}
            />
            {isCritical ? "CRITICAL ANOMALY ACTIVE" : "DEFENSE GRID SECURE"}
          </span>
        </div>
      </div>

      {/* Critical Anomaly Banner */}
      {isCritical && (
        <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-500/60 bg-gradient-to-r from-rose-950/80 via-red-950/50 to-rose-950/80 p-4 shadow-[0_0_30px_rgba(255,0,85,0.35)] backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-rose-500/60 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(255,0,85,0.5)]">
              <AlertTriangle size={18} className="animate-bounce" />
            </div>
            <div>
              <p className="font-mono text-xs font-extrabold text-rose-200 tracking-wider flex items-center gap-1.5">
                <Zap size={13} className="text-rose-400" />
                CRITICAL INFRASTRUCTURE SATURATION DETECTED
              </p>
              <p className="text-[11px] font-mono text-rose-200/90 mt-0.5">
                CPU utilization at {Math.round(metrics?.cpu ?? 95)}%. Sentinel AI SRE has formulated remediation. Operator authorization requested below.
              </p>
            </div>
          </div>
          <span className="shrink-0 self-start sm:self-center rounded-lg border border-rose-500/60 bg-rose-500/30 px-3 py-1 font-mono text-[10px] font-black text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]">
            AUTHORIZE BELOW ↓
          </span>
        </div>
      )}

      {/* KPI Overview Metrics */}
      <MetricsGrid />

      {/* Hero Real-Time Telemetry HUD Stream */}
      <TelemetryChart />

      {/* Interactive Chaos Injection Deck */}
      <ChaosControls />

      {/* Mission Critical 2-Column Split: AI Commander vs Live Mesh Architecture */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Column 1: AI Incident Commander & Remediation Action */}
        <div className="space-y-4">
          <AIBrain />
          <RemediationPanel />
        </div>

        {/* Column 2: Live Observability Mesh & Topology */}
        <div className="space-y-4">
          <Topology />
        </div>
      </div>

      {/* Unified Operational & Audit Deck */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 font-mono">
              Operations & Event Streams
            </h3>
            <span className="font-mono text-[10px] text-cyan-500/60 font-semibold">
              [ LIVE AUDIT LEDGER ]
            </span>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-[#060b19] p-0.5 shadow-[0_0_12px_rgba(0,240,255,0.1)]">
            <button
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-medium transition-all ${
                activeTab === "stream"
                  ? "border border-cyan-500/50 bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              <Radio size={12} className={activeTab === "stream" ? "animate-pulse text-cyan-400" : ""} />
              <span>Live Streams</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-medium transition-all ${
                activeTab === "audit"
                  ? "border border-purple-500/50 bg-purple-500/20 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                  : "text-slate-400 hover:text-purple-300"
              }`}
            >
              <FileText size={12} className={activeTab === "audit" ? "text-purple-400" : ""} />
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
