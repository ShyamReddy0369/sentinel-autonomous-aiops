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
      <div className="rounded-lg border border-cyan-500/40 bg-[#040814]/95 p-2.5 shadow-[0_0_20px_rgba(0,240,255,0.25)] backdrop-blur-xl">
        <p className="font-mono text-[10px] text-cyan-400 font-bold">TIME: {label}</p>
        <div className="mt-1.5 space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 font-bold text-[11px]" style={{ color: entry.color }}>
                <span className="h-2 w-2 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-black text-white text-[11px]">{entry.value}%</span>
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
    <section className="relative overflow-hidden rounded-xl border border-cyan-500/25 bg-gradient-to-b from-[#060e22]/90 to-black/80 p-4.5 backdrop-blur-xl shadow-[0_4px_24px_-1px_rgba(0,0,0,0.6)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Activity size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 font-mono">
                Real-Time Telemetry Stream
              </h3>
              <span className="rounded border border-cyan-500/40 bg-cyan-950/40 px-1.5 py-0.2 text-[9px] font-mono font-bold text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                1000MS INTERVAL
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyan-500/70">
              Live CPU thread saturation & memory consumption curves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-0.5 text-[10px] font-mono font-bold text-emerald-300 shadow-[0_0_12px_rgba(0,255,157,0.2)]">
          <Radio size={11} className="animate-pulse text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
          <span>INGESTING</span>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-xs font-mono text-cyan-500/70">
          Connecting to telemetry socket...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-xs font-mono text-cyan-500/70">
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
                stroke="rgba(0, 240, 255, 0.07)"
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
              />

              <ReferenceLine
                y={90}
                stroke="#FF0055"
                strokeDasharray="4 4"
                label={{
                  value: "CRITICAL THRESHOLD (90%)",
                  fill: "#FF0055",
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
                stroke="#00F0FF"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#00F0FF", stroke: "#003b4d", strokeWidth: 2 }}
                isAnimationActive={false}
              />

              <Line
                type="monotone"
                dataKey="memory"
                name="Memory Load"
                stroke="#C084FC"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#C084FC", stroke: "#3b1154", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
