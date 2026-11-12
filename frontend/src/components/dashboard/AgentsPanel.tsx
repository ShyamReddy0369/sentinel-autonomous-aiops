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
  const [data, setData] = useState<AgentResponse | null>(null);

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await api.get("/agents");
        setData(response.data);
      } catch (error) {
        console.error("Failed to load agents:", error);
      }
    }

    loadAgents();
    const interval = setInterval(loadAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <section className="rounded-xl border border-cyan-500/25 bg-[#060e22]/80 p-4.5 backdrop-blur-xl">
        <p className="font-mono text-xs text-cyan-500/70">Connecting to agent swarm mesh...</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-cyan-500/25 bg-gradient-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-300 font-mono">
              Sentinel AI Agent Mesh
            </h3>
            <span className="rounded border border-purple-500/40 bg-purple-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.25)]">
              AUTONOMOUS SWARM
            </span>
          </div>
          <p className="text-[11px] font-mono text-cyan-500/70">
            Multi-agent consensus architecture for telemetry anomaly detection, root cause diagnosis, safety validation & execution
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-0.5 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_12px_rgba(0,255,157,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00ff9d]" />
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
              className="flex flex-col justify-between rounded-lg border border-cyan-500/20 bg-black/50 p-3.5 transition hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.25)]">
                    <Icon size={14} />
                  </div>

                  <span
                    className={`flex items-center gap-1 font-mono text-[9px] font-bold uppercase rounded px-1.5 py-0.2 border ${
                      online
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,157,0.25)]"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        online ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#00ff9d]" : "bg-rose-400"
                      }`}
                    />
                    {agent.status}
                  </span>
                </div>

                <h4 className="mt-2.5 text-xs font-bold font-mono text-white">
                  {agent.name}
                </h4>

                <p className="mt-1 text-[11px] font-mono leading-relaxed text-slate-300">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 border-t border-cyan-500/20 pt-2 font-mono text-[9px] text-cyan-500/70 flex justify-between font-semibold">
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
