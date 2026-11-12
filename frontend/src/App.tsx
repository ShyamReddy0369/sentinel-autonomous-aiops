import { useState } from "react";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

import IncidentHistory from "./components/dashboard/IncidentHistory";
import AgentsPanel from "./components/dashboard/AgentsPanel";
import Topology from "./components/dashboard/Topology";
import { Sparkles } from "lucide-react";

export default function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  function renderPage() {
    switch (activePage) {
      case "Settings":
        return <SettingsPage />;

      case "Incidents":
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  INCIDENT MANAGEMENT
                </h1>
                <span className="flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                  <Sparkles size={10} className="text-cyan-400" />
                  POSTMORTEM_LEDGER
                </span>
              </div>
              <p className="mt-0.5 text-xs font-mono text-cyan-500/70 tracking-wide">
                Chronological incident timeline, blameless postmortems & root cause resolutions
              </p>
            </div>

            <IncidentHistory />
          </div>
        );

      case "AI Brain":
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400">
                  SENTINEL AI BRAIN
                </h1>
                <span className="flex items-center gap-1 rounded border border-purple-500/40 bg-purple-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300">
                  <Sparkles size={10} className="text-purple-400 animate-pulse" />
                  CONSENSUS_MESH
                </span>
              </div>
              <p className="mt-0.5 text-xs font-mono text-cyan-500/70 tracking-wide">
                Multi-agent decision orchestrator & autonomous Site Reliability Engineering pod
              </p>
            </div>

            <AgentsPanel />
          </div>
        );

      case "Topology":
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
                  INFRASTRUCTURE TOPOLOGY
                </h1>
                <span className="flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                  <Sparkles size={10} className="text-cyan-400" />
                  LIVE_MESH
                </span>
              </div>
              <p className="mt-0.5 text-xs font-mono text-cyan-500/70 tracking-wide">
                Live dependency graph, Cloudflare ingress & microservice mesh routing
              </p>
            </div>

            <Topology />
          </div>
        );

      case "Dashboard":
      default:
        return <DashboardPage />;
    }
  }

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
