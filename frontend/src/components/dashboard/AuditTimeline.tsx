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
    <section className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <FileText size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Audit Trail & Governance Ledger
              </h3>
              <span className="flex items-center gap-1 rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-indigo-300 border border-indigo-500/20">
                <Lock size={9} />
                SOC-2 COMPLIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cryptographically signed record of AI agent reasoning & human operator approvals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
          <Activity size={11} className="animate-pulse" />
          <span>{events.length} Events Logged</span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-36 items-center justify-center rounded-lg border border-white/[0.06] bg-black/30 font-mono text-xs text-slate-400">
          Ingesting audit ledger...
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-black/30 font-mono text-xs text-slate-400">
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
                className="group flex items-start gap-3 rounded-lg border border-white/[0.06] bg-black/40 p-3 transition hover:border-white/[0.12]"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border ${
                    isResolution
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                  }`}
                >
                  <Icon size={13} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white tracking-tight">
                        {formatEventName(event.event_type)}
                      </span>
                      {event.service_name && (
                        <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-cyan-300">
                          {event.service_name}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[9px] text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {event.action && (
                    <p className="mt-0.5 text-xs font-medium text-slate-200">
                      {event.action}
                    </p>
                  )}

                  {event.details && (
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      {event.details}
                    </p>
                  )}

                  <div className="mt-1.5 flex items-center gap-2 text-[9px] font-mono text-slate-400">
                    <span>
                      Actor: <span className="text-slate-300">@{event.actor}</span>
                    </span>
                    {event.incident_id && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400">
                          ID: {event.incident_id.slice(0, 8)}
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