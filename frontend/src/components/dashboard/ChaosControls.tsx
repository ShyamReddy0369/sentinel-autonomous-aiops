import {
  Database,
  Cpu,
  MemoryStick,
  Search,
  Zap,
} from "lucide-react";

import { useState } from "react";
import api from "../../services/api";

const services = [
  {
    name: "Authentication",
    description: "Simulate CPU thread saturation (>95%)",
    icon: Cpu,
  },
  {
    name: "Payment",
    description: "Simulate DB connection pool timeout",
    icon: Database,
  },
  {
    name: "Inventory",
    description: "Simulate cache memory pressure (>90%)",
    icon: MemoryStick,
  },
  {
    name: "Job Search API",
    description: "Simulate DB contention & query lag",
    icon: Search,
  },
];

export default function ChaosControls() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function triggerFailure(serviceName: string) {
    try {
      setLoading(serviceName);
      setMessage("");

      const response = await api.post(
        "/simulation/failure",
        {
          service_name: serviceName,
        }
      );

      setMessage(
        `🔥 Fault Injected: ${response.data.service_name} (${response.data.severity} - ${response.data.description})`
      );

      // Tell the browser to refresh all dashboard data immediately.
      window.dispatchEvent(
        new Event("sentinel:refresh")
      );

    } catch (error) {
      console.error(
        "Failed to trigger failure:",
        error
      );

      setMessage(
        "Failed to trigger simulated failure."
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-rose-500/10 p-3">
            <Zap
              size={24}
              className="text-rose-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Chaos Engineering Controls
            </h2>

            <p className="text-sm text-slate-400">
              Inject controlled infrastructure faults to evaluate AI response
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
          Fault Injection Ready
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {services.map((service) => {
          const Icon = service.icon;
          const isLoading = loading === service.name;

          return (
            <button
              key={service.name}
              onClick={() => triggerFailure(service.name)}
              disabled={loading !== null}
              className="group rounded-xl border border-slate-800 bg-slate-900/80 p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-rose-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-rose-950/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-rose-500/10 p-2.5 group-hover:bg-rose-500/20 transition">
                  <Icon
                    size={22}
                    className="text-rose-400"
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {isLoading ? "INJECTING..." : "TRIGGER"}
                </span>
              </div>

              <h3 className="mt-4 font-semibold text-white group-hover:text-rose-200 transition">
                {service.name}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {service.description}
              </p>
            </button>
          );
        })}

      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-200 flex items-center justify-between animate-fade-in">
          <span>{message}</span>
          <span className="text-xs text-rose-300/70">Metrics & Agents synchronizing...</span>
        </div>
      )}

    </section>
  );
}
