import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  UserCheck,
  Wrench,
  XCircle,
} from "lucide-react";

import useActivity from "../../hooks/useActivity";

function getIcon(eventType: string) {
  if (eventType === "AI_DIAGNOSIS") {
    return BrainCircuit;
  }

  if (eventType === "AI_RECOMMENDATION") {
    return Wrench;
  }

  if (eventType === "SAFETY_VALIDATION") {
    return ShieldCheck;
  }

  if (eventType === "REMEDIATION_APPROVED") {
    return UserCheck;
  }

  if (eventType === "INCIDENT_RESOLVED") {
    return CheckCircle2;
  }

  if (eventType === "REMEDIATION_REJECTED") {
    return XCircle;
  }

  return Clock3;
}

function formatEvent(eventType: string) {
  return eventType
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

export default function ActivityFeed() {
  const events = useActivity();

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Live Agent Activity
          </h2>

          <p className="text-sm text-slate-400">
            Real-time Sentinel operations
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          LIVE
        </div>

      </div>

      {events.length === 0 ? (

        <div className="rounded-xl bg-slate-900 p-5 text-slate-400">
          Waiting for agent activity...
        </div>

      ) : (

        <div className="space-y-3">

          {events.map((event, index) => {

            const Icon =
              getIcon(event.event_type);

            return (
              <div
                key={`${event.timestamp}-${index}`}
                className="flex gap-4 rounded-xl bg-slate-900 p-4"
              >

                <div className="rounded-lg bg-cyan-500/10 p-2">
                  <Icon
                    size={20}
                    className="text-cyan-400"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center justify-between gap-2">

                    <h3 className="font-semibold text-white">
                      {formatEvent(
                        event.event_type
                      )}
                    </h3>

                    <span className="text-xs text-slate-500">
                      {new Date(
                        event.timestamp
                      ).toLocaleTimeString()}
                    </span>

                  </div>

                  <p className="mt-1 text-xs text-cyan-400">
                    {event.actor}
                  </p>

                  {event.service_name && (
                    <p className="mt-2 text-sm text-slate-300">
                      {event.service_name}
                    </p>
                  )}

                  {event.details && (
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {event.details}
                    </p>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}