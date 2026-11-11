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
      <div className="rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4 backdrop-blur-md">
        <h4 className="text-xs font-mono uppercase tracking-wider text-white">Live Incident Log</h4>
        <p className="mt-2 text-xs font-mono text-slate-400">Loading active incident records...</p>
      </div>
    );
  }

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4 backdrop-blur-md">
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <Flame size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Incident Stream
              </h4>
              <p className="text-[11px] text-slate-400">
                Active alerts & anomalous service events
              </p>
            </div>
          </div>

          <span
            className={`rounded px-2 py-0.5 text-[10px] font-mono font-semibold border ${
              activeCount > 0
                ? "border-rose-500/30 bg-rose-500/10 text-rose-300 animate-pulse"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {activeCount > 0 ? `${activeCount} UNRESOLVED` : "0 ACTIVE INCIDENTS"}
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-black/30 py-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="mb-1.5 h-6 w-6 text-emerald-400/80" />
            <span className="font-mono text-[11px]">All microservices nominal. Zero open incidents.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {incidents.map((incident) => {
              const isCritical = incident.severity === "CRITICAL";
              const isResolved = incident.status === "RESOLVED";

              const Icon = isResolved
                ? CheckCircle2
                : isCritical
                ? ShieldAlert
                : AlertTriangle;

              const badgeColor = isResolved
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isCritical
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20";

              return (
                <div
                  key={incident.incident_id}
                  className="flex items-center justify-between gap-2.5 rounded-lg border border-white/[0.06] bg-black/40 p-2.5 transition hover:border-white/[0.12]"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon
                      size={16}
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
                        <span className="font-mono text-[9px] text-slate-400">
                          {incident.incident_id?.slice(0, 8)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                        {incident.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 font-mono">
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider border ${badgeColor}`}
                    >
                      {incident.severity}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {incident.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[10px] font-mono text-slate-400">
        <span>Sentinel Observability Pipeline</span>
        <span>Auto-Sync Active</span>
      </div>
    </div>
  );
}