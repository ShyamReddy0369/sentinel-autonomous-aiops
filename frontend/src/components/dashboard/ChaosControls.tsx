import {
  Database,
  Cpu,
  MemoryStick,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

const scenarios = [
  {
    name: "Authentication",
    layer: "Compute Tier",
    title: "CPU Thread Saturation",
    description: "Simulate runaway crypto hashing loops (>95% CPU consumption)",
    icon: Cpu,
    blastRadius: "Login & JWT session verification",
    accentGlow: "hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(255,184,0,0.25)]",
    cardBorder: "border-amber-500/30 bg-linear-to-b from-amber-950/20 to-black/70",
    pillColor: "border-amber-400/40 bg-amber-500/15 text-amber-300 shadow-[0_0_8px_rgba(255,184,0,0.3)]",
    btnColor: "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500 hover:text-black shadow-[0_0_12px_rgba(255,184,0,0.2)]",
    iconColor: "text-amber-400",
  },
  {
    name: "Payment",
    layer: "Transaction Tier",
    title: "DB Lock Contention",
    description: "Simulate database connection pool exhaustion & transaction deadlocks",
    icon: Database,
    blastRadius: "Checkout pipeline & double-entry ledger",
    accentGlow: "hover:border-rose-400/60 hover:shadow-[0_0_20px_rgba(255,0,85,0.25)]",
    cardBorder: "border-rose-500/30 bg-linear-to-b from-rose-950/20 to-black/70",
    pillColor: "border-rose-400/40 bg-rose-500/15 text-rose-300 shadow-[0_0_8px_rgba(255,0,85,0.3)]",
    btnColor: "border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500 hover:text-white shadow-[0_0_12px_rgba(255,0,85,0.2)]",
    iconColor: "text-rose-400",
  },
  {
    name: "Inventory",
    layer: "Cache Tier",
    title: "Redis Key Eviction Storm",
    description: "Simulate cache miss stampedes & memory saturation (>90%)",
    icon: MemoryStick,
    blastRadius: "Catalog read queries cascading to DB",
    accentGlow: "hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]",
    cardBorder: "border-cyan-500/30 bg-linear-to-b from-cyan-950/20 to-black/70",
    pillColor: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.3)]",
    btnColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500 hover:text-black shadow-[0_0_12px_rgba(0,240,255,0.2)]",
    iconColor: "text-cyan-400",
  },
];

export default function ChaosControls() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function triggerFailure(serviceName: string) {
    try {
      setLoading(serviceName);
      setMessage("");

      const response = await api.post("/simulation/failure", {
        service_name: serviceName,
      });

      setMessage(
        `Fault Injected: ${response.data.service_name} — ${response.data.severity} (${response.data.description})`
      );

      // Refresh all dashboard metrics & diagnosis immediately
      window.dispatchEvent(new Event("sentinel:refresh"));
    } catch (error) {
      console.error("Failed to trigger failure:", error);
      setMessage("Failed to inject simulated failure.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-[#060b19]/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/15 text-rose-400 shadow-[0_0_12px_rgba(255,0,85,0.3)]">
            <Flame size={16} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-rose-100 to-rose-300 font-mono">
                Chaos Engineering Lab
              </h3>
              <span className="rounded border border-rose-500/40 bg-rose-500/15 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-300 shadow-[0_0_8px_rgba(255,0,85,0.25)]">
                FAULTS READY
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Inject microservice anomalies to test Sentinel's autonomous detection & remediation
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-cyan-400/80 font-semibold border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(0,240,255,0.15)]">
          TARGET: 3 PRODUCTION SERVICES
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isLoading = loading === scenario.name;

          return (
            <div
              key={scenario.name}
              className={`group flex flex-col justify-between rounded-lg border p-3.5 backdrop-blur-md transition-all duration-300 ${scenario.cardBorder} ${scenario.accentGlow}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/70 font-semibold">
                    {scenario.layer}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-mono font-bold border ${scenario.pillColor}`}
                  >
                    {scenario.name}
                  </span>
                </div>

                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 ${scenario.iconColor} transition`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-white group-hover:text-cyan-200 transition">
                      {scenario.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-300/80 font-mono">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <AlertTriangle size={10} className="text-amber-400" />
                  <span>Blast: {scenario.blastRadius}</span>
                </div>
              </div>

              <button
                onClick={() => triggerFailure(scenario.name)}
                disabled={loading !== null}
                className={`mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg border py-1.5 text-[11px] font-mono font-bold tracking-wide transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${scenario.btnColor}`}
              >
                <Zap size={12} className={isLoading ? "animate-spin" : ""} />
                <span>{isLoading ? "INJECTING FAULT..." : "SIMULATE OUTAGE"}</span>
              </button>
            </div>
          );
        })}
      </div>

      {message && (
        <div className="mt-3.5 flex items-center justify-between rounded-lg border border-rose-500/50 bg-linear-to-r from-rose-950/60 to-black/60 px-3.5 py-2 text-xs text-rose-200 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
            <span className="font-mono text-[11px]">{message}</span>
          </div>
          <span className="font-mono text-[10px] text-rose-300 font-semibold animate-pulse">AI Swarm Triaging...</span>
        </div>
      )}
    </section>
  );
}
