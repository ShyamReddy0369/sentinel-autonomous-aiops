import { CheckCircle2, BrainCircuit, Sparkles, AlertCircle, Cpu } from "lucide-react";
import useDiagnosis from "../../hooks/useDiagnosis";

export default function AIBrain() {
  const diagnosis = useDiagnosis();
  const hasIncident = Boolean(diagnosis.root_cause && diagnosis.root_cause !== "None" && diagnosis.confidence > 0);

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <BrainCircuit size={17} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Sentinel AI Brain
                </h3>
                <span className="flex items-center gap-1 rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
                  <Sparkles size={10} />
                  LLM REASONING
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Autonomous Root Cause Analysis & Anomaly Inference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-black/40 px-2.5 py-0.5 text-[10px] font-mono text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                hasIncident ? "bg-rose-500 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span>{hasIncident ? "ANOMALY IDENTIFIED" : "SYSTEM NOMINAL"}</span>
          </div>
        </div>

        {/* Multi-Agent Reasoning Pipeline Bar */}
        <div className="mb-4 flex items-center justify-between gap-1 rounded-lg border border-white/[0.06] bg-black/30 p-2 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-cyan-400">
            <Cpu size={12} />
            <span>1. Telemetry Ingest</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className={`flex items-center gap-1 ${hasIncident ? "text-amber-300" : "text-slate-400"}`}>
            <span>2. Gemini Reasoning</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className={`flex items-center gap-1 ${hasIncident ? "text-emerald-400" : "text-slate-400"}`}>
            <span>3. Policy Validated</span>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Root Cause Card */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Inferred Root Cause
            </span>

            {hasIncident ? (
              <div className="mt-1.5 flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <p className="text-xs font-semibold text-rose-200">
                  {diagnosis.root_cause}
                </p>
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-black/30 p-3 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>Zero telemetry anomalies detected. Microservices within baseline thresholds.</span>
              </div>
            )}
          </div>

          {/* AI Confidence Meter */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Diagnostic Confidence
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {diagnosis.confidence}%
              </span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/[0.06]">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${diagnosis.confidence}%` }}
              />
            </div>
          </div>

          {/* AI Recommendation */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Prescribed Remediation
            </span>

            <div className="mt-1.5 flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-black/40 p-3">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
              />
              <p className="text-[11px] leading-relaxed text-slate-300">
                {diagnosis.recommendation || "System stable. Standing by to formulate mitigation tactics upon fault detection."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] font-mono text-slate-400">
        <span>Model: Gemini 2.5 Ops Agent</span>
        <span>Inference Latency: ~140ms</span>
      </div>
    </div>
  );
}