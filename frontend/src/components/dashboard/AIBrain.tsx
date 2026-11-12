import { CheckCircle2, BrainCircuit, Sparkles, AlertCircle, Cpu, Zap } from "lucide-react";
import useDiagnosis from "../../hooks/useDiagnosis";

export default function AIBrain() {
  const diagnosis = useDiagnosis();
  const hasIncident = Boolean(diagnosis.root_cause && diagnosis.root_cause !== "None" && diagnosis.confidence > 0);

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/25 bg-linear-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <BrainCircuit size={18} className="animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-purple-200 to-purple-400 font-mono">
                  Sentinel AI Brain
                </h3>
                <span className="flex items-center gap-1 rounded border border-purple-500/40 bg-purple-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.25)]">
                  <Sparkles size={10} className="text-purple-400" />
                  NEURAL_MESH
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-500/70">
                Autonomous Root Cause Analysis & Deep Inference Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-black/60 px-3 py-0.5 text-[10px] font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <span
              className={`h-2 w-2 rounded-full ${
                hasIncident ? "bg-rose-500 animate-ping shadow-[0_0_8px_#ff0055]" : "bg-emerald-400 shadow-[0_0_8px_#00ff9d]"
              }`}
            />
            <span className={hasIncident ? "text-rose-300 font-bold" : "text-emerald-300 font-bold"}>
              {hasIncident ? "ANOMALY ISOLATED" : "SYSTEM NOMINAL"}
            </span>
          </div>
        </div>

        {/* Multi-Agent Reasoning Pipeline Bar */}
        <div className="mb-4 flex items-center justify-between gap-1 rounded-lg border border-cyan-500/25 bg-black/50 p-2 text-[10px] font-mono shadow-[inset_0_0_12px_rgba(0,240,255,0.05)]">
          <div className="flex items-center gap-1 text-cyan-300 font-bold">
            <Cpu size={12} className="text-cyan-400" />
            <span>1. Telemetry Ingest</span>
          </div>
          <span className="text-cyan-500/50">→</span>
          <div className={`flex items-center gap-1 font-bold ${hasIncident ? "text-amber-300" : "text-slate-400"}`}>
            <Zap size={11} className={hasIncident ? "text-amber-400 animate-pulse" : ""} />
            <span>2. Neural Triage</span>
          </div>
          <span className="text-cyan-500/50">→</span>
          <div className={`flex items-center gap-1 font-bold ${hasIncident ? "text-emerald-300" : "text-slate-400"}`}>
            <CheckCircle2 size={11} className={hasIncident ? "text-emerald-400" : ""} />
            <span>3. Safety Verified</span>
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Root Cause Card */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold">
              INFERRED ROOT CAUSE
            </span>

            {hasIncident ? (
              <div className="mt-1.5 flex items-start gap-2.5 rounded-lg border border-rose-500/50 bg-linear-to-r from-rose-950/40 to-black/60 p-3 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400 drop-shadow-[0_0_6px_rgba(255,0,85,0.8)]" />
                <p className="text-xs font-bold font-mono text-rose-200">
                  {diagnosis.root_cause}
                </p>
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs font-mono text-emerald-300/90 shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
                <span>Zero telemetry anomalies detected. All microservices operating within baseline thresholds.</span>
              </div>
            )}
          </div>

          {/* AI Confidence Meter */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold">
                DIAGNOSTIC CONFIDENCE SCORE
              </span>
              <span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                {diagnosis.confidence}%
              </span>
            </div>

            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/80 border border-cyan-500/30 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-500"
                style={{ width: `${diagnosis.confidence}%` }}
              />
            </div>
          </div>

          {/* AI Recommendation */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold">
              PRESCRIBED REMEDIATION RUNBOOK
            </span>

            <div className="mt-1.5 flex items-start gap-2.5 rounded-lg border border-cyan-500/20 bg-black/60 p-3 shadow-[inset_0_0_12px_rgba(0,240,255,0.03)]">
              <CheckCircle2
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]"
              />
              <p className="text-[11px] font-mono leading-relaxed text-slate-200">
                {diagnosis.recommendation || "System stable. Standing by to formulate mitigation tactics upon fault detection."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-cyan-500/20 pt-3 text-[10px] font-mono text-cyan-500/60 font-semibold">
        <span>MODEL: GEMINI / GROQ SRE POD</span>
        <span>LATENCY: ~140MS</span>
      </div>
    </div>
  );
}
