import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  Play,
  ShieldCheck,
  UserCheck,
  Wrench,
  XCircle,
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
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function AuditTimeline() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAudit() {
    try {
      const response =
        await api.get("/audit");

      setEvents(response.data);
    } catch (error) {
      console.error(
        "Failed to load audit trail:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAudit();

    const interval = setInterval(
      loadAudit,
      2000
    );

    const refreshHandler = () => {
      loadAudit();
    };

    window.addEventListener(
      "sentinel:refresh",
      refreshHandler
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "sentinel:refresh",
        refreshHandler
      );
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Incident Audit Trail
          </h2>

          <p className="text-sm text-slate-400">
            Complete decision and remediation history
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">

          <Activity size={14} />

          LIVE

        </div>

      </div>

      {loading ? (

        <div className="rounded-xl bg-slate-900 p-6 text-center text-slate-400">
          Loading audit events...
        </div>

      ) : events.length === 0 ? (

        <div className="rounded-xl bg-slate-900 p-6 text-center text-slate-400">
          No audit events yet.
        </div>

      ) : (

        <div className="relative space-y-4">

          {events.map(
            (event, index) => {

              const Icon =
                getEventIcon(
                  event.event_type
                );

              return (
                <div
                  key={`${event.timestamp}-${index}`}
                  className="relative flex gap-4"
                >

                  {index <
                    events.length - 1 && (
                    <div className="absolute left-5 top-12 h-full w-px bg-slate-800" />
                  )}

                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900">

                    <Icon
                      size={18}
                      className="text-cyan-400"
                    />

                  </div>

                  <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-4">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <h3 className="font-semibold text-white">
                        {formatEventName(
                          event.event_type
                        )}
                      </h3>

                      <span className="text-xs text-slate-500">
                        {new Date(
                          event.timestamp
                        ).toLocaleTimeString()}
                      </span>

                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">

                      {event.service_name && (
                        <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                          {event.service_name}
                        </span>
                      )}

                      {event.incident_id && (
                        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                          {event.incident_id}
                        </span>
                      )}

                      <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {event.actor}
                      </span>

                    </div>

                    {event.action && (
                      <p className="mt-3 text-sm font-medium text-white">
                        {event.action}
                      </p>
                    )}

                    {event.details && (
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {event.details}
                      </p>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}