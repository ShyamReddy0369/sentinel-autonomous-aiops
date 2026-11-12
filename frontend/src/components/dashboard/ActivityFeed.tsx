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
    <section className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/25 bg-linear-to-b from-[#060e22]/90 to-black/80 p-4 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div>
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <BrainCircuit size={14} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-cyan-300 font-mono">
                Agent Activity Stream
              </h4>
              <p className="text-[11px] font-mono text-cyan-500/70">
                Live multi-agent reasoning, safety checks & actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_10px_rgba(0,255,157,0.2)]">
            <Radio size={10} className="animate-pulse text-emerald-400" />
            <span>STREAMING</span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-cyan-500/25 bg-black/40 py-6 text-center text-xs text-slate-400">
            <Clock3 className="mb-1.5 h-6 w-6 text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
            <span className="font-mono text-[11px] text-cyan-300/80">Standing by for agent activities. Loop active.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {events.map((event, index) => {
              const Icon = getIcon(event.event_type);
              const isResolved = event.event_type === "INCIDENT_RESOLVED";
              const isDiagnosis = event.event_type === "AI_DIAGNOSIS";

              return (
                <div
                  key={`${event.timestamp}-${index}`}
                  className="flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-black/50 p-2.5 transition hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                      isResolved
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
                        : isDiagnosis
                        ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                        : "border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                    }`}
                  >
                    <Icon size={12} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold font-mono text-white">
                        {formatEvent(event.event_type)}
                      </span>
                      <span className="font-mono text-[9px] text-cyan-400/70 shrink-0">
                        {event.timestamp.slice(11, 19)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] font-mono text-slate-300 line-clamp-2">
                      {event.details || "Autonomous event recorded."}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                      <span className="font-bold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,240,255,0.5)]">
                        @{event.actor}
                      </span>
                      {event.service_name && (
                        <>
                          <span className="text-cyan-500/60">•</span>
                          <span className="text-slate-300">{event.service_name}</span>
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

      <div className="mt-3 flex items-center justify-between border-t border-cyan-500/20 pt-2 text-[10px] font-mono text-cyan-500/60 font-semibold">
        <span>SWARM: 5 AGENTS ONLINE</span>
        <span>CONSENSUS: OPTIMAL</span>
      </div>
    </section>
  );
}
