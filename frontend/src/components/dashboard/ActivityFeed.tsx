import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  UserCheck,
  Wrench,
  XCircle,
  Radio,
} from "lucide-react";
import useActivity from "../../hooks/useActivity";

function getIcon(eventType: string) {
  if (eventType === "AI_DIAGNOSIS") return BrainCircuit;
  if (eventType === "AI_RECOMMENDATION") return Wrench;
  if (eventType === "SAFETY_VALIDATION") return ShieldCheck;
  if (eventType === "REMEDIATION_APPROVED") return UserCheck;
  if (eventType === "INCIDENT_RESOLVED") return CheckCircle2;
  if (eventType === "REMEDIATION_REJECTED") return XCircle;
  return Clock3;
}

function formatEvent(eventType: string) {
  return eventType
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ActivityFeed() {
  const events = useActivity();

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                Autonomous Agent Stream
              </h3>
              <p className="text-xs text-slate-400">
                Real-time Sentinel AI reasoning & mitigation trace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <Radio size={12} className="animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 py-8 text-center text-xs text-slate-400">
            <Clock3 className="mb-2 h-7 w-7 text-cyan-400/80" />
            <span>Waiting for agent events. Autonomous background loop active.</span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {events.map((event, index) => {
              const Icon = getIcon(event.event_type);
              const isResolved = event.event_type === "INCIDENT_RESOLVED";
              const isDiagnosis = event.event_type === "AI_DIAGNOSIS";

              return (
                <div
                  key={`${event.timestamp}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 transition hover:border-slate-700/80"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                      isResolved
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : isDiagnosis
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                        : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                    }`}
                  >
                    <Icon size={14} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {formatEvent(event.event_type)}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        {event.timestamp.slice(11, 19)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                      {event.details || "Autonomous event recorded."}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-medium text-cyan-300">
                        @{event.actor}
                      </span>
                      {event.service_name && (
                        <>
                          <span>•</span>
                          <span>{event.service_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
        <span>Multi-Agent Swarm: 5 Active Agents</span>
        <span>Consensus: Optimal</span>
      </div>
    </section>
  );
}