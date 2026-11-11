import { CheckCircle2, BrainCircuit, Sparkles, AlertCircle } from "lucide-react";
import useDiagnosis from "../../hooks/useDiagnosis";

export default function AIBrain() {
  const diagnosis = useDiagnosis();
  const hasIncident = Boolean(diagnosis.root_cause && diagnosis.root_cause !== "None" && diagnosis.confidence > 0);

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-950/40">
              <BrainCircuit size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Sentinel AI Brain
                </h2>
                <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                  <Sparkles size={11} />
                  LLM Diagnosis
                </span>
              </div>

              <p className="mt-0.5 text-xs text-slate-400">
                Autonomous Root Cause Analysis & Inference Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                hasIncident ? "bg-rose-500 animate-ping" : "bg-emerald-400"
              }`}
            />
            <span>{hasIncident ? "Incident Active" : "Nominal"}</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Root Cause Card */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Inferred Root Cause
            </span>

            {hasIncident ? (
              <div className="mt-2 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <p className="text-sm font-semibold text-rose-200">
                  {diagnosis.root_cause}
                </p>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Zero telemetry anomalies detected. All services within threshold bounds.</span>
              </div>
            )}
          </div>

          {/* AI Confidence Meter */}
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-slate-400">
                Diagnostic Confidence
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {diagnosis.confidence}%
              </span>
            </div>

            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-950/80 border border-slate-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${diagnosis.confidence}%` }}
              />
            </div>
          </div>

          {/* AI Recommendation */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              AI Action Recommendation
            </span>

            <div className="mt-2 flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
              />
              <p className="text-xs leading-relaxed text-slate-300">
                {diagnosis.recommendation || "Monitoring active. Ready to formulate mitigation strategies upon anomaly spike."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
        <span>Model: Gemini 2.5 Pro Ops Agent</span>
        <span className="font-mono">P99 Latency: ~140ms</span>
      </div>
    </div>
  );
}