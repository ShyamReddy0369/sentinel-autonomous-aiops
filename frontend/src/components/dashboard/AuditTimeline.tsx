import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Play,
  ShieldCheck,
  UserCheck,
  Wrench,
  XCircle,
  FileText,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface AuditEvent {
  timestamp: string;
  event_type: string;
  incident_id: string | null;
  service_name: string | null;
  action: string | null;
  details: string | null;
  actor: string;
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case "AI_ANALYSIS_STARTED":
      return Activity;
    case "AI_DIAGNOSIS":
      return BrainCircuit;
    case "AI_RECOMMENDATION":
      return Wrench;
    case "SAFETY_VALIDATION":
      return ShieldCheck;
    case "REMEDIATION_APPROVED":
      return UserCheck;
    case "EXECUTION_STARTED":
      return Play;
    case "EXECUTION_COMPLETED":
      return CheckCircle2;
    case "INCIDENT_RESOLVED":
      return CheckCircle2;
    case "REMEDIATION_REJECTED":
      return XCircle;
    default:
      return Activity;
  }
}

function formatEventName(eventType: string) {
  return eventType
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AuditTimeline() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAudit() {
    try {
      const response = await api.get("/audit");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to load audit trail:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAudit();
    const interval = setInterval(loadAudit, 2500);

    const refreshHandler = () => {
      loadAudit();
    };

    window.addEventListener("sentinel:refresh", refreshHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("sentinel:refresh", refreshHandler);
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-xl border border-cyan-500/25 bg-linear-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <FileText size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-purple-100 to-purple-300 font-mono">
                Audit Trail & Governance Ledger
              </h3>
              <span className="flex items-center gap-1 rounded border border-purple-500/40 bg-purple-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.25)]">
                <Lock size={9} />
                SOC-2 COMPLIANT
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Cryptographically signed record of AI agent reasoning & human operator approvals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          <Activity size={11} className="animate-pulse" />
          <span>{events.length} EVENTS RECORDED</span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-36 items-center justify-center rounded-lg border border-cyan-500/20 bg-black/40 font-mono text-xs text-cyan-500/70">
          Ingesting audit ledger...
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-cyan-500/25 bg-black/40 font-mono text-xs text-slate-400">
          No audit records logged yet. Inject a fault above to initiate the ledger.
        </div>
      ) : (
        <div className="relative max-h-80 space-y-2 overflow-y-auto pr-1">
          {events.map((event, index) => {
            const Icon = getEventIcon(event.event_type);
            const isResolution =
              event.event_type === "INCIDENT_RESOLVED" ||
              event.event_type === "EXECUTION_COMPLETED";

            return (
              <div
                key={`${event.timestamp}-${index}`}
                className="group flex items-start gap-3 rounded-lg border border-cyan-500/20 bg-black/50 p-3 transition hover:border-cyan-400/40 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)]"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border ${
                    isResolution
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
                      : "border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                  }`}
                >
                  <Icon size={13} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white tracking-tight">
                        {formatEventName(event.event_type)}
                      </span>
                      {event.service_name && (
                        <span className="rounded border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-cyan-300 shadow-[0_0_6px_rgba(0,240,255,0.2)]">
                          {event.service_name}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[9px] text-cyan-400/70 font-semibold">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {event.action && (
                    <p className="mt-0.5 text-xs font-mono font-medium text-slate-200">
                      {event.action}
                    </p>
                  )}

                  {event.details && (
                    <p className="mt-0.5 text-[11px] font-mono leading-relaxed text-slate-300/90">
                      {event.details}
                    </p>
                  )}

                  <div className="mt-1.5 flex items-center gap-2 text-[9px] font-mono text-slate-400">
                    <span>
                      Actor: <span className="text-cyan-300 font-bold">@{event.actor}</span>
                    </span>
                    {event.incident_id && (
                      <>
                        <span className="text-cyan-500/60">•</span>
                        <span className="text-cyan-400/80">
                          ID: #{event.incident_id.slice(0, 8)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
