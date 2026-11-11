import {
  Database,
  Cpu,
  MemoryStick,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

const scenarios = [
  {
    name: "Authentication",
    layer: "Compute Tier",
    title: "CPU Thread Saturation",
    description: "Simulate high-concurrency hashing overload (>95% CPU)",
    icon: Cpu,
    blastRadius: "Login & JWT verification",
    accentGlow: "hover:border-amber-500/40 hover:shadow-amber-950/20",
    pillColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  },
  {
    name: "Payment",
    layer: "Transaction Tier",
    title: "DB Pool Exhaustion",
    description: "Simulate database connection pool timeout & contention",
    icon: Database,
    blastRadius: "Checkout & Ledger writes",
    accentGlow: "hover:border-rose-500/40 hover:shadow-rose-950/20",
    pillColor: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  },
  {
    name: "Inventory",
    layer: "Cache Tier",
    title: "Redis Memory Pressure",
    description: "Simulate Redis key cache thrashing & memory spikes (>90%)",
    icon: MemoryStick,
    blastRadius: "Catalog read latency",
    accentGlow: "hover:border-cyan-500/40 hover:shadow-cyan-950/20",
    pillColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
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
    <section className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4 backdrop-blur-md">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <Flame size={14} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Chaos Engineering Lab
              </h3>
              <span className="rounded bg-rose-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-rose-400 border border-rose-500/20">
                FAULTS ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inject microservice anomalies to test Sentinel's autonomous detection & remediation
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-slate-400">
          Target Scope: 3 Production Services
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isLoading = loading === scenario.name;

          return (
            <div
              key={scenario.name}
              className={`group flex flex-col justify-between rounded-lg border border-white/[0.06] bg-black/40 p-3.5 transition-all duration-200 ${scenario.accentGlow}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-slate-400">
                    {scenario.layer}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-semibold border ${scenario.pillColor}`}
                  >
                    {scenario.name}
                  </span>
                </div>

                <div className="mt-2.5 flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-300 group-hover:text-white transition">
                    <Icon size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-rose-200 transition">
                      {scenario.title}
                    </h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      {scenario.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <AlertTriangle size={10} className="text-amber-400/80" />
                  <span>Blast: {scenario.blastRadius}</span>
                </div>
              </div>

              <button
                onClick={() => triggerFailure(scenario.name)}
                disabled={loading !== null}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 py-1.5 text-[11px] font-mono font-semibold text-rose-300 transition hover:bg-rose-500 hover:text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Flame size={12} className={isLoading ? "animate-spin" : ""} />
                <span>{isLoading ? "Injecting Fault..." : "Simulate Outage"}</span>
              </button>
            </div>
          );
        })}
      </div>

      {message && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-rose-400 shrink-0" />
            <span className="font-mono text-[11px]">{message}</span>
          </div>
          <span className="font-mono text-[10px] text-rose-300/80">AI Agents Triaging...</span>
        </div>
      )}
    </section>
  );
}
