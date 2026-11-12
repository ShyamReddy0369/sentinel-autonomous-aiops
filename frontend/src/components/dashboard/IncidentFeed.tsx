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
      <div className="rounded-xl border border-cyan-500/25 bg-[#060e22]/80 p-4 backdrop-blur-xl">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">Live Incident Log</h4>
        <p className="mt-2 text-xs font-mono text-cyan-500/70">Connecting to incident datastore...</p>
      </div>
    );
  }

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/25 bg-linear-to-b from-[#060e22]/90 to-black/80 p-4 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/15 text-rose-400 shadow-[0_0_10px_rgba(255,0,85,0.3)]">
              <Flame size={14} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-rose-100 to-rose-300 font-mono">
                Incident Stream
              </h4>
              <p className="text-[11px] font-mono text-cyan-500/70">
                Active alerts & anomalous service events
              </p>
            </div>
          </div>

          <span
            className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${
              activeCount > 0
                ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(255,0,85,0.4)] animate-pulse"
                : "border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
            }`}
          >
            {activeCount > 0 ? `${activeCount} UNRESOLVED` : "0 ACTIVE INCIDENTS"}
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-cyan-500/25 bg-black/40 py-6 text-center text-xs text-slate-400">
            <CheckCircle2 className="mb-1.5 h-6 w-6 text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]" />
            <span className="font-mono text-[11px] text-cyan-300/80">All microservices nominal. Zero open incidents.</span>
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
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
                : isCritical
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(255,0,85,0.3)] animate-pulse"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(255,184,0,0.3)]";

              return (
                <div
                  key={incident.incident_id}
                  className="flex items-center justify-between gap-2.5 rounded-lg border border-cyan-500/20 bg-black/50 p-2.5 transition hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon
                      size={16}
                      className={`mt-0.5 shrink-0 ${
                        isResolved
                          ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.6)]"
                          : isCritical
                          ? "text-rose-400 drop-shadow-[0_0_6px_rgba(255,0,85,0.8)]"
                          : "text-amber-400"
                      }`}
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-white text-xs">
                          {incident.service_name}
                        </span>
                        <span className="font-mono text-[9px] text-cyan-400/70">
                          #{incident.incident_id?.slice(0, 8)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-mono text-slate-300 truncate">
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
                    <span className="text-[9px] text-cyan-500/70 font-semibold">
                      {incident.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-[10px] font-mono text-cyan-500/60 font-semibold">
        <span>OBSERVABILITY_STREAM</span>
        <span>AUTO_SYNC: 1000MS</span>
      </div>
    </div>
  );
}
