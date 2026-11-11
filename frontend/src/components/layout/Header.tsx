import { Bell, ShieldCheck, Terminal, Cpu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-400">
          <Terminal size={14} className="text-cyan-400" />
          <span className="font-mono text-[11px] text-slate-300">sentinel-ops.cluster.prod</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-2.5 py-1 text-xs text-slate-400">
          <Cpu size={13} className="text-purple-400" />
          <span className="text-[11px]">Region: us-east-1</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">AUTONOMOUS GUARDIAN:</span>
          <span>ONLINE</span>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition hover:text-white">
          <Bell size={16} />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
          <ShieldCheck size={16} className="text-cyan-400" />
          <span className="hidden md:inline font-semibold">Incident Commander</span>
          <span className="font-mono text-[11px] text-slate-400">v2.4</span>
        </div>
      </div>
    </header>
  );
}