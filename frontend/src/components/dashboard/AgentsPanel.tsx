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
      <section className="rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
        <p className="font-mono text-xs text-slate-400">Loading AI agent mesh...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Sentinel AI Agent Mesh
            </h3>
            <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
              AUTONOMOUS SWARM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Multi-agent consensus architecture for detection, diagnosis, safety validation and execution
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{data.online} OF {data.total} ONLINE</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {data.agents.map((agent, index) => {
          const Icon = icons[index % icons.length];
          const online = agent.status === "ONLINE";

          return (
            <div
              key={agent.name}
              className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-black/40 p-3.5 transition hover:border-cyan-500/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-cyan-400">
                    <Icon size={14} />
                  </div>

                  <span
                    className={`flex items-center gap-1 font-mono text-[9px] font-semibold uppercase ${
                      online ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        online ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>

                <h4 className="mt-2.5 text-xs font-semibold text-white">
                  {agent.name}
                </h4>

                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 border-t border-white/[0.06] pt-2 font-mono text-[9px] text-slate-400 flex justify-between">
                <span>Model: Gemini</span>
                <span>Latency: 120ms</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}