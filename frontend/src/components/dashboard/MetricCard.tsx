import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: MetricCardProps) {
  const isAlert = color === "#DC2626";
  const isWarning = color === "#F59E0B";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-slate-900/60 p-5 shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${
        isAlert
          ? "border-rose-500/40 shadow-rose-950/20"
          : isWarning
          ? "border-amber-500/40 shadow-amber-950/20"
          : "border-slate-800/80 hover:border-slate-700/80"
      }`}
    >
      {/* Top accent hairline */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 opacity-80"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
              {value}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                isAlert
                  ? "bg-rose-500 animate-ping"
                  : isWarning
                  ? "bg-amber-500"
                  : "bg-emerald-400"
              }`}
            />
            <span className="text-xs font-medium text-slate-400">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 shadow-inner"
          style={{
            backgroundColor: `${color}1A`, // 10% opacity
            borderColor: `${color}40`,
          }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}