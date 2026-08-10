import {
  Bot,
  CheckCircle2,
  Play,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import useRemediation from "../../hooks/useRemediation";

export default function RemediationPanel() {
  const {
    remediation,
    executing,
    message,
    executeRemediation,
    rejectRemediation,
  } = useRemediation();

  if (!remediation) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <Bot
              size={28}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Remediation
            </h2>

            <p className="text-sm text-slate-400">
              Autonomous incident response
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-900 p-5 text-slate-400">
          Loading remediation...
        </div>
      </section>
    );
  }

  const isIdle =
    remediation.status === "IDLE";

  const canExecute =
    remediation.status === "READY" ||
    remediation.status === "APPROVAL_REQUIRED";

  const isExecuted =
    remediation.status === "EXECUTED";

  const isRejected =
    remediation.status === "REJECTED";

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/10 p-3">
          <Bot
            size={28}
            className="text-cyan-400"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Remediation
          </h2>

          <p className="text-sm text-slate-400">
            Autonomous incident response
          </p>
        </div>
      </div>

      {isIdle ? (
        <div className="rounded-xl bg-slate-900 p-5 text-slate-400">
          No active incidents requiring remediation.
        </div>
      ) : (
        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-400">
              Recommended Action
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              {remediation.action}
            </h3>
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Reason
            </p>

            <p className="mt-2 leading-7 text-slate-300">
              {remediation.reason}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Risk
              </p>

              <p className="mt-1 font-bold text-yellow-400">
                {remediation.risk}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Approval
              </p>

              <p className="mt-1 font-bold text-yellow-400">
                {remediation.requires_approval
                  ? "REQUIRED"
                  : "NOT REQUIRED"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p className="mt-1 font-bold text-cyan-400">
                {remediation.status}
              </p>
            </div>

          </div>

          {remediation.requires_approval && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">

              <div className="flex items-start gap-3">

                <ShieldAlert
                  size={22}
                  className="mt-0.5 shrink-0 text-yellow-400"
                />

                <div>

                  <p className="font-semibold text-yellow-300">
                    Human Approval Required
                  </p>

                  <p className="mt-1 text-sm leading-6 text-yellow-200/70">
                    This remediation has been classified
                    as {remediation.risk} risk and cannot
                    execute without explicit human approval.
                  </p>

                </div>

              </div>

            </div>
          )}

          {!remediation.requires_approval &&
            remediation.status === "READY" && (
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">

                <CheckCircle2
                  size={22}
                  className="text-green-400"
                />

                <span className="text-green-300">
                  Remediation passed safety validation.
                </span>

              </div>
            )}

          {canExecute &&
            !isExecuted &&
            !isRejected && (
              <div className="flex gap-3">

                <button
                  onClick={executeRemediation}
                  disabled={executing}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={18} />

                  {executing
                    ? "Executing..."
                    : "Approve & Execute"}
                </button>

                <button
                  onClick={rejectRemediation}
                  disabled={executing}
                  className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <XCircle size={18} />

                  Reject
                </button>

              </div>
            )}

          {isExecuted && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
              ✓ Remediation executed successfully.
              Service is now healthy.
            </div>
          )}

          {isRejected && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
              Remediation recommendation rejected.
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-slate-900 p-4 text-sm text-slate-300">
              {message}
            </div>
          )}

        </div>
      )}

    </section>
  );
}