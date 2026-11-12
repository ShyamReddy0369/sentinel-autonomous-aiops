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
  const isAlert = color === "#FF0055" || color === "#EF4444" || color === "#DC2626";
  const isWarning = color === "#FFB800" || color === "#F59E0B";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border p-4 backdrop-blur-xl transition-all duration-300 ${
        isAlert
          ? "border-rose-500/60 bg-linear-to-b from-rose-950/40 to-black/70 shadow-[0_0_25px_rgba(255,0,85,0.25)]"
          : isWarning
          ? "border-amber-500/50 bg-linear-to-b from-amber-950/40 to-black/70 shadow-[0_0_25px_rgba(255,184,0,0.2)]"
          : "border-cyan-500/20 bg-linear-to-b from-[#060e22]/80 to-black/70 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
      }`}
    >
      {/* Top micro laser line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 transition-all duration-300"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-400/70 font-semibold">
          {title}
        </span>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200"
          style={{
            borderColor: `${color}40`,
            backgroundColor: `${color}15`,
            boxShadow: `0 0 10px ${color}20`,
          }}
        >
          <Icon size={14} style={{ color }} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span
          className="font-mono text-2xl font-black tracking-tight text-white"
          style={{
            textShadow: `0 0 16px ${color}40`,
          }}
        >
          {value}
        </span>

        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-tight border ${
            isAlert
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(255,0,85,0.3)]"
              : isWarning
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(255,184,0,0.3)]"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,157,0.3)]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isAlert
                ? "bg-rose-500 animate-ping shadow-[0_0_6px_#ff0055]"
                : isWarning
                ? "bg-amber-400"
                : "bg-emerald-400 shadow-[0_0_6px_#00ff9d]"
            }`}
          />
          {subtitle}
        </span>
      </div>
    </div>
  );
}
