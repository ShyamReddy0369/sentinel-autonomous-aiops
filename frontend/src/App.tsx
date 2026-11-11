import { useState } from "react";

import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

import IncidentHistory from "./components/dashboard/IncidentHistory";
import AgentsPanel from "./components/dashboard/AgentsPanel";
import Topology from "./components/dashboard/Topology";

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
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Incident Management
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Chronological incident history, postmortems, and root cause resolutions
              </p>
            </div>

            <IncidentHistory />
          </div>
        );

      case "AI Brain":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Sentinel AI Brain
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Multi-agent decision orchestrator & autonomous operations mesh
              </p>
            </div>

            <AgentsPanel />
          </div>
        );

      case "Topology":
        return (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Infrastructure Topology
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Live dependency graph, Envoy ingress, and microservice mesh routing
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