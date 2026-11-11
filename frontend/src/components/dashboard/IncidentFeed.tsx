import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Flame,
} from "lucide-react";
import useIncidents from "../../hooks/useIncidents";

export default function IncidentFeed() {
  const { incidents, loading } = useIncidents();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-base font-bold text-white">Live Incident Log</h3>
        <p className="mt-4 text-xs text-slate-400">Loading active incident records...</p>
      </div>
    );
  }

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <Flame size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                Incident Stream
              </h3>
              <p className="text-xs text-slate-400">
                Triggered anomalies & fault state tracking
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              activeCount > 0
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300 animate-pulse"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {activeCount > 0 ? `${activeCount} Unresolved` : "0 Active Incidents"}
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 py-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="mb-2 h-7 w-7 text-emerald-400/80" />
            <span>All systems running normally with zero open incidents.</span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {incidents.map((incident) => {
              const isCritical = incident.severity === "CRITICAL";
              const isResolved = incident.status === "RESOLVED";

              const Icon = isResolved
                ? CheckCircle2
                : isCritical
                ? ShieldAlert
                : AlertTriangle;

              const badgeColor = isResolved
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isCritical
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30";

              return (
                <div
                  key={incident.incident_id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition hover:border-slate-700/80"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Icon
                      size={18}
                      className={`mt-0.5 shrink-0 ${
                        isResolved
                          ? "text-emerald-400"
                          : isCritical
                          ? "text-rose-400"
                          : "text-amber-400"
                      }`}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">
                          {incident.service_name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {incident.incident_id?.slice(0, 8)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400 truncate">
                        {incident.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}
                    >
                      {incident.severity}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {incident.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
        <span>Sentinel Observability Pipeline</span>
        <span>Auto-Sync Active</span>
      </div>
    </div>
  );
}