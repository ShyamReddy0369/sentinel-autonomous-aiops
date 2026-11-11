import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Activity, Radio } from "lucide-react";
import useTelemetry from "../../hooks/useTelemetry";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-md">
        <p className="font-mono text-[11px] text-slate-400">Timestamp: {label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function TelemetryChart() {
  const { data, loading } = useTelemetry();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Activity size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Live Infrastructure Telemetry
              </h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                1s Ingestion
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              Real-time CPU saturation & memory pressure stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <Radio size={14} className="animate-pulse" />
          <span>LIVE STREAM</span>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-xs text-slate-400">
          Ingesting telemetry stream...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-xs text-slate-400">
          Waiting for system metrics...
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#64748B"
                tick={{ fill: "#64748B", fontSize: 10 }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#64748B"
                tick={{ fill: "#64748B", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  paddingTop: "12px",
                  fontSize: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU Utilization"
                stroke="#06B6D4"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#06B6D4" }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="memory"
                name="Memory Pressure"
                stroke="#818CF8"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#818CF8" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}