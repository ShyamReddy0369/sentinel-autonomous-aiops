import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
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
      <div className="rounded-lg border border-white/[0.12] bg-[#0c1017]/95 p-2.5 shadow-2xl backdrop-blur-md">
        <p className="font-mono text-[10px] text-slate-400">T: {label}</p>
        <div className="mt-1.5 space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-[11px]" style={{ color: entry.color }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white text-[11px]">{entry.value}%</span>
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
    <section className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d121c]/70 p-4.5 backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Activity size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Real-Time Telemetry Stream
              </h3>
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono font-semibold text-cyan-300 border border-cyan-500/20">
                1000MS POLLING
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live CPU thread saturation & memory consumption curves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
          <Radio size={11} className="animate-pulse" />
          <span>INGESTING</span>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-xs font-mono text-slate-400">
          Connecting to telemetry socket...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-xs font-mono text-slate-400">
          Awaiting telemetry metrics...
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 10,
                left: -24,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#475569"
                tick={{ fill: "#64748B", fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#475569"
                tick={{ fill: "#64748B", fontSize: 9, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
              />

              <ReferenceLine
                y={90}
                stroke="#ef4444"
                strokeDasharray="3 3"
                label={{
                  value: "CRITICAL THRESHOLD (90%)",
                  fill: "#ef4444",
                  fontSize: 9,
                  fontFamily: "monospace",
                  position: "insideTopRight",
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Legend
                wrapperStyle={{
                  paddingTop: "8px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                }}
              />

              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU Load"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#06B6D4" }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="memory"
                name="Memory Load"
                stroke="#A855F7"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#A855F7" }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}