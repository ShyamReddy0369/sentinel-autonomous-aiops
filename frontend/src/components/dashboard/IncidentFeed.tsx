import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import useIncidents from "../../hooks/useIncidents";

export default function IncidentFeed() {
  const { incidents, loading } = useIncidents();

  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800">
        <h2 className="mb-4 text-xl font-bold text-white">
          Live Incident Feed
        </h2>

        <p className="text-slate-400">Loading incidents...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-950 p-6 border border-slate-800">
      <h2 className="mb-6 text-xl font-bold text-white">
        Live Incident Feed
      </h2>

      <div className="space-y-4">
        {incidents.map((incident) => {
          let Icon = AlertTriangle;
          let color = "text-yellow-400";

          if (incident.severity === "CRITICAL") {
            Icon = ShieldAlert;
            color = "text-red-500";
          } else if (incident.status === "RESOLVED") {
            Icon = CheckCircle2;
            color = "text-green-500";
          }

          return (
            <div
              key={incident.incident_id}
              className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
            >
              <div className="flex items-center gap-4">
                <Icon className={color} size={22} />

                <div>
                  <h3 className="font-semibold text-white">
                    {incident.service_name}
                  </h3>

                  <p className={color}>
                    {incident.severity}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    {incident.description}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}
              >
                {incident.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}