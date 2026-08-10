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

import useTelemetry from "../../hooks/useTelemetry";

export default function TelemetryChart() {
  const {
    data,
    loading,
  } = useTelemetry();

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#111827] p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Live Infrastructure Telemetry
          </h2>

          <p className="text-sm text-slate-400">
            Real-time CPU and memory utilization
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

          LIVE

        </div>

      </div>

      {loading && data.length === 0 ? (

        <div className="flex h-80 items-center justify-center text-slate-400">
          Collecting telemetry...
        </div>

      ) : data.length === 0 ? (

        <div className="flex h-80 items-center justify-center text-slate-400">
          Waiting for telemetry data...
        </div>

      ) : (

        <div className="h-80">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                stroke="#334155"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="time"
                stroke="#94A3B8"
                tick={{
                  fill: "#94A3B8",
                  fontSize: 11,
                }}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#94A3B8"
                tick={{
                  fill: "#94A3B8",
                  fontSize: 11,
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  border:
                    "1px solid #334155",
                  borderRadius: "8px",
                }}
                labelStyle={{
                  color: "#CBD5E1",
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />

              <Line
                type="monotone"
                dataKey="memory"
                name="Memory"
                stroke="#A78BFA"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>
      )}

    </section>
  );
}