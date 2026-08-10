import {
  Database,
  Cpu,
  MemoryStick,
  Zap,
} from "lucide-react";

import { useState } from "react";
import api from "../../services/api";

const services = [
  {
    name: "Authentication",
    description: "Simulate CPU saturation",
    icon: Cpu,
  },
  {
    name: "Payment",
    description: "Simulate database timeout",
    icon: Database,
  },
  {
    name: "Inventory",
    description: "Simulate memory pressure",
    icon: MemoryStick,
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
        `🔥 ${response.data.service_name} failure triggered`
      );

      // Tell the browser to refresh all dashboard data.
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

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-red-500/10 p-3">
          <Zap
            size={24}
            className="text-red-400"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Chaos Control
          </h2>

          <p className="text-sm text-slate-400">
            Simulate infrastructure failures
          </p>
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-3">

        {services.map((service) => {

          const Icon = service.icon;

          const isLoading =
            loading === service.name;

          return (
            <button
              key={service.name}
              onClick={() =>
                triggerFailure(service.name)
              }
              disabled={loading !== null}
              className="group rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-red-500/40 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <div className="flex items-center justify-between">

                <div className="rounded-lg bg-red-500/10 p-2">
                  <Icon
                    size={22}
                    className="text-red-400"
                  />
                </div>

                <span className="text-xs font-semibold text-red-400">
                  {isLoading
                    ? "TRIGGERING..."
                    : "SIMULATE"}
                </span>

              </div>

              <h3 className="mt-4 font-semibold text-white">
                {service.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {service.description}
              </p>

            </button>
          );
        })}

      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {message}
        </div>
      )}

    </section>
  );
}