import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import { Activity, Radio, Cpu, MemoryStick, TrendingUp, Sparkles, AlertOctagon } from "lucide-react";
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
      <div className="rounded-xl border border-cyan-500/40 bg-[#040814]/95 p-3 shadow-[0_0_25px_rgba(0,240,255,0.3)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-cyan-500/20 pb-1.5 mb-2">
          <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
            TIMESTAMP
          </span>
          <span className="font-mono text-[10px] text-slate-300 font-bold">{label}</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry) => {
            const isHigh = entry.value >= 90;
            return (
              <div key={entry.name} className="flex items-center justify-between gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 font-bold text-[11px]" style={{ color: entry.color }}>
                  <span
                    className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span
                  className={`font-mono font-black text-xs ${
                    isHigh
                      ? "text-rose-400 drop-shadow-[0_0_6px_rgba(255,0,85,0.9)] animate-pulse"
                      : "text-white"
                  }`}
                >
                  {entry.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

export default function TelemetryChart() {
  const { data, loading } = useTelemetry();
  const [filter, setFilter] = useState<"all" | "cpu" | "memory">("all");

  const latestPoint = data.length > 0 ? data[data.length - 1] : null;
  const currentCpu = latestPoint ? Math.round(latestPoint.cpu) : 0;
  const currentMem = latestPoint ? Math.round(latestPoint.memory) : 0;
  const peakCpu = data.length > 0 ? Math.round(Math.max(...data.map((d) => d.cpu))) : 0;

  const isCritical = currentCpu >= 90;

  return (
    <section className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-linear-to-b from-[#060e22]/95 via-[#040814]/90 to-black/90 p-5 backdrop-blur-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.8)]">
      {/* Top neon laser hairline */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 transition-all duration-500 ${
          isCritical
            ? "bg-linear-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#ff0055]"
            : "bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00f0ff]"
        }`}
      />

      {/* Header Deck: Controls, Title & Live Telemetry Pills */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3.5">
        {/* Left: Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 ${
              isCritical
                ? "border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(255,0,85,0.4)]"
                : "border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            }`}
          >
            {isCritical ? (
              <AlertOctagon size={18} className="animate-bounce text-rose-400" />
            ) : (
              <Activity size={18} className="animate-pulse text-cyan-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-cyan-100 to-cyan-300 font-mono">
                Real-Time Telemetry Stream & Load Spectrum
              </h3>
              <span className="flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-950/50 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                <Sparkles size={10} className="text-cyan-400" />
                HIGH FREQUENCY
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Live multi-service telemetry curves // Ingesting at 1,000ms resolution
            </p>
          </div>
        </div>

        {/* Center: Live Metric Stats Strip */}
        <div className="hidden sm:flex items-center gap-2 font-mono">
          {/* Current CPU Pill */}
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
              isCritical
                ? "border-rose-500/50 bg-rose-950/40 text-rose-300 shadow-[0_0_12px_rgba(255,0,85,0.3)]"
                : "border-cyan-500/30 bg-cyan-950/30 text-cyan-300"
            }`}
          >
            <Cpu size={12} className={isCritical ? "text-rose-400 animate-spin" : "text-cyan-400"} />
            <span className="text-[10px] uppercase text-slate-400">CPU:</span>
            <span className="font-black font-mono">{currentCpu}%</span>
          </div>

          {/* Current Memory Pill */}
          <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-xs text-purple-300">
            <MemoryStick size={12} className="text-purple-400" />
            <span className="text-[10px] uppercase text-slate-400">MEM:</span>
            <span className="font-black font-mono">{currentMem}%</span>
          </div>

          {/* Peak Recorded Pill */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-slate-300">
            <TrendingUp size={12} className="text-amber-400" />
            <span className="text-[10px] uppercase text-slate-400">PEAK:</span>
            <span className="font-black font-mono text-amber-300">{peakCpu}%</span>
          </div>
        </div>

        {/* Right: Stream Filters & Status Beacon */}
        <div className="flex items-center gap-2">
          {/* Filter segment */}
          <div className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-black/60 p-0.5 font-mono text-[10px]">
            <button
              onClick={() => setFilter("all")}
              className={`rounded px-2 py-0.5 font-bold transition-all ${
                filter === "all"
                  ? "border border-cyan-500/50 bg-cyan-500/20 text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.25)]"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilter("cpu")}
              className={`rounded px-2 py-0.5 font-bold transition-all ${
                filter === "cpu"
                  ? "border border-cyan-500/50 bg-cyan-500/20 text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.25)]"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              CPU
            </button>
            <button
              onClick={() => setFilter("memory")}
              className={`rounded px-2 py-0.5 font-bold transition-all ${
                filter === "memory"
                  ? "border border-purple-500/50 bg-purple-500/20 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.25)]"
                  : "text-slate-400 hover:text-purple-300"
              }`}
            >
              MEM
            </button>
          </div>

          {/* Ingesting Beacon */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_12px_rgba(0,255,157,0.2)]">
            <Radio size={11} className="animate-pulse text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
            <span>LIVE 1000MS</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {loading && data.length === 0 ? (
        <div className="flex h-72 items-center justify-center font-mono text-xs text-cyan-500/70">
          <Activity size={18} className="mr-2 animate-spin text-cyan-400" />
          ESTABLISHING TELEMETRY CONNECTION...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-72 items-center justify-center font-mono text-xs text-cyan-500/70">
          AWAITING INGESTED DATA VECTORS...
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                {/* Radiant Cyan Gradient for CPU */}
                <linearGradient id="cpuCyberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                </linearGradient>

                {/* Radiant Violet Gradient for Memory */}
                <linearGradient id="memCyberGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C084FC" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#C084FC" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(0, 240, 255, 0.08)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#00f0ff"
                tick={{ fill: "#64748B", fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#00f0ff"
                tick={{ fill: "#64748B", fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                unit="%"
              />

              {/* Critical SLA Threshold Line at 90% */}
              <ReferenceLine
                y={90}
                stroke="#FF0055"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: "CRITICAL BREACH THRESHOLD (90%)",
                  fill: "#FF0055",
                  fontSize: 9,
                  fontFamily: "monospace",
                  position: "insideTopRight",
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
              />

              {/* CPU Area / Line */}
              {(filter === "all" || filter === "cpu") && (
                <Area
                  type="monotone"
                  dataKey="cpu"
                  name="CPU Core Load"
                  stroke="#00F0FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cpuCyberGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#00F0FF",
                    stroke: "#030712",
                    strokeWidth: 2,
                    className: "drop-shadow-[0_0_8px_#00f0ff]",
                  }}
                  isAnimationActive={false}
                />
              )}

              {/* Memory Area / Line */}
              {(filter === "all" || filter === "memory") && (
                <Area
                  type="monotone"
                  dataKey="memory"
                  name="Memory Allocation"
                  stroke="#C084FC"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#memCyberGradient)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#C084FC",
                    stroke: "#030712",
                    strokeWidth: 2,
                    className: "drop-shadow-[0_0_8px_#c084fc]",
                  }}
                  isAnimationActive={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Sub-HUD Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-cyan-500/20 pt-2.5 text-[10px] font-mono text-cyan-500/70">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          STREAM: CONTINUOUS OBSERVABILITY FEED
        </span>
        <div className="flex items-center gap-3">
          <span>SAMPLING: 30 ROLLING FRAMES</span>
          <span>SLA RETENTION: ACTIVE</span>
        </div>
      </div>
    </section>
  );
}
