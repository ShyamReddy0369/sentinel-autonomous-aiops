import {
  Bot,
  CheckCircle2,
  Play,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Loader2,
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
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              AI Incident Remediation
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous safety validation & resolution executor
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 p-8 text-xs text-slate-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-400" />
          Synchronizing remediation plan...
        </div>
      </section>
    );
  }

  const isIdle = remediation.status === "IDLE";
  const canExecute =
    remediation.status === "READY" ||
    remediation.status === "APPROVAL_REQUIRED";
  const isExecuted = remediation.status === "EXECUTED";
  const isRejected = remediation.status === "REJECTED";

  const riskColor =
    remediation.risk === "HIGH" || remediation.risk === "CRITICAL"
      ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
      : remediation.risk === "MEDIUM"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-sm shadow-purple-950/40">
              <Bot size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  AI Remediation Command
                </h2>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-300">
                  Execution Safety Gate
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                Safety-validated autonomous incident mitigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isExecuted
                  ? "bg-emerald-400"
                  : isIdle
                  ? "bg-slate-500"
                  : "bg-purple-400 animate-pulse"
              }`}
            />
            <span className="text-[11px] uppercase tracking-wider">
              {remediation.status}
            </span>
          </div>
        </div>

        {isIdle ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 py-10 text-center">
            <ShieldCheck className="h-10 w-10 text-emerald-400/60 mb-2" />
            <p className="text-sm font-medium text-slate-300">
              No Remediation Required
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              System is operating within healthy parameters. Inject chaos above to test the autonomous mitigation loop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mitigation Action Header */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Mitigation Procedure
              </span>
              <h3 className="mt-1 text-base font-bold text-white tracking-tight">
                {remediation.action}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                {remediation.reason}
              </p>
            </div>

            {/* Risk & Safety Meta Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Risk Tier
                </span>
                <p className={`mt-1 text-xs font-bold ${riskColor.split(" ")[0]}`}>
                  {remediation.risk}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Governance
                </span>
                <p className="mt-1 text-xs font-bold text-amber-300">
                  {remediation.requires_approval ? "HITL REQUIRED" : "AUTO-APPROVED"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Gate State
                </span>
                <p className="mt-1 text-xs font-bold text-cyan-400">
                  {remediation.status}
                </p>
              </div>
            </div>

            {/* Human in the loop alert */}
            {remediation.requires_approval && canExecute && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    Human-in-the-Loop Governance Active
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-amber-200/80">
                    Action involves infrastructure adjustments classified as {remediation.risk} risk. Explicit SRE sign-off requested.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {canExecute && !isExecuted && !isRejected && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={executeRemediation}
                  disabled={executing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Executing Remediation...
                    </>
                  ) : (
                    <>
                      <Play size={15} />
                      Approve & Execute Remediation
                    </>
                  )}
                </button>

                <button
                  onClick={rejectRemediation}
                  disabled={executing}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <XCircle size={15} />
                  Reject
                </button>
              </div>
            )}

            {isExecuted && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Remediation executed successfully. Microservice restored to nominal baseline.</span>
              </div>
            )}

            {isRejected && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-300">
                <XCircle size={16} className="text-rose-400 shrink-0" />
                <span>Remediation plan rejected by engineer. Fallback manual runbook loaded.</span>
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
                {message}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
        <span>Sentinel Safety Guardrails: Active</span>
        <span>Audit Trail: Immutable</span>
      </div>
    </section>
  );
}