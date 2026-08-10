import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { useEffect, useState } from "react";
import api from "../../services/api";

interface Agent {
  name: string;
  status: string;
  description: string;
}

interface AgentResponse {
  total: number;
  online: number;
  agents: Agent[];
}

const icons = [
  BrainCircuit,
  Wrench,
  ShieldCheck,
  Activity,
  CheckCircle2,
];

export default function AgentsPanel() {

  const [data, setData] =
    useState<AgentResponse | null>(null);

  useEffect(() => {

    async function loadAgents() {

      try {

        const response =
          await api.get("/agents");

        setData(response.data);

      } catch (error) {

        console.error(
          "Failed to load agents:",
          error
        );
      }
    }

    loadAgents();

    const interval = setInterval(
      loadAgents,
      5000
    );

    return () => clearInterval(interval);

  }, []);

  if (!data) {

    return (
      <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
        <p className="text-slate-400">
          Loading AI agents...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Sentinel AI Agents
          </h2>

          <p className="text-sm text-slate-400">
            Autonomous operations agents
          </p>

        </div>

        <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
          {data.online} ONLINE
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {data.agents.map(
          (agent, index) => {

            const Icon =
              icons[index % icons.length];

            const online =
              agent.status === "ONLINE";

            return (
              <div
                key={agent.name}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-cyan-500/40"
              >

                <div className="flex items-start justify-between">

                  <div className="rounded-lg bg-cyan-500/10 p-2">

                    <Icon
                      size={22}
                      className="text-cyan-400"
                    />

                  </div>

                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      online
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >

                    <span
                      className={`h-2 w-2 rounded-full ${
                        online
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    />

                    {agent.status}

                  </span>

                </div>

                <h3 className="mt-4 font-semibold text-white">
                  {agent.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {agent.description}
                </p>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}