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
          <div className="space-y-8">

            <div>
              <h1 className="text-4xl font-bold text-white">
                Incidents
              </h1>

              <p className="mt-2 text-slate-400">
                Incident history and remediation details
              </p>
            </div>

            <IncidentHistory />

          </div>
        );

      case "AI Brain":
        return (
          <div className="space-y-8">

            <div>
              <h1 className="text-4xl font-bold text-white">
                Sentinel AI Brain
              </h1>

              <p className="mt-2 text-slate-400">
                Autonomous diagnosis and decision engine
              </p>
            </div>

            <AgentsPanel />

          </div>
        );

      case "Topology":
        return (
          <div className="space-y-8">

            <div>
              <h1 className="text-4xl font-bold text-white">
                Infrastructure Topology
              </h1>

              <p className="mt-2 text-slate-400">
                Live service dependency map
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