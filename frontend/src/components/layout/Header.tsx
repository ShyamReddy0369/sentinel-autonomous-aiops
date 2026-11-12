import { ShieldCheck, Flame, Radio, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import api from "../../services/api";

export default function Header() {
  const [injecting, setInjecting] = useState(false);

  async function triggerQuickChaos() {
    try {
      setInjecting(true);
      await api.post("/simulation/failure", {
        service_name: "Payment",
      });
      window.dispatchEvent(new Event("sentinel:refresh"));
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setInjecting(false), 800);
    }
  }

  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-cyan-500/20 bg-[#040814]/85 px-6 backdrop-blur-xl">
      {/* Top micro neon laser line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_rgba(0,240,255,0.8)]" />

      {/* Cyber Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <Zap size={13} className="text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider">SENTINEL</span>
        </span>
        <span className="text-cyan-500/40">::</span>
        <span className="text-slate-400">CLUSTER</span>
        <span className="text-cyan-500/40">/</span>
        <span className="text-slate-300">PROD-US-EAST</span>
        <span className="text-cyan-500/40">/</span>
        <span className="rounded bg-cyan-950/60 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
          MISSION_CONTROL
        </span>
      </div>

      {/* Global Status & Quick Trigger */}
      <div className="flex items-center gap-3">
        {/* Quick chaos injection action */}
        <button
          onClick={triggerQuickChaos}
          disabled={injecting}
          className="group relative flex items-center gap-1.5 overflow-hidden rounded-lg border border-rose-500/40 bg-linear-to-r from-rose-950/40 to-red-900/30 px-3 py-1 text-xs font-medium text-rose-200 transition-all duration-200 hover:border-rose-400 hover:shadow-[0_0_18px_rgba(255,0,85,0.4)] active:scale-95 disabled:opacity-50"
          title="Quick fault injection for demo"
        >
          <div className="absolute inset-0 bg-linear-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          {injecting ? (
            <RefreshCw size={12} className="animate-spin text-rose-400" />
          ) : (
            <Flame size={12} className="text-rose-400 group-hover:scale-125 transition-transform drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]" />
          )}
          <span className="font-mono text-[11px] tracking-wide">
            {injecting ? "INJECTING..." : "SIMULATE OUTAGE"}
          </span>
        </button>

        <div className="h-4 w-px bg-cyan-500/20" />

        {/* Global Cluster Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-300 shadow-[0_0_15px_rgba(0,255,157,0.2)]">
          <Radio size={12} className="animate-pulse text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,157,0.8)]" />
          <span className="tracking-wide">99.98% HEALTHY</span>
        </div>

        {/* SRE Guardian Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-[11px] text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          <ShieldCheck size={13} className="text-cyan-400 drop-shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
          <span className="font-mono text-[10px] tracking-wider text-cyan-200">AUTONOMOUS</span>
        </div>
      </div>
    </header>
  );
}
