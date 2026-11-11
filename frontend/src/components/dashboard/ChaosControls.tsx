import {
  Database,
  Cpu,
  MemoryStick,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

const services = [
  {
    name: "Authentication",
    category: "Compute Layer",
    description: "Simulate CPU thread saturation (>95%)",
    icon: Cpu,
    tag: "High CPU Spike",
    accentColor: "from-amber-500/20 to-rose-500/20 border-rose-500/30",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  {
    name: "Payment",
    category: "Transaction Layer",
    description: "Simulate DB connection pool timeout & contention",
    icon: Database,
    tag: "DB Connection Pool",
    accentColor: "from-blue-500/20 to-purple-500/20 border-purple-500/30",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    name: "Inventory",
    category: "Data Store Layer",
    description: "Simulate Redis cache memory pressure (>90%)",
    icon: MemoryStick,
    tag: "Cache Eviction",
    accentColor: "from-cyan-500/20 to-emerald-500/20 border-cyan-500/30",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
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

      // Tell all dashboard components to synchronize state immediately.
      window.dispatchEvent(new Event("sentinel:refresh"));
    } catch (error) {
      console.error("Failed to trigger failure:", error);
      setMessage("Failed to inject simulated failure.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      {/* Background ambient subtle accent */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-rose-500/5 blur-3xl" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-sm shadow-rose-950/40">
            <Flame size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Chaos Engineering Lab
              </h2>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-300">
                Interactive Fault Injection
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Trigger controlled microservice failures to demonstrate autonomous AI detection and remediation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Simulation Engine Ready</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isLoading = loading === service.name;

          return (
            <button
              key={service.name}
              onClick={() => triggerFailure(service.name)}
              disabled={loading !== null}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-slate-950/70 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20 disabled:cursor-not-allowed disabled:opacity-50 ${service.accentColor}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-white transition group-hover:border-rose-500/40 group-hover:text-rose-300">
                    <Icon size={20} />
                  </div>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${service.badgeColor}`}
                  >
                    {service.tag}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {service.category}
                  </span>
                  <h3 className="text-base font-semibold text-white group-hover:text-rose-200 transition">
                    {service.name} Service
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300">
                  Click to stress test
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-300 transition group-hover:bg-rose-500 group-hover:text-white">
                  <Flame size={13} />
                  {isLoading ? "INJECTING..." : "INJECT FAULT"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-200 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
            <span>{message}</span>
          </div>
          <span className="text-[11px] text-rose-300/80">AI Commander analyzing root cause...</span>
        </div>
      )}
    </section>
  );
}
