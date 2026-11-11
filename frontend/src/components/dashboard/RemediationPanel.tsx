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
      <section className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
            <Bot size={17} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              AI Incident Remediation
            </h3>
            <p className="text-[11px] text-slate-400">
              Autonomous safety validation & resolution executor
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center rounded-lg border border-white/[0.06] bg-black/40 p-6 text-xs text-slate-400">
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
      ? "text-rose-400"
      : remediation.risk === "MEDIUM"
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <Bot size={17} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Remediation Execution Gate
                </h3>
                <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-purple-300 border border-purple-500/20">
                  GUARDRAILS VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Safety-validated autonomous incident mitigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-black/40 px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isExecuted
                  ? "bg-emerald-400"
                  : isIdle
                  ? "bg-slate-400"
                  : "bg-purple-400 animate-pulse"
              }`}
            />
            <span>{remediation.status}</span>
          </div>
        </div>

        {isIdle ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-black/30 py-8 text-center">
            <ShieldCheck className="h-8 w-8 text-emerald-400/70 mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              No Remediation Required
            </p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-xs">
              System is operating within healthy parameters. Trigger chaos above to test the autonomous remediation loop.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Mitigation Action Header */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Target Action Procedure
              </span>
              <h4 className="mt-1 text-xs font-bold text-white tracking-tight">
                {remediation.action}
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                {remediation.reason}
              </p>
            </div>

            {/* Risk & Safety Meta Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Risk Tier
                </span>
                <p className={`mt-0.5 font-mono text-xs font-bold ${riskColor}`}>
                  {remediation.risk}
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Governance Gate
                </span>
                <p className="mt-0.5 font-mono text-[10px] font-bold text-amber-300">
                  {remediation.requires_approval ? "HITL APPROVAL" : "AUTO-PILOT"}
                </p>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Execution State
                </span>
                <p className="mt-0.5 font-mono text-[10px] font-bold text-cyan-400">
                  {remediation.status}
                </p>
              </div>
            </div>

            {/* Human in the loop alert */}
            {remediation.requires_approval && canExecute && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-[11px] font-semibold text-amber-300">
                    Human-in-the-Loop Sign-off Required
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-amber-200/80">
                    Action modifies production infrastructure. Explicit operator authorization required.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {canExecute && !isExecuted && !isRejected && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={executeRemediation}
                  disabled={executing}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-950/40 transition hover:bg-emerald-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Executing Mitigation...
                    </>
                  ) : (
                    <>
                      <Play size={13} />
                      Approve & Execute Remediation
                    </>
                  )}
                </button>

                <button
                  onClick={rejectRemediation}
                  disabled={executing}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.99] disabled:opacity-50"
                >
                  <XCircle size={13} />
                  Reject
                </button>
              </div>
            )}

            {isExecuted && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Remediation completed successfully. Microservice baseline restored.</span>
              </div>
            )}

            {isRejected && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs font-medium text-rose-300">
                <XCircle size={15} className="text-rose-400 shrink-0" />
                <span>Plan rejected by engineer. Fallback runbook queued.</span>
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-white/[0.06] bg-black/40 p-2 text-[11px] text-slate-300 font-mono">
                {message}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] font-mono text-slate-400">
        <span>Destructive Safeguards: Active</span>
        <span>Audit Trail: Signed</span>
      </div>
    </section>
  );
}