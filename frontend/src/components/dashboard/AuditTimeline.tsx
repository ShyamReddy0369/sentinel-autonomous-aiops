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
    <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Incident Audit Trail & Governance Log
              </h2>
              <span className="flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                <Lock size={10} />
                SOC2 Verifiable
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Cryptographically signed chronological record of all AI actions, decisions & human approvals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
          <Activity size={14} className="animate-pulse" />
          <span>{events.length} Recorded Ledger Events</span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          Ingesting audit ledger...
        </div>
      ) : events.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          No audit records logged yet. Trigger a fault above to initiate the audit ledger.
        </div>
      ) : (
        <div className="relative max-h-96 space-y-3 overflow-y-auto pr-2">
          {events.map((event, index) => {
            const Icon = getEventIcon(event.event_type);
            const isResolution =
              event.event_type === "INCIDENT_RESOLVED" ||
              event.event_type === "EXECUTION_COMPLETED";

            return (
              <div
                key={`${event.timestamp}-${index}`}
                className="group relative flex items-start gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition hover:border-slate-700/80 hover:bg-slate-950/90"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                    isResolution
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {formatEventName(event.event_type)}
                      </span>
                      {event.service_name && (
                        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          {event.service_name}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {event.action && (
                    <p className="mt-1 text-xs font-medium text-slate-200">
                      {event.action}
                    </p>
                  )}

                  {event.details && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {event.details}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                    <span>
                      Actor: <span className="font-semibold text-slate-300">@{event.actor}</span>
                    </span>
                    {event.incident_id && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-slate-400">
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