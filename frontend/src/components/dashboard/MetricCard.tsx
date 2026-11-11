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
      className={`group relative overflow-hidden rounded-xl border bg-[#0d121c]/70 p-4 backdrop-blur-md transition-all duration-200 hover:border-white/[0.15] ${
        isAlert
          ? "border-rose-500/40 shadow-lg shadow-rose-950/20"
          : isWarning
          ? "border-amber-500/40 shadow-lg shadow-amber-950/20"
          : "border-white/[0.06]"
      }`}
    >
      {/* Top micro hairline */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-80"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06]"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Icon size={14} style={{ color }} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-2xl font-bold tracking-tight text-white">
          {value}
        </span>

        <span
          className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
            isAlert
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : isWarning
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAlert
                ? "bg-rose-500 animate-ping"
                : isWarning
                ? "bg-amber-400"
                : "bg-emerald-400"
            }`}
          />
          {subtitle}
        </span>
      </div>
    </div>
  );
}