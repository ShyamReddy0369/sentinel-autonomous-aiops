import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Play,
  ShieldCheck,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "../../services/api";

interface Incident {
  incident_id: string;
  service_name: string;
  severity: string;
  status: string;
  description: string;
}

interface AuditEvent {
  timestamp: string;
  event_type: string;
  incident_id: string | null;
  service_name: string | null;
  action: string | null;
  details: string | null;
  actor: string;
}

function severityClass(severity: string) {
  switch (severity.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    case "HIGH":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";

    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    case "LOW":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
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

function extractConfidence(events: AuditEvent[]) {
  const diagnosis = events.find(
    (event) =>
      event.event_type === "AI_DIAGNOSIS"
  );

  if (!diagnosis?.details) {
    return "N/A";
  }

  const match =
    diagnosis.details.match(
      /Confidence:\s*(\d+)%/i
    );

  return match
    ? `${match[1]}%`
    : "N/A";
}

function extractRootCause(events: AuditEvent[]) {
  const diagnosis = events.find(
    (event) =>
      event.event_type === "AI_DIAGNOSIS"
  );

  if (!diagnosis?.details) {
    return "Not available";
  }

  return diagnosis.details
    .replace(
      /^Root cause:\s*/i,
      ""
    )
    .replace(
      /\s*\|\s*Confidence:.*$/i,
      ""
    );
}

function extractRecommendation(
  events: AuditEvent[]
) {
  const recommendation =
    events.find(
      (event) =>
        event.event_type ===
        "AI_RECOMMENDATION"
    );

  return (
    recommendation?.action ||
    "Not available"
  );
}

function extractRecovery(events: AuditEvent[]) {
  const execution =
    events.find(
      (event) =>
        event.event_type ===
        "EXECUTION_COMPLETED"
    );

  if (!execution?.details) {
    return "Not available";
  }

  return execution.details
    .replace(
      /^Service recovered\.\s*/i,
      ""
    );
}

export default function IncidentHistory() {
  const [incidents, setIncidents] =
    useState<Incident[]>([]);

  const [auditEvents, setAuditEvents] =
    useState<Record<string, AuditEvent[]>>(
      {}
    );

  const [loading, setLoading] =
    useState(true);

  const [expandedIncident, setExpandedIncident] =
    useState<string | null>(null);

  const [loadingDetails, setLoadingDetails] =
    useState<string | null>(null);

  async function loadIncidents() {
    try {
      const response =
        await api.get("/incidents");

      setIncidents(response.data);
    } catch (error) {
      console.error(
        "Failed to load incident history:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadIncidentDetails(
    incidentId: string
  ) {
    if (auditEvents[incidentId]) {
      return;
    }

    try {
      setLoadingDetails(incidentId);

      const response =
        await api.get(
          `/audit/${incidentId}`
        );

      setAuditEvents((previous) => ({
        ...previous,
        [incidentId]: response.data,
      }));

    } catch (error) {
      console.error(
        "Failed to load incident details:",
        error
      );
    } finally {
      setLoadingDetails(null);
    }
  }

  async function toggleIncident(
    incidentId: string
  ) {
    if (
      expandedIncident ===
      incidentId
    ) {
      setExpandedIncident(null);
      return;
    }

    setExpandedIncident(incidentId);

    await loadIncidentDetails(
      incidentId
    );
  }

  useEffect(() => {
    loadIncidents();

    const interval = setInterval(
      loadIncidents,
      3000
    );

    const refreshHandler = () => {
      loadIncidents();
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
            Incident History
          </h2>

          <p className="text-sm text-slate-400">
            Historical infrastructure incidents
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">

          <Clock size={14} />

          {incidents.length} Incidents

        </div>

      </div>

      {loading ? (

        <div className="rounded-xl bg-slate-900 p-6 text-center text-slate-400">
          Loading incident history...
        </div>

      ) : incidents.length === 0 ? (

        <div className="rounded-xl bg-slate-900 p-6 text-center text-slate-400">
          No historical incidents.
        </div>

      ) : (

        <div className="space-y-3">

          {incidents.map((incident) => {

            const expanded =
              expandedIncident ===
              incident.incident_id;

            const events =
              auditEvents[
                incident.incident_id
              ] || [];

            return (
              <div
                key={incident.incident_id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >

                <button
                  onClick={() =>
                    toggleIncident(
                      incident.incident_id
                    )
                  }
                  className="w-full p-4 text-left transition hover:bg-slate-800"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-slate-800 p-3">

                      {incident.status ===
                      "RESOLVED" ? (
                        <CheckCircle2
                          size={22}
                          className="text-green-400"
                        />
                      ) : (
                        <Activity
                          size={22}
                          className="text-red-400"
                        />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-white">
                          {incident.service_name}
                        </h3>

                        <span
                          className={`rounded-md border px-2 py-1 text-xs font-semibold ${severityClass(
                            incident.severity
                          )}`}
                        >
                          {incident.severity}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-slate-400">
                        {incident.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs">

                        <span className="text-slate-500">
                          {incident.incident_id}
                        </span>

                        <span
                          className={
                            incident.status ===
                            "RESOLVED"
                              ? "font-semibold text-green-400"
                              : "font-semibold text-red-400"
                          }
                        >
                          {incident.status}
                        </span>

                      </div>

                    </div>

                    {expanded ? (
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-slate-500"
                      />
                    ) : (
                      <ChevronRight
                        size={20}
                        className="shrink-0 text-slate-500"
                      />
                    )}

                  </div>

                </button>

                {expanded && (
                  <div className="border-t border-slate-800 p-5">

                    {loadingDetails ===
                    incident.incident_id ? (

                      <div className="py-6 text-center text-slate-400">
                        Loading incident details...
                      </div>

                    ) : events.length === 0 ? (

                      <div className="py-6 text-center text-slate-400">
                        No audit events found for this incident.
                      </div>

                    ) : (

                      <div className="space-y-6">

                        <div className="grid gap-4 md:grid-cols-4">

                          <div className="rounded-xl bg-slate-950 p-4">

                            <p className="text-xs text-slate-500">
                              Root Cause
                            </p>

                            <p className="mt-2 text-sm text-white">
                              {extractRootCause(
                                events
                              )}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-950 p-4">

                            <p className="text-xs text-slate-500">
                              AI Confidence
                            </p>

                            <p className="mt-2 text-xl font-bold text-cyan-400">
                              {extractConfidence(
                                events
                              )}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-950 p-4">

                            <p className="text-xs text-slate-500">
                              Remediation
                            </p>

                            <p className="mt-2 text-sm font-semibold text-white">
                              {extractRecommendation(
                                events
                              )}
                            </p>

                          </div>

                          <div className="rounded-xl bg-slate-950 p-4">

                            <p className="text-xs text-slate-500">
                              Recovery
                            </p>

                            <p className="mt-2 text-sm font-semibold text-green-400">
                              {extractRecovery(
                                events
                              )}
                            </p>

                          </div>

                        </div>

                        <div>

                          <div className="mb-4 flex items-center gap-2">

                            <Activity
                              size={18}
                              className="text-cyan-400"
                            />

                            <h3 className="font-semibold text-white">
                              Incident Timeline
                            </h3>

                          </div>

                          <div className="space-y-4">

                            {events.map(
                              (
                                event,
                                index
                              ) => {

                                const Icon =
                                  getEventIcon(
                                    event.event_type
                                  );

                                return (
                                  <div
                                    key={`${event.timestamp}-${index}`}
                                    className="flex gap-4"
                                  >

                                    <div className="flex flex-col items-center">

                                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-950">

                                        <Icon
                                          size={16}
                                          className="text-cyan-400"
                                        />

                                      </div>

                                      {index <
                                        events.length -
                                          1 && (
                                        <div className="mt-1 h-full w-px bg-slate-800" />
                                      )}

                                    </div>

                                    <div className="flex-1 rounded-xl bg-slate-950 p-4">

                                      <div className="flex flex-wrap items-center justify-between gap-2">

                                        <h4 className="font-semibold text-white">
                                          {formatEventName(
                                            event.event_type
                                          )}
                                        </h4>

                                        <span className="text-xs text-slate-500">
                                          {new Date(
                                            event.timestamp
                                          ).toLocaleTimeString()}
                                        </span>

                                      </div>

                                      <div className="mt-2 flex flex-wrap gap-2">

                                        <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                                          {event.actor}
                                        </span>

                                        {event.action && (
                                          <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                                            {event.action}
                                          </span>
                                        )}

                                      </div>

                                      {event.details && (
                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                          {event.details}
                                        </p>
                                      )}

                                    </div>

                                  </div>
                                );
                              }
                            )}

                          </div>

                        </div>

                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}