import {
  Bot,
  CheckCircle2,
  Play,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Loader2,
  Zap,
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
      <section className="relative overflow-hidden rounded-xl border border-cyan-500/25 bg-[#060e22]/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Bot size={17} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white to-purple-300 font-mono">
              AI Incident Remediation
            </h3>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Autonomous safety validation & resolution executor
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center rounded-lg border border-cyan-500/20 bg-black/50 p-6 text-xs font-mono text-cyan-400/80">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-cyan-400" />
          SYNCHRONIZING REMEDIATION PLAN...
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
      ? "text-rose-400 drop-shadow-[0_0_6px_rgba(255,0,85,0.8)]"
      : remediation.risk === "MEDIUM"
      ? "text-amber-400 drop-shadow-[0_0_6px_rgba(255,184,0,0.8)]"
      : "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]";

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/25 bg-linear-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Bot size={18} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-purple-200 to-purple-400 font-mono">
                  Remediation Execution Gate
                </h3>
                <span className="rounded border border-purple-500/40 bg-purple-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.25)]">
                  GUARDRAILS ACTIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-500/70">
                Safety-validated autonomous incident mitigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-black/60 px-3 py-0.5 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <span
              className={`h-2 w-2 rounded-full ${
                isExecuted
                  ? "bg-emerald-400 shadow-[0_0_8px_#00ff9d]"
                  : isIdle
                  ? "bg-slate-400"
                  : "bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]"
              }`}
            />
            <span className="text-cyan-200">{remediation.status}</span>
          </div>
        </div>

        {isIdle ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-cyan-500/30 bg-black/40 py-8 text-center shadow-[inset_0_0_15px_rgba(0,240,255,0.03)]">
            <ShieldCheck className="h-9 w-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(0,255,157,0.6)] mb-2" />
            <p className="text-xs font-bold font-mono text-emerald-300">
              No Remediation Required
            </p>
            <p className="mt-1 text-[11px] font-mono text-cyan-500/70 max-w-xs">
              System is operating within healthy parameters. Trigger chaos above to test the autonomous remediation loop.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Mitigation Action Header */}
            <div className="rounded-lg border border-cyan-500/25 bg-black/50 p-3 shadow-[inset_0_0_10px_rgba(0,240,255,0.03)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold">
                TARGET ACTION PROCEDURE
              </span>
              <h4 className="mt-1 text-xs font-bold text-white font-mono tracking-wide flex items-center gap-1.5">
                <Zap size={13} className="text-cyan-400" />
                {remediation.action}
              </h4>
              <p className="mt-1 text-[11px] font-mono leading-relaxed text-slate-300">
                {remediation.reason}
              </p>
            </div>

            {/* Risk & Safety Meta Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-cyan-500/20 bg-black/50 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400/60 font-semibold">
                  Risk Tier
                </span>
                <p className={`mt-0.5 font-mono text-xs font-bold ${riskColor}`}>
                  {remediation.risk}
                </p>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-black/50 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400/60 font-semibold">
                  Governance
                </span>
                <p className="mt-0.5 font-mono text-[10px] font-bold text-amber-300 drop-shadow-[0_0_6px_rgba(255,184,0,0.5)]">
                  {remediation.requires_approval ? "HITL APPROVAL" : "AUTO-PILOT"}
                </p>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-black/50 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400/60 font-semibold">
                  State
                </span>
                <p className="mt-0.5 font-mono text-[10px] font-bold text-cyan-300 drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]">
                  {remediation.status}
                </p>
              </div>
            </div>

            {/* Human in the loop alert */}
            {canExecute && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/50 bg-linear-to-r from-amber-950/40 to-black/60 p-3 shadow-[0_0_15px_rgba(255,184,0,0.2)]">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(255,184,0,0.8)]" />
                <div>
                  <p className="text-[11px] font-bold font-mono text-amber-300">
                    {remediation.requires_approval
                      ? "Operator Approval Required to Remediate"
                      : "Remediation Safety Validated — Operator Trigger Ready"}
                  </p>
                  <p className="mt-0.5 text-[10px] font-mono leading-relaxed text-amber-200/80">
                    {remediation.requires_approval
                      ? "Action modifies critical infrastructure. Review procedure and grant authorization below to resolve."
                      : "Automated safeguards confirmed non-destructive. Click below to execute resolution immediately."}
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
                  className="group relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-2.5 text-xs font-mono font-bold text-black shadow-[0_0_25px_rgba(0,255,157,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,255,157,0.6)] hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {executing ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-black" />
                      <span>EXECUTING MITIGATION...</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} className="fill-black" />
                      <span>APPROVE & EXECUTE RESOLUTION NOW</span>
                    </>
                  )}
                </button>

                <button
                  onClick={rejectRemediation}
                  disabled={executing}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-xs font-mono font-bold text-rose-300 transition-all hover:bg-rose-500/30 hover:border-rose-400 active:scale-[0.98] disabled:opacity-50 shadow-[0_0_12px_rgba(255,0,85,0.2)]"
                >
                  <XCircle size={13} />
                  <span>Reject</span>
                </button>
              </div>
            )}

            {isExecuted && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(0,255,157,0.25)]">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                <span>Remediation completed successfully. Microservice baseline restored.</span>
              </div>
            )}

            {isRejected && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-950/40 p-2.5 text-xs font-mono font-bold text-rose-300 shadow-[0_0_15px_rgba(255,0,85,0.25)]">
                <XCircle size={15} className="text-rose-400 shrink-0 drop-shadow-[0_0_6px_rgba(255,0,85,0.8)]" />
                <span>Plan rejected by engineer. Fallback runbook queued.</span>
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-cyan-500/25 bg-black/60 p-2 text-[11px] text-cyan-200 font-mono shadow-[inset_0_0_8px_rgba(0,240,255,0.05)]">
                {message}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-[10px] font-mono text-cyan-500/60 font-semibold">
        <span>SAFEGUARDS: ENFORCED</span>
        <span>AUDIT TRAIL: CRYPTO_SIGNED</span>
      </div>
    </section>
  );
}
